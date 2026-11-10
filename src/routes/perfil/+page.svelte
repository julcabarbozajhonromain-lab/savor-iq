<script lang="ts">
  import { User, Flame, Scale, Activity, Target, ShieldAlert, Check, RefreshCw, Trash2 } from 'lucide-svelte';
  import { userData, type UserProfile } from '$lib/state/user-storage.svelte';

  let form: UserProfile = $state({ ...userData.profile });
  let savedNotification = $state(false);

  // Cálculo en tiempo real de calorías recomendadas según los valores actuales del formulario
  const calculatedCalories = $derived(userData.calculateRecommendedCalories(form));

  const allergyOptions = [
    'Sin gluten',
    'Sin lactosa',
    'Sin mariscos',
    'Sin frutos secos',
    'Sin huevo',
    'Sin soja'
  ];

  const dietOptions = [
    'Equilibrada',
    'Mediterránea',
    'Vegetariana',
    'Vegana',
    'Keto / Cetogénica',
    'Baja en carbohidratos',
    'Alta en proteína'
  ];

  function toggleAllergy(allergy: string) {
    if (form.allergies.includes(allergy)) {
      form.allergies = form.allergies.filter((a) => a !== allergy);
    } else {
      form.allergies = [...form.allergies, allergy];
    }
  }

  function handleSave() {
    userData.saveProfile(form);
    savedNotification = true;
    setTimeout(() => (savedNotification = false), 3000);
  }

  function handleReset() {
    if (confirm('¿Estás seguro de que deseas reiniciar todos tus datos, comidas y recetas guardadas? Esta acción no se puede deshacer.')) {
      userData.clearAllData();
      form = { ...userData.profile };
      alert('Tus datos han sido reiniciados correctamente.');
    }
  }
</script>

