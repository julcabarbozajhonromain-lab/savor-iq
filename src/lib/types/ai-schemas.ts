import { z } from 'zod';

export const MacronutrientsSchema = z.object({
  protein: z.number().nonnegative().describe('Gramos de proteína'),
  carbs: z.number().nonnegative().describe('Gramos de carbohidratos'),
  fat: z.number().nonnegative().describe('Gramos de grasa'),
  fiber: z.number().nonnegative().describe('Gramos de fibra'),
});

export const NutritionAnalysisSchema = z.object({
  dishName: z.string().min(1).describe('Nombre del plato o alimentos identificados'),
  estimatedCalories: z.number().nonnegative().describe('Calorías estimadas totales'),
  macronutrients: MacronutrientsSchema,
  healthScore: z.number().min(1).max(10).describe('Puntuación de 1 a 10'),
  verdict: z.string().describe('Veredicto y evaluación nutricional'),
  suggestions: z.array(z.string()).describe('Sugerencias y consejos para mejorar el plato'),
  ingredients: z.array(z.string()).describe('Ingredientes detectados en el plato'),
});

export type NutritionAnalysis = z.infer<typeof NutritionAnalysisSchema>;

export const RecipeSchema = z.object({
  name: z.string().min(1).describe('Nombre de la receta'),
  prepTime: z.string().optional().describe('Tiempo estimado de preparación'),
  ingredients: z.array(z.string()).describe('Lista de ingredientes con cantidades sugeridas'),
  instructions: z.array(z.string()).describe('Pasos detallados de preparación'),
  missingIngredients: z.array(z.string()).optional().default([]).describe('Ingredientes opcionales que mejorarían el plato'),
});

export const RecipesResponseSchema = z.object({
  recipes: z.array(RecipeSchema).min(1),
});

export type Recipe = z.infer<typeof RecipeSchema>;
export type RecipesResponse = z.infer<typeof RecipesResponseSchema>;

export const MealItemSchema = z.object({
  name: z.string(),
  calories: z.number(),
  ingredients: z.array(z.string()).optional(),
  instructions: z.string().optional(),
});

export const DailyPlanSchema = z.object({
  day: z.string(),
  meals: z.object({
    breakfast: MealItemSchema,
    lunch: MealItemSchema,
    dinner: MealItemSchema,
  }),
  totalCalories: z.number(),
});

export const ShoppingListSchema = z.object({
  proteins: z.array(z.string()),
  vegetables: z.array(z.string()),
  grains: z.array(z.string()),
  dairy: z.array(z.string()),
  fruits: z.array(z.string()),
  other: z.array(z.string()),
});

export const WeeklyNutritionSchema = z.object({
  totalCalories: z.number(),
  averageDailyCalories: z.number(),
  proteinPercentage: z.number(),
  carbsPercentage: z.number(),
  fatPercentage: z.number(),
});

export const MealPlanSchema = z.object({
  weeklyPlan: z.array(DailyPlanSchema),
  shoppingList: ShoppingListSchema,
  weeklyNutrition: WeeklyNutritionSchema,
});

export type MealPlan = z.infer<typeof MealPlanSchema>;
