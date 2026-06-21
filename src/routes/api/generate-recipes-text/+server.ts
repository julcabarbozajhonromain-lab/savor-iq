import { json } from '@sveltejs/kit';
import { groq } from '$lib/ai/groq';

const LOGMEAL_API_URL = 'https://api.logmeal.com/v2';
const LOGMEAL_API_TOKEN = 'b32399902ba1393ea1c0fbb558da28191d53e7bc';

export async function POST({ request }: { request: Request }) {
  try {
    const { ingredients, image } = await request.json();
    
    let ingredientsText = ingredients;
    
    // Si viene imagen, usar LogMeal para detectar ingredientes
    if (image && !ingredientsText) {
      const detectedIngredients = await detectIngredientsFromImage(image);
      ingredientsText = detectedIngredients.join(', ');
    }
    
    if (!ingredientsText || ingredientsText.trim().length === 0) {
      return json({ error: 'No se proporcionaron ingredientes' }, { status: 400 });
    }
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Eres un chef experto. Responde SOLO con JSON válido, sin markdown ni texto adicional.'
        },
        {
          role: 'user',
          content: `Con estos ingredientes: "${ingredientsText}", genera 2-3 recetas creativas.

Responde SOLO con este JSON (sin markdown, sin texto adicional):
{
  "recipes": [
    {
      "name": "Nombre de la receta",
      "ingredients": ["ingrediente1", "ingrediente2"],
      "instructions": ["paso 1", "paso 2", "paso 3"],
      "missingIngredients": []
    }
  ]
}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2000,
    });

    let content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No se recibió respuesta');
    }

    // Limpiar markdown code blocks si existen
    content = content.trim();
    if (content.startsWith('```json')) {
      content = content.slice(7);
    }
    if (content.startsWith('```')) {
      content = content.slice(3);
    }
    if (content.endsWith('```')) {
      content = content.slice(0, -3);
    }
    content = content.trim();

    const recipes = JSON.parse(content);
    return json(recipes);
    
  } catch (error) {
    console.error('Error:', error);
    return json(
      { error: 'Error al generar recetas', recipes: [] }, 
      { status: 500 }
    );
  }
}

async function detectIngredientsFromImage(imageBase64: string): Promise<string[]> {
  try {
    // Convertir base64 a blob
    const imageResponse = await fetch(`data:image/jpeg;base64,${imageBase64}`);
    const blob = await imageResponse.blob();
    
    // Crear FormData
    const formData = new FormData();
    formData.append('image', blob, 'image.jpg');
    
    // Llamar a LogMeal API
    const apiResponse = await fetch(`${LOGMEAL_API_URL}/image/segmentation/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOGMEAL_API_TOKEN}`,
        'accept': 'application/json'
      },
      body: formData
    });
    
    if (!apiResponse.ok) {
      console.error('LogMeal error:', apiResponse.status);
      return [];
    }
    
    const logmealData = await apiResponse.json();
    
    // Extraer ingredientes detectados
    const detectedFoods = logmealData.detected_foods || [];
    const ingredients = detectedFoods.map((food: any) => food.name || food.dish_name || '').filter(Boolean);
    
    return ingredients;
    
  } catch (error) {
    console.error('Error detectando ingredientes:', error);
    return [];
  }
}