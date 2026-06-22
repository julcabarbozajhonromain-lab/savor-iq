<script lang="ts">
  import { onMount } from 'svelte';
  
  let deferredPrompt: any = null;
  let showBanner: boolean = $state(false);
  let isInstalled: boolean = $state(false);
  
  onMount(() => {
    if (localStorage.getItem('savoriq_installed') === 'true') {
      isInstalled = true;
      return;
    }
    
    const dismissed = localStorage.getItem('savoriq_banner_dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) return;
    }
    
    const visits = parseInt(localStorage.getItem('savoriq_visits') || '0');
    localStorage.setItem('savoriq_visits', (visits + 1).toString());
    
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      
      if (visits >= 1) {
        setTimeout(() => {
          showBanner = true;
        }, 5000);
      }
    });
    
    window.addEventListener('appinstalled', () => {
      showBanner = false;
      isInstalled = true;
      localStorage.setItem('savoriq_installed', 'true');
    });
    
    if (window.matchMedia('(display-mode: standalone)').matches) {
      isInstalled = true;
      localStorage.setItem('savoriq_installed', 'true');
    }
  });
  
  async function handleInstall() {
    if (!deferredPrompt) {
      alert('Para instalar: abre el menú de tu navegador y busca "Instalar aplicación" o "Agregar a pantalla de inicio"');
      return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      showBanner = false;
      localStorage.setItem('savoriq_installed', 'true');
    }
    
    deferredPrompt = null;
  }
  
  function dismiss() {
    showBanner = false;
    localStorage.setItem('savoriq_banner_dismissed', Date.now().toString());
  }
</script>

{#if showBanner && !isInstalled}
  <div class="fixed bottom-20 left-4 right-4 bg-white rounded-2xl shadow-2xl border border-orange-200 overflow-hidden z-50">
    <div class="h-1 bg-linear-to-r from-orange-500 to-orange-600"></div>
    
    <div class="p-4">
      <div class="flex items-start gap-3">
        <div class="shrink-0 w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
          <span class="text-2xl">📲</span>
        </div>
        
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-gray-900 text-sm mb-1">
            Instala Savor IQ
          </h3>
          <p class="text-xs text-gray-600 leading-tight">
            Acceso rápido y uso sin conexión
          </p>
          
          <div class="mt-2 flex flex-wrap gap-1.5">
            <span class="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
              <span>⚡</span> Rápido
            </span>
            <span class="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
              <span>📴</span> Offline
            </span>
          </div>
        </div>
        
        <button 
          onclick={dismiss}
          class="shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>
      
      <div class="mt-3 flex gap-2">
        <button 
          onclick={dismiss}
          class="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Ahora no
        </button>
        <button 
          onclick={handleInstall}
          class="flex-1 px-3 py-2 text-xs font-medium text-white bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg shadow-md transition-all"
        >
          Instalar App
        </button>
      </div>
    </div>
  </div>
{/if}