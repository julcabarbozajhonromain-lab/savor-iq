import { GoogleGenerativeAI } from '@google/generative-ai';
import { getProjectEnv } from './env-reader';
import { extractAndParseJson } from './json-parser';
import { buildPeruvianCulinaryContextForChef } from '$lib/data/peruvian-cuisine-catalog';
import {
  NutritionAnalysisSchema,
  RecipesResponseSchema,
  MealPlanSchema,
  type NutritionAnalysis,
  type RecipesResponse,
  type MealPlan
} from '$lib/types/ai-schemas';

/**
 * Obtiene todas las claves de Gemini configuradas en el archivo .env del proyecto
 */
export function getGeminiApiKeys(): string[] {
  const primary = getProjectEnv('GEMINI_API_KEY');
  const fallback = getProjectEnv('GEMINI_API_KEY_FALLBACK');
  const keys = [primary, fallback].map((k) => k.trim()).filter((k) => k.length > 0);
  return [...new Set(keys)];
}

export function getGeminiApiKey(): string {
  const keys = getGeminiApiKeys();
  return keys[0] || '';
}

export function isGeminiConfigured(): boolean {
  return getGeminiApiKeys().length > 0;
}

function cleanBase64(base64: string): { data: string; mimeType: string } {
  const match = base64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (match) {
    return { mimeType: match[1], data: match[2] };
  }
  return { mimeType: 'image/jpeg', data: base64 };
}

interface GeminiPart {
  text?: string;
  inlineData?: {
    data: string;
    mimeType: string;
  };
}

/**
 * Llama al endpoint de Vertex AI Express Mode (para claves AQ.Ab8...)
 * URL oficial: https://aiplatform.googleapis.com/v1/publishers/google/models/{MODEL_ID}:generateContent
 */
async function callVertexExpressRest(
  apiKey: string,
  modelName: string,
  parts: GeminiPart[],
  temperature = 0.7
): Promise<string> {
  const restParts = parts.map((p) => {
    if (p.inlineData) {
      return {
        inlineData: {
          mimeType: p.inlineData.mimeType,
          data: p.inlineData.data
        }
      };
    }
    return { text: p.text || '' };
  });

  const endpoints = [
    `https://aiplatform.googleapis.com/v1/publishers/google/models/${modelName}:generateContent`,
    `https://aiplatform.googleapis.com/v1beta1/publishers/google/models/${modelName}:generateContent`
  ];

  let lastErr: unknown = null;

  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: restParts }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error?.message || `HTTP ${response.status}`;
        throw new Error(errorMsg);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('Respuesta vacía desde Vertex AI Express Mode');
      }

      return text;
    } catch (err) {
      lastErr = err;
    }
  }

  throw lastErr;
}

/**
 * Llama al endpoint clásico de Google AI Studio (generativelanguage.googleapis.com)
 */
async function callAIStudioSdk(
  apiKey: string,
  modelName: string,
  parts: GeminiPart[],
  temperature = 0.7
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature
    }
  });

  const sdkParts = parts.map((p) => {
    if (p.inlineData) {
      return {
        inlineData: {
          data: p.inlineData.data,
          mimeType: p.inlineData.mimeType
        }
      };
    }
    return p.text || '';
  });

  const result = await model.generateContent(sdkParts);
  return result.response.text();
}

/**
 * Ejecuta la consulta probando las claves disponibles y los endpoints compatibles:
 * - Si la clave inicia con "AQ.", prioriza Vertex AI Express Mode (aiplatform.googleapis.com) con x-goog-api-key
 *   y respalda en generativelanguage.googleapis.com.
 * - Si la clave inicia con "AIza", usa generativelanguage.googleapis.com.
 */
async function callGeminiWithFallback(
  parts: GeminiPart[],
  temperature = 0.7
): Promise<string> {
  const apiKeys = getGeminiApiKeys();
  if (apiKeys.length === 0) {
    throw new Error('GEMINI_API_KEY no está configurada en .env');
  }

  const vertexModels = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-flash'
  ];

  const studioModels = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash',
    'gemini-1.5-flash'
  ];

  let lastError: unknown = null;

  for (const apiKey of apiKeys) {
    const isVertexExpressKey = apiKey.startsWith('AQ.');

    if (isVertexExpressKey) {
      // 1. Intentar Vertex AI Express Mode (aiplatform.googleapis.com) con x-goog-api-key
      for (const modelName of vertexModels) {
        try {
          console.log(`🤖 [Vertex Express] Probando modelo ${modelName}...`);
          return await callVertexExpressRest(apiKey, modelName, parts, temperature);
        } catch (err) {
          console.warn(
            `⚠️ [Vertex Express] Falló ${modelName}:`,
            err instanceof Error ? err.message : err
          );
          lastError = err;
        }
      }

      // 2. Respaldo en generativelanguage.googleapis.com por si la clave AQ. está habilitada allí
      for (const modelName of studioModels) {
        try {
          console.log(`🤖 [AI Studio] Probando modelo ${modelName}...`);
          return await callAIStudioSdk(apiKey, modelName, parts, temperature);
        } catch (err) {
          console.warn(
            `⚠️ [AI Studio] Falló ${modelName}:`,
            err instanceof Error ? err.message : err
          );
          lastError = err;
          const msg = err instanceof Error ? err.message : String(err);
          if (msg.includes('ACCESS_TOKEN_TYPE_UNSUPPORTED')) {
            break; // Este endpoint no soporta esta clave AQ., pasar a la siguiente clave
          }
        }
      }
    } else {
      // Clave clásica AIzaSy...
      for (const modelName of studioModels) {
        try {
          console.log(`🤖 [AI Studio] Probando modelo ${modelName}...`);
          return await callAIStudioSdk(apiKey, modelName, parts, temperature);
        } catch (err) {
          console.warn(
            `⚠️ [AI Studio] Falló ${modelName}:`,
            err instanceof Error ? err.message : err
          );
          lastError = err;
        }
      }
    }
  }

  throw lastError || new Error('No se pudo conectar con Google Gemini');
}

