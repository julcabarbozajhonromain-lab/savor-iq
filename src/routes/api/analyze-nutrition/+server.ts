import { json } from '@sveltejs/kit';

const LOGMEAL_API_URL = 'https://api.logmeal.com/v2';
// ✅ Token CORRECTO del APIUser (no el APIUserManager)
const LOGMEAL_API_TOKEN = 'b32399902ba1393ea1c0fbb558da28191d53e7bc';

export async function POST({ request }: { request: Request }) {
  try {
    const { image } = await request.json();
    
    if (!image) {
      return json({ error: 'No se proporcionó imagen' }, { status: 400 });
    }
    
    // Convertir base64 a blob
    const imageResponse = await fetch(`data:image/jpeg;base64,${image}`);
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
      const errorText = await apiResponse.text();
      console.error('LogMeal API error:', apiResponse.status, errorText);
      throw new Error(`Error ${apiResponse.status}: ${apiResponse.statusText}`);
    }
    
    const logmealData = await apiResponse.json();
    console.log('✅ LogMeal response:', logmealData);
    
    // Transformar respuesta
    const analysis = transformLogMealResponse(logmealData);
    
    return json(analysis);
    
  } catch (error) {
    console.error('❌ Error:', error);
    return json(
      { error: error instanceof Error ? error.message : 'Error al analizar nutrición' }, 
      { status: 500 }
    );
  }
}

function transformLogMealResponse(data: any) {
  const detectedFoods = data.detected_foods || [];
  const firstFood = detectedFoods[0] || {};
  const nutrition = firstFood.nutritional_info || {};
  
  const healthScore = calculateHealthScore(nutrition);
  
  return {
    dishName: firstFood.name || firstFood.dish_name || 'Plato detectado',
    estimatedCalories: Math.round(nutrition.ENERC_KCAL?.quantity || 350),
    macronutrients: {
      protein: Math.round(nutrition.PROCNT?.quantity || 20),
      carbs: Math.round(nutrition.CHOCDF?.quantity || 40),
      fat: Math.round(nutrition.FAT?.quantity || 15),
      fiber: Math.round(nutrition.FIBTG?.quantity || 5)
    },
    healthScore: healthScore,
    verdict: generateVerdict(nutrition),
    suggestions: generateSuggestions(nutrition),
    ingredients: detectedFoods.map((f: any) => f.name || f.dish_name || '').filter(Boolean)
  };
}

function calculateHealthScore(nutrition: any): number {
  let score = 5;
  
  const calories = nutrition.ENERC_KCAL?.quantity || 0;
  const protein = nutrition.PROCNT?.quantity || 0;
  const fat = nutrition.FAT?.quantity || 0;
  const fiber = nutrition.FIBTG?.quantity || 0;
  
  if (protein > 20) score += 2;
  else if (protein > 10) score += 1;
  
  if (fat < 20) score += 2;
  else if (fat < 35) score += 1;
  
  if (fiber > 5) score += 1;
  
  return Math.min(score, 10);
}

function generateVerdict(nutrition: any): string {
  const calories = nutrition.ENERC_KCAL?.quantity || 0;
  const protein = nutrition.PROCNT?.quantity || 0;
  
  if (calories < 400 && protein > 20) {
    return 'Plato equilibrado y saludable. Buena fuente de proteínas.';
  } else if (calories > 800) {
    return 'Plato alto en calorías. Considera reducir la porción.';
  } else if (protein < 10) {
    return 'Plato bajo en proteínas. Considera agregar más proteína.';
  }
  
  return 'Plato con contenido nutricional moderado.';
}

function generateSuggestions(nutrition: any): string[] {
  const suggestions: string[] = [];
  
  const protein = nutrition.PROCNT?.quantity || 0;
  const fiber = nutrition.FIBTG?.quantity || 0;
  const fat = nutrition.FAT?.quantity || 0;
  
  if (protein < 15) {
    suggestions.push('Agrega más proteínas: pollo, pescado, huevos o legumbres');
  }
  if (fiber < 5) {
    suggestions.push('Aumenta la fibra con más vegetales o granos integrales');
  }
  if (fat > 30) {
    suggestions.push('Reduce las grasas evitando frituras');
  }
  if (suggestions.length === 0) {
    suggestions.push('¡Excelente equilibrio nutricional!');
  }
  
  return suggestions;
}