/**
 * Formatea errores de proveedores de IA para mostrar mensajes claros y transparentes al usuario.
 */
export function formatAIError(error: unknown, defaultMessage = 'Error al procesar con IA'): string {
  const msg = error instanceof Error ? error.message : String(error);

  if (msg.includes('ACCESS_TOKEN_TYPE_UNSUPPORTED') || msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
    return 'Google Gemini rechazó la clave API: La clave no es válida, está deshabilitada o el servicio aún se está activando. Por favor verifica tu clave en aistudio.google.com.';
  }

  if (msg.includes('Invalid API Key') || msg.includes('invalid_api_key')) {
    return 'La clave de API proporcionada no es válida o ha sido revocada por el proveedor. Por favor verifica tu archivo .env.';
  }

  if (msg.includes('rate_limit_exceeded') || msg.includes('429')) {
    return 'Se ha alcanzado temporalmente el límite de solicitudes por minuto. Por favor espera unos segundos y vuelve a intentar.';
  }

  if (msg.includes('quota') || msg.includes('insufficient_quota')) {
    return 'La cuota de la API se ha agotado en tu cuenta.';
  }

  return msg || defaultMessage;
}
