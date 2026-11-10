import { json } from '@sveltejs/kit';
import { generateRecipesUnified } from '$lib/ai/unified-ai';
import { formatAIError } from '$lib/ai/error-handler';

export async function POST({ request }: { request: Request }) {
  try {
    const { ingredients, image } = await request.json();
    
    if ((!ingredients || ingredients.trim().length === 0) && !image) {
      return json({ error: 'Por favor proporciona ingredientes en texto o una imagen.' }, { status: 400 });
    }
    
    const result = await generateRecipesUnified({ ingredients, image });
    return json(result);
    
  } catch (error) {
    console.error('❌ Error en generate-recipes-text:', error);
    return json(
      { error: formatAIError(error, 'Error al generar recetas.') }, 
      { status: 500 }
    );
  }
}
