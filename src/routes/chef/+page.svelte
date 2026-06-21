<script lang="ts">
  import { Camera, Utensils, Loader2, ChefHat, X } from 'lucide-svelte';
  
  let ingredients = $state('');
  let imagePreview: string | null = $state(null);
  let useCamera = $state(false);
  let isLoading = $state(false);
  let recipes: any[] = $state([]);
  let error: string | null = $state(null);
  
  function handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      imagePreview = URL.createObjectURL(file);
      error = null;
    }
  }
  
  function toggleInputMethod(method: 'camera' | 'text') {
    useCamera = method === 'camera';
    ingredients = '';
    imagePreview = null;
    recipes = [];
    error = null;
  }
  
  async function generateRecipes() {
    if (!ingredients && !imagePreview) {
      error = 'Por favor ingresa ingredientes o toma una foto';
      return;
    }
    
    isLoading = true;
    error = null;
    recipes = [];
    
    try {
      let imageData: string | null = null;
      
      if (imagePreview) {
        const response = await fetch(imagePreview);
        const blob = await response.blob();
        imageData = await blobToBase64(blob);
      }
      
      const response = await fetch('/api/generate-recipes-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: ingredients || undefined,
          image: imageData || undefined
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al generar recetas');
      }
      
      recipes = data.recipes || [];
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error desconocido';
    } finally {
      isLoading = false;
    }
  }
  
  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  
  function resetForm() {
    ingredients = '';
    imagePreview = null;
    useCamera = false;
    recipes = [];
    error = null;
    isLoading = false;
  }
</script>

<div class="space-y-6">
  <div class="text-center">
    <h2 class="text-2xl font-bold text-gray-800">Módulo Chef</h2>
    <p class="text-gray-500 mt-1">Escribe tus ingredientes</p>
  </div>

  {#if recipes.length === 0}
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
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ¿Qué ingredientes tienes?
          </label>
          <textarea
            bind:value={ingredients}
            placeholder="Ej: huevos, tomate, queso, pan, leche..."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            rows="4"
          ></textarea>
        </div>
      {:else}
        <!-- Input de cámara -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Toma una foto de tus ingredientes
          </label>
          
          {#if !imagePreview}
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Camera class="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p class="text-sm text-gray-500 mb-3">Toma una foto o selecciona una imagen</p>
              <label class="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition cursor-pointer">
                <Camera class="w-5 h-5" />
                <span>Seleccionar imagen</span>
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
            <div class="relative">
              <img 
                src={imagePreview} 
                alt="Ingredientes" 
                class="w-full h-64 object-cover rounded-lg"
              />
              <button
                onclick={() => { imagePreview = null; ingredients = ''; }}
                class="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Botón generar -->
      <button
        onclick={generateRecipes}
        disabled={isLoading}
        class="w-full px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {#if isLoading}
          <Loader2 class="w-5 h-5 animate-spin" />
          Generando...
        {:else}
          <ChefHat class="w-5 h-5" />
          Generar recetas
        {/if}
      </button>

      {#if error}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      {/if}

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-sm text-blue-800">
          <span class="font-semibold">💡 Ejemplo:</span> "huevos, tomate, cebolla, pollo, arroz, leche, queso"
        </p>
      </div>
    </div>
  {:else}
    <!-- Resultados -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
          <ChefHat class="w-6 h-6 text-orange-500" />
          Recetas sugeridas
        </h3>
        <button
          onclick={resetForm}
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
        >
          ← Nueva búsqueda
        </button>
      </div>

      {#each recipes as recipe, index}
        <div class="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <div>
            <h4 class="text-lg font-bold text-gray-800">{recipe.name}</h4>
          </div>

          <div>
            <h5 class="font-semibold text-gray-700 mb-2">Ingredientes:</h5>
            <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
              {#each recipe.ingredients as ingredient}
                <li>{ingredient}</li>
              {/each}
            </ul>
          </div>

          <div>
            <h5 class="font-semibold text-gray-700 mb-2">Instrucciones:</h5>
            <ol class="list-decimal list-inside text-sm text-gray-600 space-y-2">
              {#each recipe.instructions as instruction}
                <li>{instruction}</li>
              {/each}
            </ol>
          </div>

          {#if recipe.missingIngredients && recipe.missingIngredients.length > 0}
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p class="text-sm text-yellow-800 font-semibold mb-1">Ingredientes adicionales sugeridos:</p>
              <ul class="list-disc list-inside text-sm text-yellow-700">
                {#each recipe.missingIngredients as ingredient}
                  <li>{ingredient}</li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
      {/each}

      <button
        onclick={resetForm}
        class="w-full px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
      >
        📷 Crear más recetas
      </button>
    </div>
  {/if}
</div>