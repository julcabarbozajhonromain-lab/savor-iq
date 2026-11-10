import { getProjectEnv } from './env-reader';

export const LOGMEAL_API_URL = 'https://api.logmeal.com/v2';

export async function analyzeFoodImageWithLogMeal(imageBase64: string) {
  const apiKey = getProjectEnv('LOGMEAL_API_KEY');
  if (!apiKey) {
    throw new Error('LOGMEAL_API_KEY no está configurada en las variables de entorno.');
  }

  // Convertir base64 a blob
  const response = await fetch(`data:image/jpeg;base64,${imageBase64}`);
  const blob = await response.blob();
  
  // Crear FormData
  const formData = new FormData();
  formData.append('image', blob, 'image.jpg');
  
  // Llamar a LogMeal API
  const apiResponse = await fetch(`${LOGMEAL_API_URL}/image/segmentation/complete`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'accept': 'application/json'
    },
    body: formData
  });
  
  if (!apiResponse.ok) {
    const errorText = await apiResponse.text().catch(() => '');
    throw new Error(`LogMeal API error (${apiResponse.status}): ${errorText || apiResponse.statusText}`);
  }
  
  return await apiResponse.json();
}
