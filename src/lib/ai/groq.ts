import Groq from 'groq-sdk';
import { GROQ_API_KEY } from '$env/static/private';

export const groq = new Groq({
  apiKey: GROQ_API_KEY,
});

console.log('✅ Groq cliente inicializado correctamente');