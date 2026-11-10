<script lang="ts">
  import {
    Camera,
    Utensils,
    Loader2,
    ChefHat,
    X,
    Clock,
    Copy,
    Check,
    Sparkles,
    Bookmark,
    Trash2
  } from 'lucide-svelte';
  import { compressAndConvertToBase64 } from '$lib/utils/image-compression';
  import { userData } from '$lib/state/user-storage.svelte';
  import type { Recipe } from '$lib/types/ai-schemas';

  let activeTab: 'generator' | 'favorites' = $state('generator');
  let ingredients = $state('');
  let selectedTags: string[] = $state([]);
  let imagePreview: string | null = $state(null);
  let selectedFile: File | null = $state(null);
  let useCamera = $state(false);
  let isLoading = $state(false);
  let statusMessage = $state('');
  let recipes: Recipe[] = $state([]);
  let error: string | null = $state(null);
  let copiedIndex: number | null = $state(null);

  const availableTags = [
    '⚡ < 20 min',
    '🥗 Fit / Bajo en grasa',
    '💪 Alto en proteína',
    '💨 Air Fryer',
    '🍳 Sartén fácil',
    '🌱 Vegetariano'
  ];

  function toggleTag(tag: string) {
    if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter((t) => t !== tag);
    } else {
      selectedTags = [...selectedTags, tag];
    }
  }

  function handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      selectedFile = file;
      imagePreview = URL.createObjectURL(file);
      error = null;
    }
  }

  function toggleInputMethod(method: 'camera' | 'text') {
    useCamera = method === 'camera';
    ingredients = '';
    imagePreview = null;
    selectedFile = null;
    recipes = [];
    error = null;
  }

  async function generateRecipes() {
    if (!ingredients.trim() && !selectedFile && !imagePreview) {
      error = 'Por favor ingresa algunos ingredientes o sube una foto de tu despensa/nevera.';
      return;
    }

    isLoading = true;
    error = null;
    recipes = [];

    try {
      let imageData: string | null = null;

      if (selectedFile) {
        statusMessage = 'Optimizando foto de ingredientes...';
        imageData = await compressAndConvertToBase64(selectedFile);
      }

      statusMessage = 'El Chef IA está diseñando tus recetas...';

      let promptParts: string[] = [];
      if (ingredients.trim()) promptParts.push(`Ingredientes: ${ingredients.trim()}`);
      if (selectedTags.length > 0) promptParts.push(`Preferencias de cocina: ${selectedTags.join(', ')}`);
      if (userData.profile.allergies.length > 0) {
        promptParts.push(`Alergias estrictas a evitar: ${userData.profile.allergies.join(', ')}`);
      }
      if (userData.profile.dietPreference && userData.profile.dietPreference !== 'Equilibrada') {
        promptParts.push(`Estilo de dieta: ${userData.profile.dietPreference}`);
      }
      const fullPrompt = promptParts.join('. ');

      const response = await fetch('/api/generate-recipes-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: fullPrompt || undefined,
          image: imageData || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al generar recetas');
      }

      recipes = data.recipes || [];
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error desconocido al generar recetas';
    } finally {
      isLoading = false;
      statusMessage = '';
    }
  }

  async function copyRecipe(recipe: Recipe, index: number) {
    const text = `🍳 Receta Savor IQ: ${recipe.name}
⏱️ Tiempo: ${recipe.prepTime || '20 min'}

📋 Ingredientes:
${recipe.ingredients.map((i) => `• ${i}`).join('\n')}

👨‍🍳 Preparación:
${recipe.instructions.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}

${recipe.missingIngredients && recipe.missingIngredients.length > 0 ? `💡 Ingredientes adicionales opcionales: ${recipe.missingIngredients.join(', ')}` : ''}`;

    try {
      await navigator.clipboard.writeText(text);
      copiedIndex = index;
      setTimeout(() => {
        if (copiedIndex === index) copiedIndex = null;
      }, 2500);
    } catch {
      alert('No se pudo copiar al portapapeles');
    }
  }

  function toggleSave(recipe: Recipe) {
    userData.saveRecipe(recipe);
  }

  function resetForm() {
    ingredients = '';
    imagePreview = null;
    selectedFile = null;
    useCamera = false;
    recipes = [];
    error = null;
    isLoading = false;
  }
</script>

