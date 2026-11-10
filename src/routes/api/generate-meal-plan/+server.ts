import { json } from '@sveltejs/kit';
import { generateWeeklyPlanUnified } from '$lib/ai/unified-ai';
import { formatAIError } from '$lib/ai/error-handler';

export async function POST({ request }: { request: Request }) {
  try {
    const { preferences, dietaryRestrictions } = await request.json();
    
    const mealPlan = await generateWeeklyPlanUnified(preferences, dietaryRestrictions);
    return json(mealPlan);
    
  } catch (error) {
    console.error('❌ Error en generate-meal-plan:', error);
    return json(
      { error: formatAIError(error, 'Error al generar el plan de comidas semanal.') }, 
      { status: 500 }
    );
  }
}
