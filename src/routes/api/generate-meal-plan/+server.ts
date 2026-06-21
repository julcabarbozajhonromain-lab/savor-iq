import { json } from '@sveltejs/kit';
import { groq } from '$lib/ai/groq';

export async function POST({ request }: { request: Request }) {
  try {
    const { preferences, dietaryRestrictions } = await request.json();
    
    const prompt = `Eres un nutricionista experto. Genera un plan de comidas semanal completo.

Preferencias del usuario: ${preferences || 'Sin preferencias específicas'}
Restricciones dietéticas: ${dietaryRestrictions || 'Ninguna'}

Responde SOLO con este formato JSON (sin markdown, sin texto adicional):
{
  "weeklyPlan": [
    {
      "day": "Lunes",
      "meals": {
        "breakfast": {
          "name": "Nombre del desayuno",
          "calories": 350,
          "ingredients": ["ingrediente1", "ingrediente2"],
          "instructions": "Breve descripción de preparación"
        },
        "lunch": {
          "name": "Nombre del almuerzo",
          "calories": 550,
          "ingredients": ["ingrediente1", "ingrediente2"],
          "instructions": "Breve descripción de preparación"
        },
        "dinner": {
          "name": "Nombre de la cena",
          "calories": 400,
          "ingredients": ["ingrediente1", "ingrediente2"],
          "instructions": "Breve descripción de preparación"
        }
      },
      "totalCalories": 1300
    }
  ],
  "shoppingList": {
    "proteins": ["pollo 1kg", "huevos 12 unidades"],
    "vegetables": ["tomates 6 unidades", "cebollas 3 unidades"],
    "grains": ["arroz 1kg", "pan integral 1 paquete"],
    "dairy": ["leche 1L", "queso 500g"],
    "fruits": ["manzanas 6 unidades", "plátanos 6 unidades"],
    "other": ["aceite de oliva", "sal", "pimienta"]
  },
  "weeklyNutrition": {
    "totalCalories": 9100,
    "averageDailyCalories": 1300,
    "proteinPercentage": 25,
    "carbsPercentage": 50,
    "fatPercentage": 25
  }
}

IMPORTANTE:
- Genera 7 días completos (Lunes a Domingo)
- Cada día debe tener desayuno, almuerzo y cena
- Varía las comidas para no repetir
- Incluye ingredientes específicos con cantidades
- Calcula calorías realistas
- Genera lista de compras organizada por categorías
- Calcula nutrición semanal total`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Eres un nutricionista experto. Responde SOLO con JSON válido, sin markdown ni texto adicional.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4000,
    });

    let content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No se recibió respuesta');
    }

    // Limpiar markdown
    content = content.trim();
    if (content.startsWith('```json')) content = content.slice(7);
    if (content.startsWith('```')) content = content.slice(3);
    if (content.endsWith('```')) content = content.slice(0, -3);
    content = content.trim();

    const mealPlan = JSON.parse(content);
    return json(mealPlan);
    
  } catch (error) {
    console.error('Error:', error);
    return json(
      { error: 'Error al generar plan de comidas' }, 
      { status: 500 }
    );
  }
}