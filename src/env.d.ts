/// <reference types="@sveltejs/kit" />

declare namespace App {
  // interface Error {}
  // interface Locals {}
  // interface PageData {}
  // interface PageState {}
  // interface Platform {}
}

declare module '$env/static/private' {
  export const DEEPSEEK_API_KEY: string;
}

declare module '$env/static/public' {
  // export const PUBLIC_API_URL: string;
}