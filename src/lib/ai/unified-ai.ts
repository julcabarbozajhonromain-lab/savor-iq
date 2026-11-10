import {
  isGeminiConfigured,
  analyzePlateWithGemini,
  generateRecipesFromImageWithGemini,
  generateRecipesWithGeminiText,
  generateMealPlanWithGemini
} from './gemini';
import {
  isGroqConfigured,
  generateRecipesWithGroqText,
  analyzePlateWithGroqVision,
  generateRecipesFromImageWithGroqVision,
  generateMealPlanWithGroq
} from './groq';
import { analyzeFoodImageWithLogMeal } from './logmeal';
import type { NutritionAnalysis, RecipesResponse, MealPlan } from '$lib/types/ai-schemas';

/**
 * Analiza un plato con el mejor proveedor disponible:
 * 1. Google Gemini 1.5/2.0 Flash (Gratis y multimodal nativo)
 * 2. Groq LLaMA 3.2 Vision (Gratis)
 * 3. LogMeal API (Fallback)
 */
export async function analyzeNutritionPlate(imageBase64: string): Promise<NutritionAnalysis> {
  let primaryError: unknown = null;

  // 1. Intentar con Gemini si está configurado
  if (isGeminiConfigured()) {
    try {
      console.log('🤖 Analizando plato con Google Gemini Flash...');
      return await analyzePlateWithGemini(imageBase64);
    } catch (geminiError) {
      console.error('❌ Error de Google Gemini Flash:', geminiError);
      primaryError = geminiError;
    }
  }

  // 2. Intentar con Groq Vision si Groq está disponible
  if (isGroqConfigured()) {
    try {
      console.log('🤖 Intentando con Groq Vision (LLaMA 3.2)...');
      return await analyzePlateWithGroqVision(imageBase64);
    } catch (groqError) {
      console.warn('⚠️ Falló Groq Vision:', groqError);
      if (!primaryError) primaryError = groqError;
    }
  }

  // 3. Fallback a LogMeal API
  try {
    console.log('🤖 Analizando plato con LogMeal API...');
    const logmealData = await analyzeFoodImageWithLogMeal(imageBase64);
    return transformLogMealResponse(logmealData);
  } catch (logmealErr) {
    console.error('❌ Error LogMeal:', logmealErr);
    throw primaryError || logmealErr;
  }
}

/**
 * Genera recetas a partir de texto o imagen con failover inteligente
 */
export async function generateRecipesUnified(params: {
  ingredients?: string;
  image?: string;
}): Promise<RecipesResponse> {
  const { ingredients, image } = params;
  let primaryError: unknown = null;

  // Si hay imagen
  if (image) {
    // 1. Gemini Flash (una sola llamada visión + cocina)
    if (isGeminiConfigured()) {
      try {
        console.log('🤖 Generando recetas desde foto con Google Gemini Flash...');
        return await generateRecipesFromImageWithGemini(image, ingredients);
      } catch (err) {
        console.error('❌ Falló Gemini para foto de recetas:', err);
        primaryError = err;
      }
    }

    // 2. Groq Vision
    if (isGroqConfigured()) {
      try {
        console.log('🤖 Intentando recetas desde foto con Groq Vision...');
        return await generateRecipesFromImageWithGroqVision(image, ingredients);
      } catch (err) {
        console.warn('⚠️ Falló Groq Vision:', err);
        if (!primaryError) primaryError = err;
      }
    }

    // 3. Fallback: LogMeal para detectar + Groq para cocinar
    try {
      console.log('🤖 Detectando ingredientes con LogMeal...');
      const logmealData = await analyzeFoodImageWithLogMeal(image);
      const detectedFoods = (logmealData.detected_foods || []).map(
        (f: any) => f.name || f.dish_name || ''
      ).filter(Boolean);

      const merged = [ingredients, detectedFoods.join(', ')].filter(Boolean).join(', ');
      if (merged.trim().length === 0) {
        throw new Error('No se detectaron ingredientes claros en la imagen. Intenta escribirlos.');
      }

      if (isGeminiConfigured()) {
        return await generateRecipesWithGeminiText(merged);
      }
      if (isGroqConfigured()) {
        return await generateRecipesWithGroqText(merged);
      }
      throw new Error('No hay proveedores configurados para generar recetas.');
    } catch (fallbackErr) {
      throw primaryError || fallbackErr;
    }
  }

  // Si solo hay texto
  if (!ingredients || ingredients.trim().length === 0) {
    throw new Error('Por favor proporciona ingredientes.');
  }

  // 1. Gemini Flash si está disponible
  if (isGeminiConfigured()) {
    try {
      console.log('🤖 Generando recetas con Google Gemini Flash...');
      return await generateRecipesWithGeminiText(ingredients);
    } catch (err) {
      console.error('❌ Falló Gemini para texto:', err);
      primaryError = err;
    }
  }

  // 2. Groq como fallback secundario
  if (isGroqConfigured()) {
    try {
      console.log('🤖 Intentando recetas con Groq...');
      return await generateRecipesWithGroqText(ingredients);
    } catch (groqErr) {
      console.warn('⚠️ Falló Groq:', groqErr);
      throw primaryError || groqErr;
    }
  }

  if (primaryError) throw primaryError;
  throw new Error('No hay proveedores de IA configurados o válidos.');
}