<div class="space-y-6">
  <div class="text-center">
    <h2 class="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
      <ChefHat class="w-7 h-7 text-orange-500" />
      Módulo Chef
    </h2>
    <p class="text-gray-500 text-sm mt-1">Crea recetas con lo que tienes en tu nevera</p>
  </div>

  <!-- Pestañas de Vista: Generador vs Mis Recetas -->
  <div class="flex bg-gray-100 p-1 rounded-xl">
    <button
      onclick={() => (activeTab = 'generator')}
      class="flex-1 py-2 text-xs font-bold rounded-lg transition-all {
        activeTab === 'generator'
          ? 'bg-white text-orange-600 shadow-xs'
          : 'text-gray-500 hover:text-gray-700'
      }"
    >
      🍳 Diseñar Recetas
    </button>
    <button
      onclick={() => (activeTab = 'favorites')}
      class="flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 {
        activeTab === 'favorites'
          ? 'bg-white text-orange-600 shadow-xs'
          : 'text-gray-500 hover:text-gray-700'
      }"
    >
      <Bookmark class="w-3.5 h-3.5" />
      <span>Mis Recetas ({userData.savedRecipes.length})</span>
    </button>
  </div>

  {#if activeTab === 'favorites'}
    <!-- Vista de Favoritos Guardados -->
    <div class="space-y-4">
      {#if userData.savedRecipes.length === 0}
        <div class="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm space-y-3">
          <Bookmark class="w-12 h-12 text-gray-300 mx-auto" />
          <h3 class="text-base font-bold text-gray-700">Aún no tienes recetas guardadas</h3>
          <p class="text-xs text-gray-400 max-w-xs mx-auto">
            Cuando la IA genere recetas que te gusten, presiona el icono de marcador para guardarlas aquí.
          </p>
          <button
            onclick={() => (activeTab = 'generator')}
            class="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition"
          >
            Crear mi primera receta
          </button>
        </div>
      {:else}
        {#each userData.savedRecipes as recipe, index}
          <div class="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 space-y-3">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h4 class="font-bold text-gray-900 text-base">{recipe.name}</h4>
                {#if recipe.prepTime}
                  <p class="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Clock class="w-3.5 h-3.5 text-orange-500" />
                    <span>{recipe.prepTime}</span>
                  </p>
                {/if}
              </div>

              <div class="flex items-center gap-1.5">
                <button
                  onclick={() => copyRecipe(recipe, index)}
                  class="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                  title="Copiar"
                >
                  {#if copiedIndex === index}
                    <Check class="w-4 h-4 text-green-600" />
                  {:else}
                    <Copy class="w-4 h-4" />
                  {/if}
                </button>
                <button
                  onclick={() => userData.removeRecipe(recipe.id)}
                  class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Eliminar de favoritos"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Ingredientes:</p>
              <ul class="list-disc list-inside text-xs text-gray-700 space-y-0.5">
                {#each recipe.ingredients as ing}
                  <li>{ing}</li>
                {/each}
              </ul>
            </div>

            <div>
              <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Instrucciones:</p>
              <ol class="list-decimal list-inside text-xs text-gray-700 space-y-1">
                {#each recipe.instructions as step}
                  <li class="leading-relaxed">{step.replace(/^(?:paso\s*)?\d+[\.\)\-\:\s]+/i, '')}</li>
                {/each}
              </ol>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  {:else if recipes.length === 0}
    <!-- Formulario de Entrada -->
    <div class="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <!-- Selector de método -->
      <div class="flex gap-3">
        <button
          onclick={() => toggleInputMethod('text')}
          class="flex-1 px-4 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 {
            !useCamera
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }"
        >
          <Utensils class="w-5 h-5" />
          Escribir
        </button>
        <button
          onclick={() => toggleInputMethod('camera')}
          class="flex-1 px-4 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 {
            useCamera
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }"
        >
          <Camera class="w-5 h-5" />
          Tomar foto
        </button>
      </div>

      <!-- Input de texto -->
      {#if !useCamera}
        <div>
          <label for="chef-ingredients" class="block text-sm font-medium text-gray-700 mb-2">
            ¿Qué ingredientes tienes a mano?
          </label>
          <textarea
            id="chef-ingredients"
            bind:value={ingredients}
            placeholder="Ej: huevos, tomate, queso, pan, atún, cebolla..."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm"
            rows="4"
          ></textarea>
        </div>
      {:else}
        <!-- Input de cámara -->
        <div>
          <span class="block text-sm font-medium text-gray-700 mb-2">
            Foto de tus ingredientes o nevera
          </span>

          {#if !imagePreview}
            <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50/50">
              <Camera class="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p class="text-sm text-gray-600 mb-3">Toma una foto o selecciona una imagen</p>
              <label class="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition cursor-pointer shadow-sm text-sm font-semibold">
                <Camera class="w-4 h-4" />
                <span>Abrir cámara / Galería</span>
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
            <div class="relative rounded-xl overflow-hidden shadow-sm">
              <img
                src={imagePreview}
                alt="Ingredientes seleccionados"
                class="w-full h-64 object-cover"
              />
              <button
                onclick={() => {
                  imagePreview = null;
                  selectedFile = null;
                }}
                class="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white text-gray-700 transition"
                title="Cambiar foto"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Filtros Rápidos de Cocina -->
      <div class="space-y-1.5 pt-1">
        <span class="block text-xs font-bold uppercase tracking-wider text-gray-400">
          Preferencias de preparación:
        </span>
        <div class="flex flex-wrap gap-1.5">
          {#each availableTags as tag}
            {@const active = selectedTags.includes(tag)}
            <button
              type="button"
              onclick={() => toggleTag(tag)}
              class="px-2.5 py-1 rounded-lg text-xs font-semibold transition border {
                active
                  ? 'bg-orange-50 border-orange-400 text-orange-700 shadow-xs'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }"
            >
              {tag} {active ? '✓' : '+'}
            </button>
          {/each}
        </div>
      </div>

      {#if userData.profile.allergies.length > 0}
        <div class="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50/80 px-3 py-1.5 rounded-lg border border-amber-200">
          <span>🛡️ Perfil activo: Evitando <strong>{userData.profile.allergies.join(', ')}</strong></span>
        </div>
      {/if}

      <!-- Botón generar -->
      <button
        onclick={generateRecipes}
        disabled={isLoading}
        class="w-full px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {#if isLoading}
          <Loader2 class="w-5 h-5 animate-spin" />
          <span>{statusMessage || 'Creando recetas con IA...'}</span>
        {:else}
          <Sparkles class="w-5 h-5" />
          <span>Generar recetas con IA</span>
        {/if}
      </button>

      {#if error}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      {/if}

      <div class="bg-orange-50/70 border border-orange-200 rounded-xl p-3.5 text-xs text-orange-900 leading-relaxed">
        <span class="font-bold">💡 Consejo:</span> No te preocupes por especias básicas como sal o pimienta; la IA las asumirá o te las sugerirá opcionalmente.
      </div>
    </div>
  {:else}
    <!-- Resultados de recetas -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
          <ChefHat class="w-6 h-6 text-orange-500" />
          Recetas sugeridas ({recipes.length})
        </h3>
        <button
          onclick={resetForm}
          class="px-3.5 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition text-xs font-semibold shadow-xs"
        >
          ← Nueva búsqueda
        </button>
      </div>

      {#each recipes as recipe, index}
        {@const isSaved = userData.isRecipeSaved(recipe.name)}
        <div class="bg-white rounded-2xl shadow-md p-6 space-y-4 border border-orange-50">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h4 class="text-lg font-bold text-gray-900">{recipe.name}</h4>
              {#if recipe.prepTime}
                <div class="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                  <Clock class="w-3.5 h-3.5 text-orange-500" />
                  <span>{recipe.prepTime}</span>
                </div>
              {/if}
            </div>

            <div class="flex items-center gap-1.5">
              <button
                onclick={() => toggleSave(recipe)}
                class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition {
                  isSaved
                    ? 'bg-amber-50 text-amber-600 border-amber-300'
                    : 'border-gray-200 text-gray-600 hover:text-amber-600 hover:border-amber-200'
                }"
                title={isSaved ? 'Guardada en favoritos' : 'Guardar en favoritos'}
              >
                <Bookmark class="w-3.5 h-3.5 {isSaved ? 'fill-amber-500 text-amber-500' : ''}" />
                <span>{isSaved ? 'Guardada' : 'Guardar'}</span>
              </button>

              <button
                onclick={() => copyRecipe(recipe, index)}
                class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-orange-300 text-xs text-gray-600 hover:text-orange-600 transition"
                title="Copiar receta"
              >
                {#if copiedIndex === index}
                  <Check class="w-3.5 h-3.5 text-green-600" />
                  <span class="text-green-600 font-semibold">Copiada</span>
                {:else}
                  <Copy class="w-3.5 h-3.5" />
                  <span>Copiar</span>
                {/if}
              </button>
            </div>
          </div>

          <div>
            <h5 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Ingredientes:</h5>
            <ul class="list-disc list-inside text-sm text-gray-700 space-y-1">
              {#each recipe.ingredients as ingredient}
                <li>{ingredient}</li>
              {/each}
            </ul>
          </div>

          <div>
            <h5 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Pasos de preparación:</h5>
            <ol class="list-decimal list-inside text-sm text-gray-700 space-y-2">
              {#each recipe.instructions as instruction}
                <li class="leading-relaxed">{instruction.replace(/^(?:paso\s*)?\d+[\.\)\-\:\s]+/i, '')}</li>
              {/each}
            </ol>
          </div>

          {#if recipe.missingIngredients && recipe.missingIngredients.length > 0}
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p class="text-xs text-amber-900 font-semibold mb-1">Toque extra sugerido:</p>
              <div class="flex flex-wrap gap-1.5">
                {#each recipe.missingIngredients as missing}
                  <span class="text-xs bg-white/80 border border-amber-200 px-2 py-0.5 rounded-md text-amber-800">
                    {missing}
                  </span>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      {/each}

      <button
        onclick={resetForm}
        class="w-full px-6 py-3.5 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition shadow-md"
      >
        📷 Crear más recetas
      </button>
    </div>
  {/if}
</div>
