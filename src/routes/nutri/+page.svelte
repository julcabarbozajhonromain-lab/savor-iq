<script lang="ts">
  import {
    Camera,
    Loader2,
    AlertCircle,
    Sparkles,
    Copy,
    Check,
    Apple,
    PlusCircle,
    Calendar,
    Trash2,
    Flame
  } from 'lucide-svelte';
  import { compressAndConvertToBase64 } from '$lib/utils/image-compression';
  import { userData } from '$lib/state/user-storage.svelte';
  import type { NutritionAnalysis } from '$lib/types/ai-schemas';

  let activeTab: 'scanner' | 'diary' = $state('scanner');
  let imagePreview: string | null = $state(null);
  let isLoading = $state(false);
  let statusMessage = $state('');
  let analysis: NutritionAnalysis | null = $state(null);
  let error: string | null = $state(null);
  let copied = $state(false);
  let mealTypeSelect: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack' = $state('Almuerzo');
  let loggedSuccess = $state(false);

  const todaySummary = $derived(userData.getTodayNutritionSummary());
  const todayMeals = $derived(userData.getTodayMeals());
  const caloriePct = $derived(
    Math.min(100, Math.round((todaySummary.calories / (userData.calorieGoal || 2000)) * 100))
  );

  function handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      imagePreview = URL.createObjectURL(file);
      error = null;
      analysis = null;
      loggedSuccess = false;
      analyzeImage(file);
    }
  }

  async function analyzeImage(file: File) {
    isLoading = true;
    error = null;
    statusMessage = 'Optimizando foto...';

    try {
      const base64 = await compressAndConvertToBase64(file);
      statusMessage = 'Calculando nutrientes y veredicto con IA...';

      const response = await fetch('/api/analyze-nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al analizar el plato.');
      }

      analysis = data;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error desconocido al analizar';
    } finally {
      isLoading = false;
      statusMessage = '';
    }
  }

  function logThisMeal() {
    if (!analysis) return;
    userData.logMealFromAnalysis(analysis, mealTypeSelect);
    loggedSuccess = true;
    setTimeout(() => (loggedSuccess = false), 3000);
  }

  async function copyAnalysis() {
    if (!analysis) return;
    const text = `🥗 Análisis Nutricional Savor IQ
🍽️ Plato: ${analysis.dishName}
🔥 Calorías estimadas: ${analysis.estimatedCalories} kcal
⭐ Score de Salud: ${analysis.healthScore}/10

📊 Macronutrientes:
- Proteínas: ${analysis.macronutrients.protein}g
- Carbohidratos: ${analysis.macronutrients.carbs}g
- Grasas: ${analysis.macronutrients.fat}g
- Fibra: ${analysis.macronutrients.fiber}g

📋 Veredicto: ${analysis.verdict}
${analysis.suggestions?.length ? `💡 Consejos:\n${analysis.suggestions.map((s) => `• ${s}`).join('\n')}` : ''}`;

    try {
      await navigator.clipboard.writeText(text);
      copied = true;
      setTimeout(() => (copied = false), 2500);
    } catch {
      alert('No se pudo copiar');
    }
  }

  function resetAnalysis() {
    imagePreview = null;
    analysis = null;
    error = null;
    isLoading = false;
    loggedSuccess = false;
  }

  function getHealthColor(score: number): string {
    if (score >= 8) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 6) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  }
</script>