<div class="space-y-6">
  <div class="text-center">
    <h2 class="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
      <User class="w-7 h-7 text-orange-500" />
      Mi Perfil Nutricional
    </h2>
    <p class="text-gray-500 text-sm mt-1">Personaliza tus metas, alergias y requerimiento calórico</p>
  </div>

  <!-- Tarjeta de Meta Calórica Calculada -->
  <div class="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white shadow-lg space-y-2">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Flame class="w-5 h-5 text-amber-200" />
        <span class="text-xs font-bold uppercase tracking-wider text-orange-100">
          Meta Diaria Recomendada
        </span>
      </div>
      <span class="text-xs bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full font-semibold">
        Mifflin-St Jeor
      </span>
    </div>
    
    <div class="flex items-baseline gap-2">
      <p class="text-4xl font-black">{calculatedCalories}</p>
      <span class="text-lg font-bold text-orange-100">kcal / día</span>
    </div>
    
    <p class="text-xs text-orange-100 opacity-90 leading-relaxed">
      Ajustada a tu metabolismo basal, nivel de actividad y objetivo ({form.fitnessGoal === 'perder' ? 'Déficit calórico para perder grasa' : form.fitnessGoal === 'ganar' ? 'Superávit para ganar masa' : 'Mantenimiento saludable'}).
    </p>
  </div>

  <!-- Formulario de Parámetros Físicos -->
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
    <h3 class="text-sm font-bold text-gray-800 flex items-center gap-2">
      <Scale class="w-4 h-4 text-orange-500" />
      Datos Antropométricos
    </h3>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label for="profile-gender" class="block text-xs font-semibold text-gray-600 mb-1.5">Sexo biológico</label>
        <select
          id="profile-gender"
          bind:value={form.gender}
          class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="Hombre">Hombre</option>
          <option value="Mujer">Mujer</option>
        </select>
      </div>

      <div>
        <label for="profile-age" class="block text-xs font-semibold text-gray-600 mb-1.5">Edad (años)</label>
        <input
          id="profile-age"
          type="number"
          min="12"
          max="110"
          bind:value={form.age}
          class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label for="profile-weight" class="block text-xs font-semibold text-gray-600 mb-1.5">Peso (kg)</label>
        <input
          id="profile-weight"
          type="number"
          min="30"
          max="250"
          step="0.5"
          bind:value={form.weightKg}
          class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label for="profile-height" class="block text-xs font-semibold text-gray-600 mb-1.5">Altura (cm)</label>
        <input
          id="profile-height"
          type="number"
          min="100"
          max="240"
          bind:value={form.heightCm}
          class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
    </div>

    <!-- Nivel de Actividad -->
    <div>
      <label for="profile-activity" class="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
        <Activity class="w-3.5 h-3.5 text-orange-500" />
        Nivel de Actividad Física
      </label>
      <select
        id="profile-activity"
        bind:value={form.activityLevel}
        class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <option value="sedentario">Sedentario (Trabajo de escritorio, poco ejercicio)</option>
        <option value="ligero">Ligero (Ejercicio 1 a 3 veces por semana)</option>
        <option value="moderado">Moderado (Ejercicio 3 a 5 veces por semana)</option>
        <option value="activo">Muy Activo (Ejercicio intenso 6 a 7 días)</option>
      </select>
    </div>

    <!-- Objetivo -->
    <div>
      <label for="profile-goal" class="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
        <Target class="w-3.5 h-3.5 text-orange-500" />
        Objetivo Actual
      </label>
      <div id="profile-goal" class="grid grid-cols-3 gap-2">
        <button
          type="button"
          onclick={() => (form.fitnessGoal = 'perder')}
          class="py-2.5 px-2 rounded-xl text-xs font-bold transition border {
            form.fitnessGoal === 'perder'
              ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-xs'
              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
          }"
        >
          Perder peso
        </button>
        <button
          type="button"
          onclick={() => (form.fitnessGoal = 'mantener')}
          class="py-2.5 px-2 rounded-xl text-xs font-bold transition border {
            form.fitnessGoal === 'mantener'
              ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-xs'
              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
          }"
        >
          Mantener
        </button>
        <button
          type="button"
          onclick={() => (form.fitnessGoal = 'ganar')}
          class="py-2.5 px-2 rounded-xl text-xs font-bold transition border {
            form.fitnessGoal === 'ganar'
              ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-xs'
              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
          }"
        >
          Ganar masa
        </button>
      </div>
    </div>
  </div>

  <!-- Preferencias y Alergias -->
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
    <h3 class="text-sm font-bold text-gray-800 flex items-center gap-2">
      <ShieldAlert class="w-4 h-4 text-orange-500" />
      Preferencias y Restricciones
    </h3>

    <div>
      <label for="profile-diet" class="block text-xs font-semibold text-gray-600 mb-1.5">Estilo de Dieta Preferido</label>
      <select
        id="profile-diet"
        bind:value={form.dietPreference}
        class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        {#each dietOptions as diet}
          <option value={diet}>{diet}</option>
        {/each}
      </select>
    </div>

    <div>
      <span class="block text-xs font-semibold text-gray-600 mb-2">Alergias o Alimentos a Evitar</span>
      <div class="flex flex-wrap gap-2">
        {#each allergyOptions as allergy}
          {@const isChecked = form.allergies.includes(allergy)}
          <button
            type="button"
            onclick={() => toggleAllergy(allergy)}
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition border {
              isChecked
                ? 'bg-red-50 border-red-300 text-red-700'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }"
          >
            {allergy} {isChecked ? '✓' : '+'}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Botón Guardar -->
  <button
    onclick={handleSave}
    class="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition shadow-md flex items-center justify-center gap-2 text-sm"
  >
    {#if savedNotification}
      <Check class="w-4 h-4" />
      <span>¡Perfil y Meta Calórica Guardados!</span>
    {:else}
      <span>Guardar Perfil y Ajustar Metas</span>
    {/if}
  </button>

  <!-- Zona de Peligro / Reset -->
  <div class="pt-4 border-t border-gray-200 text-center">
    <button
      onclick={handleReset}
      class="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-semibold transition"
    >
      <Trash2 class="w-3.5 h-3.5" />
      <span>Borrar todos mis datos y reiniciar aplicación</span>
    </button>
  </div>
</div>
