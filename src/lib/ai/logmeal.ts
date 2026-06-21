export const LOGMEAL_API_URL = 'https://api.logmeal.com/v2';
export const LOGMEAL_API_KEY = '4f0fd474e3290f50102b27faa14f60eede812e19';

export async function analyzeFoodImage(imageBase64: string) {
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
      'Authorization': `Bearer ${LOGMEAL_API_KEY}`,
      'accept': 'application/json'
    },
    body: formData
  });
  
  if (!apiResponse.ok) {
    throw new Error(`LogMeal API error: ${apiResponse.statusText}`);
  }
  
  return await apiResponse.json();
}

console.log('✅ LogMeal cliente inicializado correctamente');