import fs from 'node:fs';
import path from 'node:path';
import { env } from '$env/dynamic/private';

/**
 * Lee directamente el archivo .env del disco para evitar que variables de entorno
 * antiguas o caducadas de Windows (process.env) sobrescriban los valores reales del proyecto.
 */
export function parseDotEnv(): Record<string, string> {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
      return {};
    }
    const content = fs.readFileSync(envPath, 'utf-8');
    const result: Record<string, string> = {};

    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eqIndex = line.indexOf('=');
      if (eqIndex === -1) continue;
      const key = line.slice(0, eqIndex).trim();
      let value = line.slice(eqIndex + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1).trim();
      }
      result[key] = value;
    }

    return result;
  } catch (err) {
    console.warn('⚠️ No se pudo leer .env directamente:', err);
    return {};
  }
}

/**
 * Obtiene una variable priorizando siempre el archivo .env del proyecto sobre process.env
 */
export function getProjectEnv(key: string): string {
  const dotEnv = parseDotEnv();
  if (key in dotEnv) {
    return dotEnv[key];
  }
  return (env[key] || '').trim();
}
