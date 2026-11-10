import Groq from 'groq-sdk';
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

export function getGroqApiKey(): string {
  return getProjectEnv('GROQ_API_KEY');
}

export function isGroqConfigured(): boolean {
  return getGroqApiKey().length > 0;
}

export function getGroqClient(): Groq {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    throw new Error('GROQ_API_KEY no está configurada.');
  }
  return new Groq({ apiKey });
}

function cleanBase64Url(base64: string): string {
  if (base64.startsWith('data:')) {
    return base64;
  }
  return `data:image/jpeg;base64,${base64}`;
}

/**
 * Genera recetas a partir de texto con LLaMA 3.3 70B en Groq
 */
export async function generateRecipesWithGroqText(ingredientsText: string): Promise<RecipesResponse> {
  const client = getGroqClient();
  const completion = await client.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `Eres un chef profesional. Genera de 2 a 3 recetas creativas con los ingredientes provistos.
Responde estrictamente en formato JSON válido con esta forma:
{
  "recipes": [
    {
      "name": "Nombre",
      "prepTime": "20 min",
      "ingredients": ["ingrediente 1", "ingrediente 2"],
      "instructions": ["paso 1", "paso 2"],
      "missingIngredients": []
    }
  ]
}`
      },
      {
        role: 'user',
        content: `Ingredientes disponibles: "${ingredientsText}". Crea las recetas.`
      }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 2500,
    response_format: { type: 'json_object' }
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('No se recibió respuesta de Groq');

  return extractAndParseJson(content, RecipesResponseSchema);
}

/**
 * Analiza un plato con Groq Vision (LLaMA 3.2 11B Vision)
 */
export async function analyzePlateWithGroqVision(imageBase64: string): Promise<NutritionAnalysis> {
  const client = getGroqClient();
  const imageUrl = cleanBase64Url(imageBase64);

  const completion = await client.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Actúa como nutricionista. Analiza la comida de la imagen.
Calcula calorías realistas, proteínas, carbohidratos, grasas y fibra en gramos.
Responde estrictamente en formato JSON:
{
  "dishName": "Nombre del plato",
  "estimatedCalories": 450,
  "macronutrients": {
    "protein": 28,
    "carbs": 40,
    "fat": 15,
    "fiber": 5
  },
  "healthScore": 8,
  "verdict": "Breve veredicto nutricional",
  "suggestions": ["consejo 1", "consejo 2"],
  "ingredients": ["ingrediente 1", "ingrediente 2"]
}`
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl }
          }
        ]
      }
    ],
    model: 'llama-3.2-11b-vision-preview',
    temperature: 0.2,
    max_tokens: 1500,
    response_format: { type: 'json_object' }
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('No se recibió respuesta de Groq Vision');

  return extractAndParseJson(content, NutritionAnalysisSchema);
}

/**
 * Detecta ingredientes y genera recetas desde una foto con Groq Vision
 */
export async function generateRecipesFromImageWithGroqVision(
  imageBase64: string,
  extraIngredients?: string
): Promise<RecipesResponse> {
  const client = getGroqClient();
  const imageUrl = cleanBase64Url(imageBase64);
  const extra = extraIngredients ? `Ingredientes adicionales: "${extraIngredients}".` : '';

  const completion = await client.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Actúa como Chef experto. Mira los ingredientes en la foto. ${extra}
Genera 2 o 3 recetas fáciles y deliciosas usando esos ingredientes.
Responde estrictamente en JSON:
{
  "recipes": [
    {
      "name": "Nombre",
      "prepTime": "25 min",
      "ingredients": ["ingrediente 1"],
      "instructions": ["paso 1"],
      "missingIngredients": []
    }
  ]
}`
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl }
          }
        ]
      }
    ],
    model: 'llama-3.2-11b-vision-preview',
    temperature: 0.7,
    max_tokens: 2500,
    response_format: { type: 'json_object' }
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('No se recibió respuesta de Groq Vision');

  return extractAndParseJson(content, RecipesResponseSchema);
}

/**
 * Genera el plan semanal completo de 7 días y la lista de compras
 */
export async function generateMealPlanWithGroq(
  preferences?: string,
  dietaryRestrictions?: string
): Promise<MealPlan> {
  const client = getGroqClient();
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
IMPORTANTE: Incluye los 7 días completos (Lunes a Domingo), calcula calorías realistas y lista de compras por categorías.`;

  const completion = await client.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'Eres un nutricionista experto. Responde en JSON estricto.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 4500,
    response_format: { type: 'json_object' }
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('No se recibió respuesta para el plan semanal');

  return extractAndParseJson(content, MealPlanSchema);
}
