<script lang="ts">
  import { Calendar, ShoppingBag, Loader2, Apple, Beef, Wheat, Milk, Citrus } from 'lucide-svelte';
  
  interface Meal {
    name: string;
    calories: number;
    ingredients?: string[];
    instructions?: string;
  }

  interface DailyPlan {
    day: string;
    meals: {
      breakfast: Meal;
      lunch: Meal;
      dinner: Meal;
    };
    totalCalories: number;
  }

  interface ShoppingList {
    proteins: string[];
    vegetables: string[];
    grains: string[];
    dairy: string[];
    fruits: string[];
    other: string[];
  }

  interface WeeklyNutrition {
    totalCalories: number;
    averageDailyCalories: number;
    proteinPercentage: number;
    carbsPercentage: number;
    fatPercentage: number;
  }

  interface MealPlan {
    weeklyPlan: DailyPlan[];
    shoppingList: ShoppingList;
    weeklyNutrition: WeeklyNutrition;
  }

  let preferences = $state('');
  let dietaryRestrictions = $state('');
  let isLoading = $state(false);
  let mealPlan: MealPlan | null = $state(null);
  let error: string | null = $state(null);
  let selectedDay = $state(0);
  
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  async function generatePlan() {
    isLoading = true;
    error = null;
    mealPlan = null;
    
    try {
      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences, dietaryRestrictions })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al generar plan');
      }
      
      mealPlan = data;
      selectedDay = 0;
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error desconocido';
    } finally {
      isLoading = false;
    }
  }
  
  function resetPlan() {
    mealPlan = null;
    error = null;
    selectedDay = 0;
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
    <h2 class="text-2xl font-bold text-gray-800">Módulo Plan</h2>
    <p class="text-gray-500 mt-1">Planifica tu semana con IA</p>
  </div>

  {#if !mealPlan}
    <div class="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          🎯 Preferencias (opcional)
        </label>
        <textarea
          bind:value={preferences}
          placeholder="Ej: Me gusta la comida mediterránea, prefiero cenas ligeras..."
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
          rows="3"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          ⚠️ Restricciones dietéticas (opcional)
        </label>
        <textarea
          bind:value={dietaryRestrictions}
          placeholder="Ej: Vegetariano, sin gluten, bajo en carbohidratos..."
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
          rows="3"
        ></textarea>
      </div>

      <button
        onclick={generatePlan}
        disabled={isLoading}
        class="w-full px-6 py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {#if isLoading}
          <Loader2 class="w-5 h-5 animate-spin" />
          Generando plan...
        {:else}
          <Calendar class="w-5 h-5" />
          Generar plan semanal
        {/if}
      </button>

      {#if error}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      {/if}

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-sm text-blue-800">
          <span class="font-semibold">💡 Tip:</span> Sé específico con tus preferencias para un plan más personalizado
        </p>
      </div>
    </div>
  {:else}
    <div class="space-y-6">
      {#if mealPlan.weeklyNutrition}
        <div class="bg-linear-to-r from-teal-500 to-green-500 rounded-2xl shadow-md p-6 text-white">
          <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
            <Apple class="w-5 h-5" />
            Resumen Semanal
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white/20 rounded-lg p-3">
              <p class="text-sm opacity-90">Calorías totales</p>
              <p class="text-2xl font-bold">{mealPlan.weeklyNutrition.totalCalories.toLocaleString()} kcal</p>
            </div>
            <div class="bg-white/20 rounded-lg p-3">
              <p class="text-sm opacity-90">Promedio diario</p>
              <p class="text-2xl font-bold">{mealPlan.weeklyNutrition.averageDailyCalories.toLocaleString()} kcal</p>
            </div>
          </div>
          <div class="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <div class="bg-white/20 rounded-lg p-2">
              <p class="opacity-90">Proteínas</p>
              <p class="font-bold">{mealPlan.weeklyNutrition.proteinPercentage}%</p>
            </div>
            <div class="bg-white/20 rounded-lg p-2">
              <p class="opacity-90">Carbos</p>
              <p class="font-bold">{mealPlan.weeklyNutrition.carbsPercentage}%</p>
            </div>
            <div class="bg-white/20 rounded-lg p-2">
              <p class="opacity-90">Grasas</p>
              <p class="font-bold">{mealPlan.weeklyNutrition.fatPercentage}%</p>
            </div>
          </div>
        </div>
      {/if}

      <div class="bg-white rounded-2xl shadow-md p-4">
        <div class="flex gap-2 overflow-x-auto pb-2">
          {#each days as day, index}
            <button
              onclick={() => selectedDay = index}
              class="flex-1 min-w-20 px-3 py-2 rounded-lg font-medium transition text-sm {
                selectedDay === index 
                  ? 'bg-teal-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }"
            >
              {day.slice(0, 3)}
            </button>
          {/each}
        </div>
      </div>

      {#if mealPlan.weeklyPlan && mealPlan.weeklyPlan[selectedDay]}
        <div class="space-y-4">
          <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar class="w-6 h-6 text-teal-500" />
            {mealPlan.weeklyPlan[selectedDay].day}
            <span class="text-sm font-normal text-gray-500 ml-2">
              ({mealPlan.weeklyPlan[selectedDay].totalCalories} kcal)
            </span>
          </h3>

          {#each Object.entries(mealPlan.weeklyPlan[selectedDay].meals) as [mealType, meal]}
            {@const m = meal as Meal}
            <div class="bg-white rounded-2xl shadow-md p-6 space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <span class="text-2xl">{getMealIcon(mealType)}</span>
                  {getMealLabel(mealType)}
                </h4>
                <span class="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-semibold">
                  {m.calories} kcal
                </span>
              </div>

              <h5 class="font-semibold text-gray-700">{m.name}</h5>

              {#if m.instructions}
                <p class="text-sm text-gray-600">{m.instructions}</p>
              {/if}

              {#if m.ingredients && m.ingredients.length > 0}
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-2">Ingredientes:</p>
                  <div class="flex flex-wrap gap-2">
                    {#each m.ingredients as ingredient}
                      <span class="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
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

      {#if mealPlan.shoppingList}
        <div class="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingBag class="w-6 h-6 text-teal-500" />
            Lista de Compras
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {#if mealPlan.shoppingList.proteins}
              <div class="bg-red-50 rounded-lg p-4">
                <h4 class="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <Beef class="w-4 h-4" />
                  Proteínas
                </h4>
                <ul class="text-sm text-red-700 space-y-1">
                  {#each mealPlan.shoppingList.proteins as item}
                    <li>• {item}</li>
                  {/each}
                </ul>
              </div>
            {/if}

            {#if mealPlan.shoppingList.vegetables}
              <div class="bg-green-50 rounded-lg p-4">
                <h4 class="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <Apple class="w-4 h-4" />
                  Vegetales
                </h4>
                <ul class="text-sm text-green-700 space-y-1">
                  {#each mealPlan.shoppingList.vegetables as item}
                    <li>• {item}</li>
                  {/each}
                </ul>
              </div>
            {/if}

            {#if mealPlan.shoppingList.grains}
              <div class="bg-yellow-50 rounded-lg p-4">
                <h4 class="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <Wheat class="w-4 h-4" />
                  Granos y Cereales
                </h4>
                <ul class="text-sm text-yellow-700 space-y-1">
                  {#each mealPlan.shoppingList.grains as item}
                    <li>• {item}</li>
                  {/each}
                </ul>
              </div>
            {/if}

            {#if mealPlan.shoppingList.dairy}
              <div class="bg-blue-50 rounded-lg p-4">
                <h4 class="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Milk class="w-4 h-4" />
                  Lácteos
                </h4>
                <ul class="text-sm text-blue-700 space-y-1">
                  {#each mealPlan.shoppingList.dairy as item}
                    <li>• {item}</li>
                  {/each}
                </ul>
              </div>
            {/if}

            {#if mealPlan.shoppingList.fruits}
              <div class="bg-orange-50 rounded-lg p-4">
                <h4 class="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                  <Citrus class="w-4 h-4" />
                  Frutas
                </h4>
                <ul class="text-sm text-orange-700 space-y-1">
                  {#each mealPlan.shoppingList.fruits as item}
                    <li>• {item}</li>
                  {/each}
                </ul>
              </div>
            {/if}

            {#if mealPlan.shoppingList.other}
              <div class="bg-purple-50 rounded-lg p-4">
                <h4 class="font-semibold text-purple-800 mb-2">Otros</h4>
                <ul class="text-sm text-purple-700 space-y-1">
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
        class="w-full px-6 py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition"
      >
        🔄 Generar nuevo plan
      </button>
    </div>
  {/if}
</div>