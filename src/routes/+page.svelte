<script lang="ts">
  import {
    ChefHat,
    Salad,
    CalendarDays,
    ArrowRight,
    Sparkles,
    Camera,
    Utensils,
    ShoppingBag,
    Flame,
    Bookmark,
    CheckCircle
  } from 'lucide-svelte';
  import { userData } from '$lib/state/user-storage.svelte';

  const todaySummary = $derived(userData.getTodayNutritionSummary());
  const todayMeals = $derived(userData.getTodayMeals());
  const caloriePct = $derived(
    Math.min(100, Math.round((todaySummary.calories / (userData.calorieGoal || 2000)) * 100))
  );

  // Saludo según la hora
  const hour = new Date().getHours();
  const greeting = hour < 12 ? '¡Buenos días!' : hour < 19 ? '¡Buenas tardes!' : '¡Buenas noches!';

  // Día de la semana actual
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const todayName = dayNames[new Date().getDay()];

  // Comidas sugeridas de hoy según el plan semanal activo
  const todayPlan = $derived.by(() => {
    if (!userData.activePlan?.weeklyPlan) return null;
    return userData.activePlan.weeklyPlan.find(
      (p) => p.day.toLowerCase() === todayName.toLowerCase()
    ) || userData.activePlan.weeklyPlan[0];
  });
</script>

