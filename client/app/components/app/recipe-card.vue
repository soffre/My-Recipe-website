<template>
  <div class="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden group">
    <img :src="recipe.image" alt="" class="w-full h-40 object-cover group-hover:scale-105 transition" />

    <div class="p-4">
      <h3 class="font-semibold text-lg">{{ recipe.title }}</h3>
      <p class="text-sm text-gray-600">👩‍🍳 {{ recipe.creator }}</p>

      <div class="flex items-center justify-between mt-3 text-sm">
        <span class="bg-green-100 text-green-700 px-2 py-1 rounded-lg">⏱ {{ recipe.prepTime }}</span>
        <span>⭐ {{ recipe.rating }}</span>
      </div>

      <div class="flex items-center justify-between mt-2 text-sm text-gray-500">
        <span>❤️ {{ recipe.likes }}</span>
        <button class="px-3 py-1 bg-green-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition">
          View Recipe
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  recipe: {
    type: Object,
    required: true,
  },
})
</script>
