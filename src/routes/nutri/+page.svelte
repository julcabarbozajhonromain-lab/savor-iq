<script lang="ts">
  import { Camera, Loader2, AlertCircle, CheckCircle } from 'lucide-svelte';
  
  let imagePreview: string | null = $state(null);
  let isLoading = $state(false);
  let analysis: any = $state(null);  // ✅ Agregado $state()
  let error: string | null = $state(null);
  
  function handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      imagePreview = URL.createObjectURL(file);
      error = null;
      analysis = null;
      analyzeImage(file);
    }
  }
  
  async function analyzeImage(file: File) {
    isLoading = true;
    
    try {
      const base64 = await fileToBase64(file);
      
      const response = await fetch('/api/analyze-nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al analizar');
      }
      
      analysis = data;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error desconocido';
    } finally {
      isLoading = false;
    }
  }
  
  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  
  function resetAnalysis() {
    imagePreview = null;
    analysis = null;
    error = null;
    isLoading = false;
  }
  
  function getHealthColor(score: number): string {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  }
</script>

<div class="space-y-6">
  <div class="text-center">
    <h2 class="text-2xl font-bold text-gray-800">Módulo Nutri</h2>
    <p class="text-gray-500 mt-1">Analiza tu plato con IA</p>
  </div>

  {#if !imagePreview}
    <div class="bg-white rounded-2xl shadow-md p-8 text-center border-2 border-dashed border-teal-200">
      <Camera class="w-16 h-16 text-teal-400 mx-auto mb-4" />
      <h3 class="font-semibold text-gray-700 mb-2">Fotografía tu plato</h3>
      <p class="text-sm text-gray-500 mb-6">
        Analizaremos los macronutrientes y te daremos un veredicto nutricional
      </p>
      
      <label class="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition shadow-md cursor-pointer">
        <Camera class="w-5 h-5" />
        <span>Analizar plato</span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          class="hidden"
          onchange={handleFileInput}
        />
      </label>
    </div>
  {:else}
    <div class="bg-white rounded-2xl shadow-md overflow-hidden">
      <div class="relative">
        <img src={imagePreview} alt="Plato" class="w-full h-64 object-cover" />
        <button onclick={resetAnalysis} class="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition">✕</button>
      </div>
      
      {#if isLoading}
        <div class="p-8 text-center">
          <Loader2 class="w-12 h-12 text-teal-500 mx-auto mb-4 animate-spin" />
          <p class="text-gray-600">Analizando plato...</p>
        </div>
      {:else if error}
        <div class="p-8 text-center">
          <AlertCircle class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p class="text-red-600 font-semibold">{error}</p>
          <button onclick={resetAnalysis} class="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition">Reintentar</button>
        </div>
      {:else if analysis}
        <div class="p-6 space-y-6">
          <div class="text-center">
            <h3 class="text-xl font-bold text-gray-800">{analysis.dishName}</h3>
            <p class="text-3xl font-bold text-teal-600 mt-2">{analysis.estimatedCalories} kcal</p>
          </div>
          
          <div class="bg-gray-50 rounded-xl p-4 text-center">
            <p class="text-sm text-gray-600 mb-1">Puntuación de salud</p>
            <p class="text-4xl font-bold {getHealthColor(analysis.healthScore)}">{analysis.healthScore}/10</p>
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-blue-50 rounded-xl p-3 text-center">
              <p class="text-xs text-gray-600">Proteínas</p>
              <p class="text-xl font-bold text-blue-600">{analysis.macronutrients.protein}g</p>
            </div>
            <div class="bg-orange-50 rounded-xl p-3 text-center">
              <p class="text-xs text-gray-600">Carbohidratos</p>
              <p class="text-xl font-bold text-orange-600">{analysis.macronutrients.carbs}g</p>
            </div>
            <div class="bg-yellow-50 rounded-xl p-3 text-center">
              <p class="text-xs text-gray-600">Grasas</p>
              <p class="text-xl font-bold text-yellow-600">{analysis.macronutrients.fat}g</p>
            </div>
            <div class="bg-green-50 rounded-xl p-3 text-center">
              <p class="text-xs text-gray-600">Fibra</p>
              <p class="text-xl font-bold text-green-600">{analysis.macronutrients.fiber}g</p>
            </div>
          </div>
          
          <div class="bg-teal-50 rounded-xl p-4">
            <h4 class="font-semibold text-teal-800 mb-2">Veredicto</h4>
            <p class="text-sm text-teal-700">{analysis.verdict}</p>
          </div>
          
          {#if analysis.suggestions}
            <div class="bg-yellow-50 rounded-xl p-4">
              <h4 class="font-semibold text-yellow-800 mb-2">💡 Mejoras</h4>
              <ul class="text-sm text-yellow-700 list-disc list-inside space-y-1">
                {#each analysis.suggestions as suggestion}<li>{suggestion}</li>{/each}
              </ul>
            </div>
          {/if}
          
          <button onclick={resetAnalysis} class="w-full px-6 py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition">📷 Analizar otro plato</button>
        </div>
      {/if}
    </div>
  {/if}
</div>