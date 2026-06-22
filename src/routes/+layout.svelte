<script lang="ts">
  import BottomNav from '$lib/components/layout/BottomNav.svelte';
  import InstallBanner from '$lib/components/InstallBanner.svelte';
  import '../app.css';
  
  interface Props {
    children: () => any;
  }
  
  let { children }: Props = $props();
</script>

<svelte:head>
  <title>Savor IQ - Tu Chef Personal con IA</title>
  <meta name="description" content="Genera recetas personalizadas, analiza nutrición y planifica comidas con inteligencia artificial" />
  <meta name="theme-color" content="#ff530b" />
  <link rel="manifest" href="/site.webmanifest" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 pb-20">
  <!-- Header Mejorado -->
  <header class="sticky top-0 z-40 bg-white shadow-md border-b border-orange-100">
    <div class="max-w-lg mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- Logo -->
          <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <span class="text-xl">🍳</span>
          </div>
          <div>
            <h1 class="text-lg font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              Savor IQ
            </h1>
            <p class="text-xs text-gray-600">Tu chef con IA</p>
          </div>
        </div>
        
        <!-- Badge Online -->
        <div class="flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
          <div class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-xs font-medium text-green-700">Online</span>
        </div>
      </div>
    </div>
  </header>

  <!-- Contenido principal -->
  <main class="max-w-lg mx-auto px-4 py-6">
    {@render children()}
  </main>

  <!-- Navegación inferior -->
  <BottomNav />
  
  <!-- Banner de Instalación PWA -->
  <InstallBanner />
</div>

<style>
  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
</style>