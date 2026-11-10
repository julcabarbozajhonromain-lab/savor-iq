import { GoogleGenerativeAI } from '@google/generative-ai';
import { getProjectEnv } from './env-reader';
import { extractAndParseJson } from './json-parser';
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

  const prompt = `Actúa como un nutricionista y dietista clínico experto.
Analiza la imagen de este plato de comida con precisión profesional:
1. Identifica el nombre del plato principal y todos los alimentos/ingredientes visibles.
2. Estima el tamaño de la porción y calcula con realismo:
   - Calorías totales (estimatedCalories)
   - Macronutrientes en gramos: proteína (protein), carbohidratos (carbs), grasa (fat), fibra (fiber).
3. Evalúa la calidad nutricional con un healthScore del 1 al 10 fundamentado en balance calórico, fibra, calidad de proteínas y grasas.
4. Redacta un veredicto nutricional profesional y conciso.
5. Ofrece de 2 a 3 sugerencias prácticas para balancear o mejorar este plato.

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

  const prompt = `Actúa como un Chef profesional enfocado en cocina sostenible y aprovechamiento de despensa.
Mira la imagen: identifica todos los alimentos e ingredientes disponibles visibles.
${extra}
Diseña de 2 a 3 recetas prácticas, deliciosas y realistas que aprovechen al máximo los ingredientes visibles.
Para cada receta incluye:
- name: Nombre del plato
- prepTime: Tiempo estimado de preparación (ej: "25 min")
- ingredients: Lista de ingredientes con cantidades aproximadas
- instructions: Pasos numerados claros y concisos
- missingIngredients: Ingredientes adicionales opcionales o especias sugeridas

Esquema JSON obligatorio:
{
  "recipes": [
    {
      "name": "Nombre de la receta",
      "prepTime": "20 min",
      "ingredients": ["ingrediente 1", "ingrediente 2"],
      "instructions": ["Paso 1...", "Paso 2..."],
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
 * Genera recetas a partir de texto con Gemini Flash
 */
export async function generateRecipesWithGeminiText(
  ingredientsText: string
): Promise<RecipesResponse> {
  const prompt = `Actúa como un Chef profesional enfocado en cocina creativa y aprovechamiento de despensa.
Con estos ingredientes disponibles: "${ingredientsText}".
Genera de 2 a 3 recetas fáciles, deliciosas y nutritivas.
Para cada receta incluye:
- name: Nombre del plato
- prepTime: Tiempo de preparación estimado (ej: "20 min")
- ingredients: Lista de ingredientes con cantidades aproximadas
- instructions: Pasos numerados claros y detallados
- missingIngredients: Ingredientes adicionales opcionales o especias recomendadas

Esquema JSON obligatorio:
{
  "recipes": [
    {
      "name": "Nombre de la receta",
      "prepTime": "20 min",
      "ingredients": ["ingrediente 1", "ingrediente 2"],
      "instructions": ["Paso 1...", "Paso 2..."],
      "missingIngredients": []
    }
  ]
}`;

  const rawJson = await callGeminiWithFallback([{ text: prompt }], 0.7);
  return extractAndParseJson(rawJson, RecipesResponseSchema);
}

/**
 * Genera el plan semanal completo de 7 días y la lista de compras con Gemini Flash
 */
export async function generateMealPlanWithGemini(
  preferences?: string,
  dietaryRestrictions?: string
): Promise<MealPlan> {
  const prompt = `Eres un nutricionista experto. Genera un plan de comidas semanal completo de 7 días (Lunes a Domingo).
Preferencias del usuario: ${preferences || 'Sin preferencias específicas'}
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
    "proteins": ["pollo 1kg"],
    "vegetables": ["tomates 6 unidades"],
    "grains": ["arroz 1kg"],
    "dairy": ["leche 1L"],
    "fruits": ["manzanas 6 unidades"],
    "other": ["aceite de oliva"]
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
