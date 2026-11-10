/// <reference types="@sveltejs/kit" />

declare namespace App {
  // interface Error {}
  // interface Locals {}
  // interface PageData {}
  // interface PageState {}
  // interface Platform {}
}

declare module '$env/static/private' {
  export const GROQ_API_KEY: string;
  export const GEMINI_API_KEY: string;
  export const GEMINI_API_KEY_FALLBACK: string;
  export const LOGMEAL_API_KEY: string;
  export const OPENAI_API_KEY: string;
}

declare module 'node:fs' {
  export function existsSync(path: string): boolean;
  export function readFileSync(path: string, encoding: 'utf-8'): string;
  const fs: {
    existsSync: typeof existsSync;
    readFileSync: typeof readFileSync;
  };
  export default fs;
}

declare module 'node:path' {
  export function resolve(...paths: string[]): string;
  const path: {
    resolve: typeof resolve;
  };
  export default path;
}

declare const process: {
  cwd(): string;
  env: Record<string, string | undefined>;
};

declare module '$env/static/public' {
  // export const PUBLIC_API_URL: string;
}