<div class="space-y-6">
  <div class="text-center">
    <h2 class="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
      <Apple class="w-7 h-7 text-teal-600" />
      Módulo Nutri
    </h2>
    <p class="text-gray-500 text-sm mt-1">Auditoría visual de calorías y macronutrientes</p>
  </div>

  <!-- Pestañas Scanner vs Diario -->
  <div class="flex bg-gray-100 p-1 rounded-xl">
    <button
      onclick={() => (activeTab = 'scanner')}
      class="flex-1 py-2 text-xs font-bold rounded-lg transition-all {
        activeTab === 'scanner'
          ? 'bg-white text-teal-600 shadow-xs'
          : 'text-gray-500 hover:text-gray-700'
      }"
    >
      📷 Escanear Plato
    </button>
    <button
      onclick={() => (activeTab = 'diary')}
      class="flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 {
        activeTab === 'diary'
          ? 'bg-white text-teal-600 shadow-xs'
          : 'text-gray-500 hover:text-gray-700'
      }"
    >
      <Calendar class="w-3.5 h-3.5" />
      <span>Mi Diario de Hoy ({todayMeals.length})</span>
    </button>
  </div>

  {#if activeTab === 'diary'}
    <!-- Vista de Diario Nutricional -->
    <div class="space-y-4">
      <!-- Tarjeta resumen calórico diario -->
      <div class="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-6 text-white shadow-md space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold opacity-90">Consumo de hoy</p>
            <p class="text-3xl font-black">{todaySummary.calories} <span class="text-sm font-normal">/ {userData.calorieGoal} kcal</span></p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
            <Flame class="w-7 h-7 text-amber-300" />
          </div>
        </div>

        <!-- Barra de progreso -->
        <div>
          <div class="w-full bg-black/20 h-2.5 rounded-full overflow-hidden">
            <div class="bg-amber-300 h-full rounded-full transition-all duration-500" style="width: {caloriePct}%"></div>
          </div>
          <div class="flex justify-between text-[11px] opacity-80 mt-1">
            <span>{caloriePct}% de la meta</span>
            <span>Meta: {userData.calorieGoal} kcal</span>
          </div>
        </div>

        <!-- Macronutrientes totales hoy -->
        <div class="grid grid-cols-4 gap-2 pt-2 border-t border-white/10 text-center text-xs">
          <div class="bg-white/10 rounded-lg p-2">
            <p class="opacity-75 text-[10px]">Proteína</p>
            <p class="font-bold text-sm">{todaySummary.protein}g</p>
          </div>
          <div class="bg-white/10 rounded-lg p-2">
            <p class="opacity-75 text-[10px]">Carbos</p>
            <p class="font-bold text-sm">{todaySummary.carbs}g</p>
          </div>
          <div class="bg-white/10 rounded-lg p-2">
            <p class="opacity-75 text-[10px]">Grasas</p>
            <p class="font-bold text-sm">{todaySummary.fat}g</p>
          </div>
          <div class="bg-white/10 rounded-lg p-2">
            <p class="opacity-75 text-[10px]">Fibra</p>
            <p class="font-bold text-sm">{todaySummary.fiber}g</p>
          </div>
        </div>
      </div>

      <!-- Lista de comidas registradas hoy -->
      <div class="space-y-3">
        <h4 class="text-xs font-bold uppercase tracking-wider text-gray-500 px-1">Comidas registradas hoy</h4>
        {#if todayMeals.length === 0}
          <div class="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm space-y-3">
            <Camera class="w-12 h-12 text-gray-300 mx-auto" />
            <h5 class="font-bold text-gray-700 text-sm">No has registrado comidas hoy</h5>
            <p class="text-xs text-gray-400 max-w-xs mx-auto">
              Toma una foto de tu desayuno, almuerzo o cena en la pestaña de escaneo para llevar el control diario.
            </p>
            <button
              onclick={() => (activeTab = 'scanner')}
              class="px-4 py-2 bg-teal-500 text-white rounded-xl text-xs font-bold hover:bg-teal-600 transition"
            >
              Escanear un plato ahora
            </button>
          </div>
        {:else}
          {#each todayMeals as meal}
            <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center">
                  {meal.mealType.slice(0, 3)}
                </div>
                <div>
                  <h5 class="font-bold text-gray-900 text-sm">{meal.dishName}</h5>
                  <p class="text-xs text-gray-400">
                    {meal.time} · {meal.protein}g P · {meal.carbs}g C · {meal.fat}g G
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-teal-700">{meal.calories} kcal</span>
                <button
                  onclick={() => userData.removeLoggedMeal(meal.id)}
                  class="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition"
                  title="Eliminar registro"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  {:else if !imagePreview}
    <div class="bg-white rounded-2xl shadow-md p-8 text-center border-2 border-dashed border-teal-200">
      <div class="w-16 h-16 bg-teal-50 text-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Camera class="w-8 h-8" />
      </div>
      <h3 class="font-bold text-gray-800 text-lg mb-2">Fotografía tu plato</h3>
      <p class="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
        Toma una foto clara a tu comida para estimar calorías, balance de macros y recomendaciones saludables.
      </p>

      <label class="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-bold hover:from-teal-600 hover:to-teal-700 transition shadow-md cursor-pointer text-sm">
        <Camera class="w-5 h-5" />
        <span>Abrir cámara / Seleccionar foto</span>
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
    <div class="bg-white rounded-2xl shadow-md overflow-hidden border border-teal-50">
      <div class="relative">
        <img src={imagePreview} alt="Plato a analizar" class="w-full h-64 object-cover" />
        <button
          onclick={resetAnalysis}
          class="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white text-gray-700 transition"
          title="Tomar otra foto"
        >
          ✕
        </button>
      </div>

      {#if isLoading}
        <div class="p-8 text-center space-y-3">
          <Loader2 class="w-12 h-12 text-teal-500 mx-auto animate-spin" />
          <p class="text-sm font-semibold text-gray-700">{statusMessage || 'Analizando con IA...'}</p>
          <p class="text-xs text-gray-400">Reconociendo ingredientes y calculando porciones</p>
        </div>
      {:else if error}
        <div class="p-8 text-center space-y-3">
          <AlertCircle class="w-12 h-12 text-red-500 mx-auto" />
          <p class="text-red-600 font-semibold text-sm">{error}</p>
          <button
            onclick={resetAnalysis}
            class="px-5 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition text-sm font-semibold shadow-xs"
          >
            Reintentar con otra foto
          </button>
        </div>
      {:else if analysis}
        <div class="p-6 space-y-6">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="text-xl font-bold text-gray-900 leading-tight">{analysis.dishName}</h3>
              <p class="text-3xl font-black text-teal-600 mt-1">
                {analysis.estimatedCalories} <span class="text-lg font-bold text-gray-500">kcal</span>
              </p>
            </div>

            <button
              onclick={copyAnalysis}
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-teal-300 text-xs text-gray-600 hover:text-teal-600 transition"
            >
              {#if copied}
                <Check class="w-3.5 h-3.5 text-green-600" />
                <span class="text-green-600 font-semibold">Copiado</span>
              {:else}
                <Copy class="w-3.5 h-3.5" />
                <span>Copiar</span>
              {/if}
            </button>
          </div>

          <!-- Acción para registrar en el diario del día -->
          <div class="bg-teal-50/80 border border-teal-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold text-teal-900">Registrar como:</span>
              <select
                bind:value={mealTypeSelect}
                class="bg-white border border-teal-300 text-xs rounded-lg px-2.5 py-1 text-teal-900 font-medium focus:outline-none"
              >
                <option value="Desayuno">Desayuno</option>
                <option value="Almuerzo">Almuerzo</option>
                <option value="Cena">Cena</option>
                <option value="Snack">Snack</option>
              </select>
            </div>

            <button
              onclick={logThisMeal}
              class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition shadow-xs"
            >
              {#if loggedSuccess}
                <Check class="w-3.5 h-3.5 text-white" />
                <span>¡Registrado en tu Diario!</span>
              {:else}
                <PlusCircle class="w-3.5 h-3.5" />
                <span>Sumar a Mi Día</span>
              {/if}
            </button>
          </div>

          <!-- Health Score -->
          <div class="rounded-xl p-4 text-center border {getHealthColor(analysis.healthScore)}">
            <p class="text-xs uppercase font-bold tracking-wider opacity-90 mb-0.5">Puntuación de Salud Global</p>
            <p class="text-4xl font-black">{analysis.healthScore}<span class="text-xl font-bold opacity-75">/10</span></p>
          </div>

          <!-- Ingredientes Detectados -->
          {#if analysis.ingredients && analysis.ingredients.length > 0}
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Ingredientes identificados:</p>
              <div class="flex flex-wrap gap-1.5">
                {#each analysis.ingredients as ing}
                  <span class="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg font-medium">
                    {ing}
                  </span>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Macronutrientes -->
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-center">
              <p class="text-xs text-blue-800 font-medium">Proteínas</p>
              <p class="text-2xl font-black text-blue-700">{analysis.macronutrients.protein}g</p>
            </div>
            <div class="bg-orange-50/70 border border-orange-100 rounded-xl p-3 text-center">
              <p class="text-xs text-orange-800 font-medium">Carbohidratos</p>
              <p class="text-2xl font-black text-orange-700">{analysis.macronutrients.carbs}g</p>
            </div>
            <div class="bg-amber-50/70 border border-amber-100 rounded-xl p-3 text-center">
              <p class="text-xs text-amber-800 font-medium">Grasas</p>
              <p class="text-2xl font-black text-amber-700">{analysis.macronutrients.fat}g</p>
            </div>
            <div class="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 text-center">
              <p class="text-xs text-emerald-800 font-medium">Fibra</p>
              <p class="text-2xl font-black text-emerald-700">{analysis.macronutrients.fiber}g</p>
            </div>
          </div>

          <!-- Veredicto -->
          <div class="bg-teal-50 border border-teal-100 rounded-xl p-4">
            <h4 class="font-bold text-teal-900 text-sm mb-1 flex items-center gap-1.5">
              <Sparkles class="w-4 h-4 text-teal-600" /> Veredicto Dietético
            </h4>
            <p class="text-xs text-teal-800 leading-relaxed">{analysis.verdict}</p>
          </div>

          <!-- Sugerencias -->
          {#if analysis.suggestions && analysis.suggestions.length > 0}
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 class="font-bold text-amber-900 text-sm mb-2">💡 Sugerencias de mejora</h4>
              <ul class="text-xs text-amber-800 list-disc list-inside space-y-1.5 leading-relaxed">
                {#each analysis.suggestions as suggestion}
                  <li>{suggestion}</li>
                {/each}
              </ul>
            </div>
          {/if}

          <button
            onclick={resetAnalysis}
            class="w-full px-6 py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-bold hover:from-teal-600 hover:to-teal-700 transition shadow-md"
          >
            📷 Analizar otro plato
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>
