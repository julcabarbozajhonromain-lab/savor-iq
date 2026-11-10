import { json } from '@sveltejs/kit';
import { analyzeNutritionPlate } from '$lib/ai/unified-ai';
import { formatAIError } from '$lib/ai/error-handler';

export async function POST({ request }: { request: Request }) {
  try {
    const { image } = await request.json();
    
    if (!image) {
      return json({ error: 'No se proporcionó ninguna imagen para analizar.' }, { status: 400 });
    }
    
    const analysis = await analyzeNutritionPlate(image);
    return json(analysis);
    
  } catch (error) {
    console.error('❌ Error en analyze-nutrition:', error);
    return json(
      { error: formatAIError(error, 'Error al analizar nutrición del plato.') }, 
      { status: 500 }
    );
  }
}
