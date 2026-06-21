<script lang="ts">
  import { CalendarCheck } from 'lucide-svelte';
</script>

<div class="space-y-6">
  <div class="text-center">
    <h2 class="text-2xl font-bold text-gray-800">Módulo Plan</h2>
    <p class="text-gray-500 mt-1">Planifica tu semana</p>
  </div>

  <div class="bg-white rounded-2xl shadow-md p-8 text-center border-2 border-dashed border-slate-200">
    <CalendarCheck class="w-16 h-16 text-slate-600 mx-auto mb-4" />
    <h3 class="font-semibold text-gray-700 mb-2">Menú semanal inteligente</h3>
    <p class="text-sm text-gray-500 mb-6">
      Define tus preferencias y generaremos un plan completo con lista de compras
    </p>
    <button class="px-6 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-900 transition shadow-md">
      📅 Crear plan semanal
    </button>
  </div>
</div>