/**
 * Genera el plan semanal y lista de compras
 */
export async function generateWeeklyPlanUnified(
  preferences?: string,
  dietaryRestrictions?: string
): Promise<MealPlan> {
  let primaryError: unknown = null;

  // 1. Intentar con Gemini Flash
  if (isGeminiConfigured()) {
    try {
      console.log('🤖 Generando plan semanal con Google Gemini Flash...');
      return await generateMealPlanWithGemini(preferences, dietaryRestrictions);
    } catch (err) {
      console.error('❌ Falló Gemini para plan semanal:', err);
      primaryError = err;
    }
  }

  // 2. Intentar con Groq
  if (isGroqConfigured()) {
    try {
      return await generateMealPlanWithGroq(preferences, dietaryRestrictions);
    } catch (groqErr) {
      throw primaryError || groqErr;
    }
  }

  if (primaryError) throw primaryError;
  throw new Error('No hay proveedores de IA configurados para generar el plan semanal.');
}

/**
 * Adaptador de respuesta de LogMeal al esquema unificado
 */
function transformLogMealResponse(data: any): NutritionAnalysis {
  const detectedFoods = data.detected_foods || [];
  const firstFood = detectedFoods[0] || {};
  const nutrition = firstFood.nutritional_info || {};

  const calories = Math.round(nutrition.ENERC_KCAL?.quantity || 400);
  const protein = Math.round(nutrition.PROCNT?.quantity || 22);
  const carbs = Math.round(nutrition.CHOCDF?.quantity || 45);
  const fat = Math.round(nutrition.FAT?.quantity || 14);
  const fiber = Math.round(nutrition.FIBTG?.quantity || 5);

  let score = 6;
  if (protein > 20) score += 2;
  if (fiber > 4) score += 1;
  if (fat > 30) score -= 1;
  const healthScore = Math.max(1, Math.min(10, score));

  return {
    dishName: firstFood.name || firstFood.dish_name || 'Plato detectado',
    estimatedCalories: calories,
    macronutrients: { protein, carbs, fat, fiber },
    healthScore,
    verdict: calories > 700 
      ? 'Plato sustancioso con alto aporte calórico. Procura equilibrarlo con vegetales.'
      : 'Plato balanceado y adecuado para una comida principal.',
    suggestions: [
      fiber < 5 ? 'Aumenta el consumo de fibra agregando verduras crudas o legumbres.' : 'Buen aporte de fibra.',
      protein < 20 ? 'Considera sumar más proteína magra para mayor saciedad.' : 'Excelente porción de proteína.'
    ],
    ingredients: detectedFoods.map((f: any) => f.name || f.dish_name || '').filter(Boolean)
  };
}
