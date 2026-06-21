<script lang="ts">
  import BottomNav from '$lib/components/layout/BottomNav.svelte';
  import '../app.css'; // ← AGREGA ESTA LÍNEA
  
  interface Props {
    children: () => any;
  }
  
  let { children }: Props = $props();
</script>

<div class="min-h-screen bg-gray-50 pb-20">
  <!-- Header -->
  <header class="sticky top-0 z-40 bg-white shadow-sm">
    <div class="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
      <h1 class="text-xl font-bold text-orange-600">Savor IQ</h1>
      <span class="text-xs text-gray-500">Cocina inteligente</span>
    </div>
  </header>

  <!-- Contenido principal -->
  <main class="max-w-lg mx-auto px-4 py-6">
    {@render children()}
  </main>

  <!-- Navegación inferior -->
  <BottomNav />
</div>