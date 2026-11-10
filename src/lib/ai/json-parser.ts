import type { z, ZodType } from 'zod';

export function extractAndParseJson<T>(rawText: string, schema: ZodType<T>): T {
  let cleaned = rawText.trim();

  // Eliminar markdown code blocks ```json ... ``` o ``` ... ```
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }

  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  // Si aún hay texto antes del primer '{' o '['
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    const parsed = JSON.parse(cleaned);
    return schema.parse(parsed);
  } catch (error) {
    console.error('Error parseando o validando JSON de IA:', error, '\nTexto original recibido:', rawText);
    throw new Error(
      error instanceof Error 
        ? `Respuesta inválida del modelo: ${error.message}` 
        : 'La IA no devolvió un JSON con la estructura esperada.'
    );
  }
}
