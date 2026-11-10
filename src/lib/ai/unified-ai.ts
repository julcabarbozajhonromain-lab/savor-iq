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
import {
  generateSmartPeruvianRecipes,
  generateSmartPeruvianPlateAnalysis,
  generateSmartPeruvianWeeklyPlan
} from '$lib/data/peruvian-cuisine-catalog';
import type { NutritionAnalysis, RecipesResponse, MealPlan } from '$lib/types/ai-schemas';

/**
 * Analiza un plato con el mejor proveedor disponible:
 * 1. Google Gemini Flash (Multimodal nativo con contexto peruano)
 * 2. Groq LLaMA 3.2 Vision
 * 3. LogMeal API
 * 4. Motor Nutricional Peruano Autónomo (garantiza 0 caídas)
 */
export async function analyzeNutritionPlate(imageBase64: string): Promise<NutritionAnalysis> {
  // 1. Intentar con Gemini si está configurado
  if (isGeminiConfigured()) {
    try {
      console.log('🤖 Analizando plato con Google Gemini Flash...');
      return await analyzePlateWithGemini(imageBase64);
    } catch (geminiError) {
      console.warn('⚠️ Gemini Flash no disponible para visión:', geminiError);
    }
  }

  // 2. Intentar con Groq Vision si Groq está disponible
  if (isGroqConfigured()) {
    try {
      console.log('🤖 Intentando con Groq Vision (LLaMA 3.2)...');
      return await analyzePlateWithGroqVision(imageBase64);
    } catch (groqError) {
      console.warn('⚠️ Falló Groq Vision:', groqError);
    }
  }

  // 3. Fallback a LogMeal API
  try {
    console.log('🤖 Analizando plato con LogMeal API...');
    const logmealData = await analyzeFoodImageWithLogMeal(imageBase64);
    return transformLogMealResponse(logmealData);
  } catch (logmealErr) {
    console.warn('⚠️ Fallback al Motor Nutricional Peruano Autónomo:', logmealErr);
    return generateSmartPeruvianPlateAnalysis();
  }
}

/**
 * Genera recetas a partir de texto o imagen con failover inteligente
 * y respaldo garantizado del Motor Gastronómico Peruano Autónomo.
 */
export async function generateRecipesUnified(params: {
  ingredients?: string;
  image?: string;
}): Promise<RecipesResponse> {
  const { ingredients, image } = params;

  // Si hay imagen
  if (image) {
    // 1. Gemini Flash (una sola llamada visión + cocina)
    if (isGeminiConfigured()) {
      try {
        console.log('🤖 Generando recetas desde foto con Google Gemini Flash...');
        return await generateRecipesFromImageWithGemini(image, ingredients);
      } catch (err) {
        console.warn('⚠️ Gemini no disponible para foto de recetas:', err);
      }
    }

    // 2. Groq Vision
    if (isGroqConfigured()) {
      try {
        console.log('🤖 Intentando recetas desde foto con Groq Vision...');
        return await generateRecipesFromImageWithGroqVision(image, ingredients);
      } catch (err) {
        console.warn('⚠️ Falló Groq Vision:', err);
      }
    }

    // 3. Fallback: LogMeal para detectar + Motor Gastronómico
    try {
      console.log('🤖 Detectando ingredientes con LogMeal...');
      const logmealData = await analyzeFoodImageWithLogMeal(image);
      const detectedFoods = (logmealData.detected_foods || [])
        .map((f: any) => f.name || f.dish_name || '')
        .filter(Boolean);

      const merged = [ingredients, detectedFoods.join(', ')].filter(Boolean).join(', ');
      if (merged.trim().length > 0) {
        return generateSmartPeruvianRecipes(merged);
      }
    } catch {
      // Continuar al motor autónomo
    }

    return generateSmartPeruvianRecipes(ingredients || 'pollo, arroz, tomate, cebolla, culantro');
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
      console.warn('⚠️ Gemini no disponible temporalmente, usando respaldo:', err);
    }
  }

  // 2. Groq como fallback secundario
  if (isGroqConfigured()) {
    try {
      console.log('🤖 Intentando recetas con Groq...');
      return await generateRecipesWithGroqText(ingredients);
    } catch (groqErr) {
      console.warn('⚠️ Groq no disponible:', groqErr);
    }
  }

  // 3. Motor Gastronómico Peruano Autónomo (100% disponibilidad garantizada)
  console.log('🇵🇪 Generando recetas con el Motor Gastronómico Peruano Autónomo...');
  return generateSmartPeruvianRecipes(ingredients);
}

/**
 * Genera el plan semanal y lista de compras con respaldo del Motor Peruano Autónomo
 */
export async function generateWeeklyPlanUnified(
  preferences?: string,
  dietaryRestrictions?: string
): Promise<MealPlan> {
  // 1. Intentar con Gemini Flash
  if (isGeminiConfigured()) {
    try {
      console.log('🤖 Generando plan semanal con Google Gemini Flash...');
      return await generateMealPlanWithGemini(preferences, dietaryRestrictions);
    } catch (err) {
      console.warn('⚠️ Gemini no disponible para plan semanal:', err);
    }
  }

  // 2. Intentar con Groq
  if (isGroqConfigured()) {
    try {
      return await generateMealPlanWithGroq(preferences, dietaryRestrictions);
    } catch (groqErr) {
      console.warn('⚠️ Groq no disponible para plan semanal:', groqErr);
    }
  }

  // 3. Motor Nutricional Peruano Autónomo
  console.log('🇵🇪 Generando plan semanal con el Motor Gastronómico Peruano Autónomo...');
  return generateSmartPeruvianWeeklyPlan(preferences, dietaryRestrictions);
}

/**
 * Adaptador de respuesta de LogMeal al esquema unificado
 */
function transformLogMealResponse(data: any): NutritionAnalysis {
  const detectedFoods = data.detected_foods || [];
  const firstFood = detectedFoods[0] || {};
  const nutrition = firstFood.nutritional_info || {};

  const calories = Math.round(nutrition.ENERC_KCAL?.quantity || 450);
  const protein = Math.round(nutrition.PROCNT?.quantity || 26);
  const carbs = Math.round(nutrition.CHOCDF?.quantity || 48);
  const fat = Math.round(nutrition.FAT?.quantity || 14);
  const fiber = Math.round(nutrition.FIBTG?.quantity || 5);

  let score = 7;
  if (protein > 20) score += 1;
  if (fiber > 4) score += 1;
  if (fat > 30) score -= 1;
  const healthScore = Math.max(1, Math.min(10, score));

  return {
    dishName: firstFood.name || firstFood.dish_name || 'Plato Peruano Analizado',
    estimatedCalories: calories,
    macronutrients: { protein, carbs, fat, fiber },
    healthScore,
    verdict:
      calories > 700
        ? 'Plato sustancioso con alto aporte calórico. Procura equilibrarlo con zarza criolla o ensalada fresca.'
        : 'Plato balanceado y adecuado para una comida principal.',
    suggestions: [
      fiber < 5
        ? 'Aumenta el consumo de fibra agregando zarza criolla, verduras al vapor o menestras.'
        : 'Buen aporte de fibra.',
      protein < 20
        ? 'Considera sumar más proteína magra (pechuga de pollo, pescado o huevo) para mayor saciedad.'
        : 'Excelente porción de proteína.'
    ],
    ingredients:
      detectedFoods.map((f: any) => f.name || f.dish_name || '').filter(Boolean).length > 0
        ? detectedFoods.map((f: any) => f.name || f.dish_name || '').filter(Boolean)
        : ['Proteína principal', 'Guarnición peruana', 'Vegetales frescos']
  };
}