<div class="space-y-6">
  <!-- Saludo Dinámico -->
  <div class="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
    <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
    <div class="relative z-10 space-y-2">
      <div class="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
        <Sparkles class="w-3.5 h-3.5" />
        <span>Tu Asistente Culinario & Nutricional</span>
      </div>
      <h2 class="text-2xl font-black tracking-tight leading-tight">
        {greeting} Chef 🍳
      </h2>
      <p class="text-xs text-orange-100 max-w-sm">
        ¿Qué cocinamos hoy o qué plato deseas auditar con la cámara?
      </p>

      <!-- Accesos rápidos rápidos en el banner -->
      <div class="pt-2 flex gap-2">
        <a
          href="/nutri"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-orange-700 rounded-lg text-xs font-bold shadow-xs hover:bg-orange-50 transition"
        >
          <Camera class="w-3.5 h-3.5" />
          <span>Escanear comida</span>
        </a>
        <a
          href="/chef"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 text-white rounded-lg text-xs font-bold hover:bg-white/30 transition backdrop-blur-xs"
        >
          <Utensils class="w-3.5 h-3.5" />
          <span>Cocinar con sobras</span>
        </a>
      </div>
    </div>
  </div>

  <!-- Widget de Seguimiento Diario (si hay comidas registradas hoy) -->
  {#if todayMeals.length > 0}
    <div class="bg-white rounded-2xl p-5 border border-teal-100 shadow-sm space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
            <Flame class="w-4 h-4" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-gray-800">Calorías consumidas hoy</h4>
            <p class="text-[11px] text-gray-400">{todayMeals.length} plato(s) registrado(s)</p>
          </div>
        </div>
        <a href="/nutri" class="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
          Ver diario <ArrowRight class="w-3 h-3" />
        </a>
      </div>

      <div>
        <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div class="bg-teal-500 h-full rounded-full transition-all duration-500" style="width: {caloriePct}%"></div>
        </div>
        <div class="flex justify-between text-xs text-gray-500 mt-1 font-medium">
          <span>{todaySummary.calories} kcal ({caloriePct}%)</span>
          <span>Meta: {userData.calorieGoal} kcal</span>
        </div>
      </div>
    </div>
  {/if}

  <!-- Widget de Menú de Hoy según el Plan Semanal (si existe) -->
  {#if todayPlan}
    <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-md space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <CalendarDays class="w-4 h-4 text-teal-400" />
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-300">
            Menú de hoy ({todayPlan.day})
          </h4>
        </div>
        <a href="/plan" class="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1">
          Ver semana <ArrowRight class="w-3 h-3" />
        </a>
      </div>

      <div class="grid grid-cols-3 gap-2 text-xs">
        <div class="bg-white/10 rounded-xl p-2.5 space-y-1">
          <span class="text-[10px] text-slate-400 font-medium">🌅 Desayuno</span>
          <p class="font-bold text-slate-100 line-clamp-1">{todayPlan.meals.breakfast.name}</p>
          <span class="text-[10px] text-teal-300">{todayPlan.meals.breakfast.calories} kcal</span>
        </div>
        <div class="bg-white/10 rounded-xl p-2.5 space-y-1">
          <span class="text-[10px] text-slate-400 font-medium">🍽️ Almuerzo</span>
          <p class="font-bold text-slate-100 line-clamp-1">{todayPlan.meals.lunch.name}</p>
          <span class="text-[10px] text-teal-300">{todayPlan.meals.lunch.calories} kcal</span>
        </div>
        <div class="bg-white/10 rounded-xl p-2.5 space-y-1">
          <span class="text-[10px] text-slate-400 font-medium">🌙 Cena</span>
          <p class="font-bold text-slate-100 line-clamp-1">{todayPlan.meals.dinner.name}</p>
          <span class="text-[10px] text-teal-300">{todayPlan.meals.dinner.calories} kcal</span>
        </div>
      </div>
    </div>
  {/if}

  <!-- Tarjetas de Módulos Principales -->
  <div class="space-y-4">
    <div class="flex items-center justify-between px-1">
      <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400">
        Módulos Inteligentes
      </h3>
      {#if userData.savedRecipes.length > 0}
        <a href="/chef" class="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
          <Bookmark class="w-3.5 h-3.5" />
          <span>{userData.savedRecipes.length} recetas guardadas</span>
        </a>
      {/if}
    </div>

    <!-- 1. Módulo Chef -->
    <a
      href="/chef"
      class="group block bg-white rounded-2xl p-5 shadow-sm border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all duration-200"
    >
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ChefHat class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-bold text-gray-800 text-base group-hover:text-orange-600 transition-colors">
                Módulo Chef
              </h4>
              <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
                Recetas
              </span>
            </div>
            <p class="text-xs text-gray-500 mt-0.5">
              Cocina con lo que tienes en tu despensa
            </p>
          </div>
        </div>
        <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
          <ArrowRight class="w-4 h-4" />
        </div>
      </div>

      <p class="text-xs text-gray-600 mt-3 line-clamp-2 leading-relaxed">
        Escribe tus ingredientes o toma una foto de tu nevera. La IA te creará 2 o 3 recetas paso a paso.
      </p>

      <div class="mt-3.5 pt-3 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-500">
        <span class="inline-flex items-center gap-1">
          <Utensils class="w-3.5 h-3.5 text-orange-500" /> Por texto
        </span>
        <span class="inline-flex items-center gap-1">
          <Camera class="w-3.5 h-3.5 text-orange-500" /> Por foto
        </span>
      </div>
    </a>

    <!-- 2. Módulo Nutri -->
    <a
      href="/nutri"
      class="group block bg-white rounded-2xl p-5 shadow-sm border border-teal-100 hover:border-teal-300 hover:shadow-md transition-all duration-200"
    >
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Salad class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-bold text-gray-800 text-base group-hover:text-teal-600 transition-colors">
                Módulo Nutri
              </h4>
              <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-600 border border-teal-200">
                Visión IA
              </span>
            </div>
            <p class="text-xs text-gray-500 mt-0.5">
              Auditoría y análisis de tu plato
            </p>
          </div>
        </div>
        <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-teal-500 group-hover:text-white transition-all">
          <ArrowRight class="w-4 h-4" />
        </div>
      </div>

      <p class="text-xs text-gray-600 mt-3 line-clamp-2 leading-relaxed">
        Toma una foto de tu plato y calcula calorías estimadas, macronutrientes, salud global y consejos.
      </p>

      <div class="mt-3.5 pt-3 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-500">
        <span class="inline-flex items-center gap-1">
          <Camera class="w-3.5 h-3.5 text-teal-500" /> Escaneo instantáneo
        </span>
        <span class="text-teal-700 font-medium">Calorías & Macros</span>
      </div>
    </a>

    <!-- 3. Módulo Plan -->
    <a
      href="/plan"
      class="group block bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all duration-200"
    >
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <CalendarDays class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-bold text-gray-800 text-base group-hover:text-slate-800 transition-colors">
                Módulo Plan
              </h4>
              <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                Semanal
              </span>
            </div>
            <p class="text-xs text-gray-500 mt-0.5">
              Menú completo y lista de supermercado
            </p>
          </div>
        </div>
        <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-slate-800 group-hover:text-white transition-all">
          <ArrowRight class="w-4 h-4" />
        </div>
      </div>

      <p class="text-xs text-gray-600 mt-3 line-clamp-2 leading-relaxed">
        Genera tu menú completo de 7 días (desayuno, almuerzo y cena) adaptado a tus metas y restricciones.
      </p>

      <div class="mt-3.5 pt-3 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-500">
        <span class="inline-flex items-center gap-1">
          <ShoppingBag class="w-3.5 h-3.5 text-slate-700" /> Lista de compras automática
        </span>
      </div>
    </a>
  </div>
</div>