/**
 * Analiza un plato completo con Gemini Flash en 1 sola llamada multimodal
 */
export async function analyzePlateWithGemini(imageBase64: string): Promise<NutritionAnalysis> {
  const { data, mimeType } = cleanBase64(imageBase64);

  const prompt = `Actúa como un nutricionista y dietista clínico experto especializado en gastronomía peruana e internacional (Contexto: Perú 🇵🇪).
Analiza la imagen de este plato de comida con precisión profesional:
1. Identifica el nombre exacto del plato principal (reconociendo platos peruanos como Arroz con Pollo, Lomo Saltado, Arroz Chaufa, Ceviche, Ají de Gallina, Tallarines Verdes, Tallarín Saltado, Causa Limeña, Papa a la Huancaína, Seco con Frejoles, Aguadito, Lentejitas con arroz, Pollo a la Brasa, Caldo de Gallina, Sangrecita, etc.) y todos los alimentos/guarniciones visibles usando vocabulario peruano (culantro, palta, choclo, camote, alverjitas, yuca, zarza criolla).
2. Estima el tamaño de la porción peruana real y calcula con realismo:
   - Calorías totales (estimatedCalories)
   - Macronutrientes en gramos: proteína (protein), carbohidratos (carbs), grasa (fat), fibra (fiber).
3. Evalúa la calidad nutricional con un healthScore del 1 al 10 fundamentado en balance calórico, fibra, calidad de proteínas y control de doble carbohidrato (ej. arroz + papa).
4. Redacta un veredicto nutricional profesional, cercano y conciso.
5. Ofrece de 2 a 3 sugerencias prácticas adaptadas a Perú (ej. agregar zarza criolla, moderar la porción de arroz, reemplazar fritura por Air Fryer).

Esquema JSON obligatorio:
{
  "dishName": "Nombre del plato",
  "estimatedCalories": 450,
  "macronutrients": {
    "protein": 30,
    "carbs": 45,
    "fat": 12,
    "fiber": 6
  },
  "healthScore": 8,
  "verdict": "Explicación del balance nutricional...",
  "suggestions": ["Sugerencia 1", "Sugerencia 2"],
  "ingredients": ["ingrediente 1", "ingrediente 2"]
}`;

  const rawJson = await callGeminiWithFallback(
    [
      { text: prompt },
      { inlineData: { data, mimeType } }
    ],
    0.2
  );

  return extractAndParseJson(rawJson, NutritionAnalysisSchema);
}

/**
 * Detecta ingredientes en una foto y genera recetas creativas en 1 sola llamada multimodal
 */
export async function generateRecipesFromImageWithGemini(
  imageBase64: string,
  extraIngredients?: string
): Promise<RecipesResponse> {
  const { data, mimeType } = cleanBase64(imageBase64);
  const extra = extraIngredients
    ? `Ingredientes adicionales aportados por el usuario: "${extraIngredients}".`
    : '';
  const peruvianContext = buildPeruvianCulinaryContextForChef(extraIngredients || '');

  const prompt = `Actúa como un Chef peruano experto en gastronomía criolla, casera, andina, chifa y saludable.
Mira la imagen: identifica todos los alimentos e ingredientes disponibles visibles.
${extra}
${peruvianContext}

Diseña de 2 a 3 recetas auténticas, deliciosas y realistas que aprovechen al máximo los ingredientes visibles priorizando el recetario peruano cuando los ingredientes coincidan (ej. Arroz con Pollo, Aguadito, Lomo/Pollo Saltado, Chaufa, Tallarines Verdes, Causa, Sudado, etc.).
Para cada receta incluye:
- name: Nombre del plato (destacando su identidad peruana si aplica)
- prepTime: Tiempo estimado de preparación (ej: "25 min")
- ingredients: Lista de ingredientes con cantidades aproximadas en términos peruanos
- instructions: Pasos claros y concisos SIN número al inicio (incluyendo la técnica del aderezo peruano)
- missingIngredients: Ingredientes adicionales opcionales para completar el aderezo peruano (ej: ají amarillo, sillao, kión, alverjitas, culantro)

Esquema JSON obligatorio:
{
  "recipes": [
    {
      "name": "Nombre de la receta",
      "prepTime": "20 min",
      "ingredients": ["ingrediente 1", "ingrediente 2"],
      "instructions": ["Paso...", "Paso..."],
      "missingIngredients": []
    }
  ]
}`;

  const rawJson = await callGeminiWithFallback(
    [
      { text: prompt },
      { inlineData: { data, mimeType } }
    ],
    0.7
  );

  return extractAndParseJson(rawJson, RecipesResponseSchema);
}

