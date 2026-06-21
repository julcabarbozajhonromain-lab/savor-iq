<script lang="ts">
  import { ChefHat, Salad, CalendarDays } from 'lucide-svelte';
  import { page } from '$app/stores';
</script>

<nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
  <div class="max-w-lg mx-auto flex justify-around items-center h-16">
    <a
      href="/chef"
      class="flex flex-col items-center justify-center flex-1 h-full transition-colors {
        $page.url.pathname === '/chef'
          ? 'text-orange-600'
          : 'text-gray-400 hover:text-gray-600'
      }"
    >
      <ChefHat class="w-6 h-6" />
      <span class="text-xs font-medium mt-1">Chef</span>
    </a>

    <a
      href="/nutri"
      class="flex flex-col items-center justify-center flex-1 h-full transition-colors {
        $page.url.pathname === '/nutri'
          ? 'text-teal-600'
          : 'text-gray-400 hover:text-gray-600'
      }"
    >
      <Salad class="w-6 h-6" />
      <span class="text-xs font-medium mt-1">Nutri</span>
    </a>

    <a
      href="/plan"
      class="flex flex-col items-center justify-center flex-1 h-full transition-colors {
        $page.url.pathname === '/plan'
          ? 'text-slate-800'
          : 'text-gray-400 hover:text-gray-600'
      }"
    >
      <CalendarDays class="w-6 h-6" />
      <span class="text-xs font-medium mt-1">Plan</span>
    </a>
  </div>
</nav>