<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Calendar,
    ShoppingBag,
    Loader2,
    Apple,
    Beef,
    Wheat,
    Milk,
    Citrus,
    Copy,
    Check,
    Share2,
    CalendarDays
  } from 'lucide-svelte';
  import { userData } from '$lib/state/user-storage.svelte';
  import type { MealPlan } from '$lib/types/ai-schemas';

  let preferences = $state('');
  let dietaryRestrictions = $state('');
  let isLoading = $state(false);
  let mealPlan: MealPlan | null = $state(null);
  let error: string | null = $state(null);
  let selectedDay = $state(0);
  let copiedList = $state(false);

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  onMount(() => {
    try {
      const saved = localStorage.getItem('savor_saved_meal_plan');
      if (saved) {
        mealPlan = JSON.parse(saved);
      }
    } catch {
      // Ignorar error de localStorage
    }
  });

  async function generatePlan() {
    isLoading = true;
    error = null;

    try {
      const mergedPreferences = [
        preferences.trim(),
        userData.profile.dietPreference && userData.profile.dietPreference !== 'Equilibrada'
          ? `Dieta: ${userData.profile.dietPreference}`
          : '',
        `Meta calórica diaria objetivo aproximada: ${userData.calorieGoal} kcal`
      ].filter(Boolean).join('. ');

      const mergedRestrictions = [
        dietaryRestrictions.trim(),
        userData.profile.allergies.length > 0
          ? `Alergias estrictas a excluir: ${userData.profile.allergies.join(', ')}`
          : ''
      ].filter(Boolean).join('. ');

      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: mergedPreferences,
          dietaryRestrictions: mergedRestrictions
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al generar el plan.');
      }

      mealPlan = data;
      userData.activePlan = data;
      selectedDay = 0;
      try {
        localStorage.setItem('savor_saved_meal_plan', JSON.stringify(data));
      } catch {}

    } catch (err) {
      error = err instanceof Error ? err.message : 'Error desconocido al generar plan';
    } finally {
      isLoading = false;
    }
  }

  function resetPlan() {
    if (confirm('¿Deseas descartar el plan actual y generar uno nuevo?')) {
      mealPlan = null;
      userData.activePlan = null;
      error = null;
      selectedDay = 0;
      try {
        localStorage.removeItem('savor_saved_meal_plan');
      } catch {}
    }
  }

  function getShoppingListText(): string {
    if (!mealPlan?.shoppingList) return '';
    const sl = mealPlan.shoppingList;
    let text = '🛒 Lista de Supermercado - Savor IQ\n\n';
    if (sl.proteins?.length) text += `🥩 Proteínas:\n${sl.proteins.map(i => `• ${i}`).join('\n')}\n\n`;
    if (sl.vegetables?.length) text += `🥬 Vegetales:\n${sl.vegetables.map(i => `• ${i}`).join('\n')}\n\n`;
    if (sl.fruits?.length) text += `🍎 Frutas:\n${sl.fruits.map(i => `• ${i}`).join('\n')}\n\n`;
    if (sl.grains?.length) text += `🌾 Granos:\n${sl.grains.map(i => `• ${i}`).join('\n')}\n\n`;
    if (sl.dairy?.length) text += `🥛 Lácteos:\n${sl.dairy.map(i => `• ${i}`).join('\n')}\n\n`;
    if (sl.other?.length) text += `🧂 Otros:\n${sl.other.map(i => `• ${i}`).join('\n')}\n\n`;
    return text.trim();
  }

  async function copyShoppingList() {
    const text = getShoppingListText();
    try {
      await navigator.clipboard.writeText(text);
      copiedList = true;
      setTimeout(() => copiedList = false, 2500);
    } catch {
      alert('No se pudo copiar');
    }
  }

  function shareToWhatsApp() {
    const text = getShoppingListText();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  function getMealIcon(mealType: string): string {
    if (mealType === 'breakfast') return '🌅';
    if (mealType === 'lunch') return '🍽️';
    return '🌙';
  }

  function getMealLabel(mealType: string): string {
    if (mealType === 'breakfast') return 'Desayuno';
    if (mealType === 'lunch') return 'Almuerzo';
    return 'Cena';
  }
</script>

<div class="space-y-6">
  <div class="text-center">
    <h2 class="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
      <CalendarDays class="w-7 h-7 text-teal-600" />
      Módulo Plan Semanal
    </h2>
    <p class="text-gray-500 text-sm mt-1">Organiza tu semana y compras con IA</p>
  </div>

  {#if !mealPlan}
    <div class="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <div>
        <label for="preferences" class="block text-sm font-medium text-gray-700 mb-2">
          🎯 Preferencias (opcional)
        </label>
        <textarea
          id="preferences"
          bind:value={preferences}
          placeholder="Ej: Me gusta la comida mediterránea, prefiero cenas ligeras, alto en proteína..."
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-sm"
          rows="3"
        ></textarea>
      </div>

      <div>
        <label for="restrictions" class="block text-sm font-medium text-gray-700 mb-2">
          ⚠️ Restricciones dietéticas o alergias (opcional)
        </label>
        <textarea
          id="restrictions"
          bind:value={dietaryRestrictions}
          placeholder="Ej: Vegetariano, sin gluten, bajo en sodio, sin mariscos..."
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-sm"
          rows="3"
        ></textarea>
      </div>

      {#if userData.profile.allergies.length > 0 || userData.profile.dietPreference !== 'Equilibrada'}
        <div class="flex items-center gap-2 text-xs text-teal-800 bg-teal-50 px-3.5 py-2 rounded-xl border border-teal-200">
          <span>🛡️ <strong>Ajustes de Perfil activos:</strong> {userData.profile.dietPreference} {userData.profile.allergies.length ? `· Excluyendo: ${userData.profile.allergies.join(', ')}` : ''} · Meta: {userData.calorieGoal} kcal</span>
        </div>
      {/if}

      <button
        onclick={generatePlan}
        disabled={isLoading}
        class="w-full px-6 py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-bold hover:from-teal-600 hover:to-teal-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {#if isLoading}
          <Loader2 class="w-5 h-5 animate-spin" />
          <span>Diseñando tu plan de 7 días con IA...</span>
        {:else}
          <Calendar class="w-5 h-5" />
          <span>Generar plan semanal completo</span>
        {/if}
      </button>

      {#if error}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      {/if}

      <div class="bg-teal-50/70 border border-teal-200 rounded-xl p-3.5 text-xs text-teal-900 leading-relaxed">
        <span class="font-bold">💡 Tip:</span> Mientras más detalles aportes sobre tus hábitos y gustos, más variado y ajustado a tu estilo de vida será el menú.
      </div>
    </div>
  {:else}
    <div class="space-y-6">
      {#if mealPlan.weeklyNutrition}
        <div class="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl shadow-md p-6 text-white">
          <h3 class="text-base font-bold mb-4 flex items-center gap-2">
            <Apple class="w-5 h-5" />
            Resumen Nutricional Semanal
          </h3>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-white/20 backdrop-blur-xs rounded-xl p-3">
              <p class="text-xs opacity-90">Calorías totales</p>
              <p class="text-2xl font-black">{mealPlan.weeklyNutrition.totalCalories.toLocaleString()} kcal</p>
            </div>
            <div class="bg-white/20 backdrop-blur-xs rounded-xl p-3">
              <p class="text-xs opacity-90">Promedio diario</p>
              <p class="text-2xl font-black">{mealPlan.weeklyNutrition.averageDailyCalories.toLocaleString()} kcal</p>
            </div>
          </div>
          <div class="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div class="bg-white/20 rounded-lg p-2">
              <p class="opacity-90">Proteínas</p>
              <p class="font-bold text-sm">{mealPlan.weeklyNutrition.proteinPercentage}%</p>
            </div>
            <div class="bg-white/20 rounded-lg p-2">
              <p class="opacity-90">Carbos</p>
              <p class="font-bold text-sm">{mealPlan.weeklyNutrition.carbsPercentage}%</p>
            </div>
            <div class="bg-white/20 rounded-lg p-2">
              <p class="opacity-90">Grasas</p>
              <p class="font-bold text-sm">{mealPlan.weeklyNutrition.fatPercentage}%</p>
            </div>
          </div>
        </div>
      {/if}

      <!-- Selector de días -->
      <div class="bg-white rounded-2xl shadow-sm p-3 border border-gray-100">
        <div class="flex gap-1.5 overflow-x-auto pb-1">
          {#each days as day, index}
            <button
              onclick={() => selectedDay = index}
              class="flex-1 min-w-[70px] py-2 px-2.5 rounded-lg font-semibold transition text-xs {
                selectedDay === index 
                  ? 'bg-teal-500 text-white shadow-xs' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }"
            >
              {day.slice(0, 3)}
            </button>
          {/each}
        </div>
      </div>

      <!-- Comidas del día seleccionado -->
      {#if mealPlan.weeklyPlan && mealPlan.weeklyPlan[selectedDay]}
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Calendar class="w-5 h-5 text-teal-600" />
              {mealPlan.weeklyPlan[selectedDay].day}
            </h3>
            <span class="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-200">
              {mealPlan.weeklyPlan[selectedDay].totalCalories} kcal en el día
            </span>
          </div>

          {#each Object.entries(mealPlan.weeklyPlan[selectedDay].meals) as [mealType, meal]}
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="text-base font-bold text-gray-800 flex items-center gap-2">
                  <span class="text-xl">{getMealIcon(mealType)}</span>
                  {getMealLabel(mealType)}
                </h4>
                <span class="px-2.5 py-0.5 bg-teal-50 text-teal-700 rounded-full text-xs font-bold border border-teal-100">
                  {meal.calories} kcal
                </span>
              </div>

              <h5 class="font-semibold text-gray-800 text-sm">{meal.name}</h5>

              {#if meal.instructions}
                <p class="text-xs text-gray-600 leading-relaxed">{meal.instructions}</p>
              {/if}

              {#if meal.ingredients && meal.ingredients.length > 0}
                <div>
                  <p class="text-[11px] uppercase font-bold tracking-wider text-gray-400 mb-1.5">Ingredientes:</p>
                  <div class="flex flex-wrap gap-1.5">
                    {#each meal.ingredients as ingredient}
                      <span class="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700">
                        {ingredient}
                      </span>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}

      <!-- Lista de compras -->
      {#if mealPlan.shoppingList}
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
              <ShoppingBag class="w-5 h-5 text-teal-600" />
              Lista de Compras Semanal
            </h3>
            
            <div class="flex items-center gap-2">
              <button
                onclick={copyShoppingList}
                class="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:text-teal-600 hover:border-teal-300 transition"
                title="Copiar lista"
              >
                {#if copiedList}
                  <Check class="w-3.5 h-3.5 text-green-600" />
                  <span class="text-green-600">Copiada</span>
                {:else}
                  <Copy class="w-3.5 h-3.5" />
                  <span>Copiar</span>
                {/if}
              </button>
              
              <button
                onclick={shareToWhatsApp}
                class="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-xs font-semibold text-green-700 hover:bg-green-100 transition"
                title="Enviar por WhatsApp"
              >
                <Share2 class="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {#if mealPlan.shoppingList.proteins?.length}
              <div class="bg-red-50/70 border border-red-100 rounded-xl p-3.5">
                <h4 class="font-bold text-red-900 mb-2 flex items-center gap-1.5">
                  <Beef class="w-4 h-4 text-red-600" /> Proteínas
                </h4>
                <ul class="text-red-800 space-y-1">
                  {#each mealPlan.shoppingList.proteins as item}
                    <li>• {item}</li>
                  {/each}
                </ul>
              </div>
            {/if}

            {#if mealPlan.shoppingList.vegetables?.length}
              <div class="bg-green-50/70 border border-green-100 rounded-xl p-3.5">
                <h4 class="font-bold text-green-900 mb-2 flex items-center gap-1.5">
                  <Apple class="w-4 h-4 text-green-600" /> Vegetales
                </h4>
                <ul class="text-green-800 space-y-1">
                  {#each mealPlan.shoppingList.vegetables as item}
                    <li>• {item}</li>
                  {/each}
                </ul>
              </div>
            {/if}

            {#if mealPlan.shoppingList.fruits?.length}
              <div class="bg-orange-50/70 border border-orange-100 rounded-xl p-3.5">
                <h4 class="font-bold text-orange-900 mb-2 flex items-center gap-1.5">
                  <Citrus class="w-4 h-4 text-orange-600" /> Frutas
                </h4>
                <ul class="text-orange-800 space-y-1">
                  {#each mealPlan.shoppingList.fruits as item}
                    <li>• {item}</li>
                  {/each}
                </ul>
              </div>
            {/if}

            {#if mealPlan.shoppingList.grains?.length}
              <div class="bg-amber-50/70 border border-amber-100 rounded-xl p-3.5">
                <h4 class="font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                  <Wheat class="w-4 h-4 text-amber-600" /> Granos y Cereales
                </h4>
                <ul class="text-amber-800 space-y-1">
                  {#each mealPlan.shoppingList.grains as item}
                    <li>• {item}</li>
                  {/each}
                </ul>
              </div>
            {/if}

            {#if mealPlan.shoppingList.dairy?.length}
              <div class="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5">
                <h4 class="font-bold text-blue-900 mb-2 flex items-center gap-1.5">
                  <Milk class="w-4 h-4 text-blue-600" /> Lácteos
                </h4>
                <ul class="text-blue-800 space-y-1">
                  {#each mealPlan.shoppingList.dairy as item}
                    <li>• {item}</li>
                  {/each}
                </ul>
              </div>
            {/if}

            {#if mealPlan.shoppingList.other?.length}
              <div class="bg-purple-50/70 border border-purple-100 rounded-xl p-3.5">
                <h4 class="font-bold text-purple-900 mb-2">🧂 Otros</h4>
                <ul class="text-purple-800 space-y-1">
                  {#each mealPlan.shoppingList.other as item}
                    <li>• {item}</li>
                  {/each}
                </ul>
              </div>
            {/if}
          </div>
        </div>
      {/if}

      <button
        onclick={resetPlan}
        class="w-full px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition text-sm"
      >
        🔄 Descartar y generar nuevo menú
      </button>
    </div>
  {/if}
</div>