/**
 * Genera recetas a partir de texto con Gemini Flash + Motor RAG Gastronómico Peruano
 */
export async function generateRecipesWithGeminiText(
  ingredientsText: string
): Promise<RecipesResponse> {
  const peruvianContext = buildPeruvianCulinaryContextForChef(ingredientsText);

  const prompt = `Actúa como un Chef peruano profesional experto en gastronomía peruana (criolla, casera de diario, chifa, marina, andina y versión Fit saludable).
Con estos ingredientes disponibles del usuario: "${ingredientsText}".
${peruvianContext}

Genera de 2 a 3 recetas fáciles, deliciosas y nutritivas:
- Si los ingredientes coinciden con platos del catálogo peruano (por ejemplo: arroz + culantro/cilantro + espinaca + pollo -> "Arroz con Pollo Peruano" y "Aguadito de Pollo", o versión Fit), DEBES priorizar esos platos peruanos auténticos explicando su aderezo real.
- Para cada receta incluye:
  • name: Nombre del plato
  • prepTime: Tiempo de preparación estimado (ej: "25 min")
  • ingredients: Lista de ingredientes con cantidades aproximadas usando nombres peruanos (culantro, palta, sillao, kión, alverjitas, choclo, camote, etc.)
  • instructions: Pasos claros y detallados (no pongas "1." al inicio de cada texto)
  • missingIngredients: Ingredientes opcionales del aderezo peruano que elevarían el plato (ej: ají amarillo, cerveza negra, alverjitas, pimiento, sillao)

Esquema JSON obligatorio:
{
  "recipes": [
    {
      "name": "Nombre de la receta",
      "prepTime": "25 min",
      "ingredients": ["ingrediente 1", "ingrediente 2"],
      "instructions": ["Sofríe la cebolla con el ajo y el ají amarillo...", "Incorpora el licuado de culantro y espinaca..."],
      "missingIngredients": ["ají amarillo", "alverjitas"]
    }
  ]
}`;

  const rawJson = await callGeminiWithFallback([{ text: prompt }], 0.7);
  return extractAndParseJson(rawJson, RecipesResponseSchema);
}

/**
 * Genera el plan semanal completo de 7 días y la lista de compras con Gemini Flash adaptado a Perú
 */
export async function generateMealPlanWithGemini(
  preferences?: string,
  dietaryRestrictions?: string
): Promise<MealPlan> {
  const prompt = `Eres un nutricionista clínico experto en gastronomía peruana saludable (Contexto: Perú 🇵🇪). Genera un plan de comidas semanal completo de 7 días (Lunes a Domingo) con platos peruanos caseros, ricos, saludables y fáciles de preparar con ingredientes de mercados y bodegas de Perú (ej: quinua, palta, camote, choclo, lentejitas, frejoles, pollo, pescado, huevos, queso fresco, culantro, espinaca, avena, frutas de estación).
Preferencias del usuario: ${preferences || 'Comida peruana casera equilibrada'}
Restricciones dietéticas: ${dietaryRestrictions || 'Ninguna'}

Responde estrictamente con este formato JSON:
{
  "weeklyPlan": [
    {
      "day": "Lunes",
      "meals": {
        "breakfast": { "name": "...", "calories": 350, "ingredients": ["..."], "instructions": "..." },
        "lunch": { "name": "...", "calories": 550, "ingredients": ["..."], "instructions": "..." },
        "dinner": { "name": "...", "calories": 400, "ingredients": ["..."], "instructions": "..." }
      },
      "totalCalories": 1300
    }
  ],
  "shoppingList": {
    "proteins": ["pechuga de pollo 1kg", "filete de pescado 500g", "huevos 15 unidades"],
    "vegetables": ["culantro 1 atado", "espinaca 1 atado", "ají amarillo 4 unidades", "tomates 6 unidades", "cebolla roja 1kg"],
    "grains": ["arroz 1kg", "quinua 500g", "lentejas 500g", "camote 1kg"],
    "dairy": ["queso fresco 250g", "yogurt griego o leche"],
    "fruits": ["palta fuerte 3 unidades", "limón peruano 500g", "plátano de seda 6 unidades"],
    "other": ["aceite de oliva", "sillao", "kión"]
  },
  "weeklyNutrition": {
    "totalCalories": 9100,
    "averageDailyCalories": 1300,
    "proteinPercentage": 25,
    "carbsPercentage": 50,
    "fatPercentage": 25
  }
}
IMPORTANTE: Incluye los 7 días completos (Lunes a Domingo), calcula calorías realistas y genera una lista de compras organizada por categorías.`;

  const rawJson = await callGeminiWithFallback([{ text: prompt }], 0.7);
  return extractAndParseJson(rawJson, MealPlanSchema);
}
