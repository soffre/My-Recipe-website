<script setup lang="ts">
const categories = [
  { name: "Desserts", image: "/images/dessert.jpg" },
  { name: "Vegan", image: "/images/vegan.jpg" },
  { name: "Quick Meals", image: "/images/quick.jpg" },
]

const featuredRecipes = [
  { title: "Avocado Salad", image: "/images/avocado.jpg" },
  { title: "Chocolate Cake", image: "/images/cake.jpg" },
  { title: "Pasta Carbonara", image: "/images/pasta.jpg" },
]

const testimonials = [
  { name: "Sara T.", text: "Best recipe site I’ve ever used!", avatar: "/images/user1.jpg" },
  { name: "John D.", text: "I learned so much from the tutorials!", avatar: "/images/user2.jpg" },
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-green-600 text-white text-center py-20">
      <h1 class="text-5xl font-bold mb-4">Discover & Share Amazing Recipes</h1>
      <p class="text-lg mb-6">Cook, eat, and enjoy with our curated recipe collection</p>
      <NuxtLink to="/recipes" class="bg-yellow-400 text-black px-6 py-3 rounded-xl shadow-md hover:bg-yellow-500">
        Explore Recipes
      </NuxtLink>
    </section>

    <!-- Category Section -->
    <section class="py-16 bg-gray-50">
      <h2 class="text-3xl font-bold text-center text-green-700 mb-10">Browse by Category</h2>
      <div class="grid md:grid-cols-3 gap-8 px-6">
        <div v-for="cat in categories" :key="cat.name"
          class="rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition">
          <img :src="cat.image" class="w-full h-56 object-cover" />
          <h3 class="p-4 text-xl font-semibold text-center">{{ cat.name }}</h3>
        </div>
      </div>
    </section>

    <!-- Featured Recipes -->
    <section class="py-16 bg-white">
      <h2 class="text-3xl font-bold text-center text-green-700 mb-10">Featured Recipes</h2>
      <div class="grid md:grid-cols-3 gap-8 px-6">
        <div v-for="recipe in featuredRecipes" :key="recipe.title"
          class="rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition">
          <img :src="recipe.image" class="w-full h-56 object-cover" />
          <h3 class="p-4 text-lg font-semibold text-center">{{ recipe.title }}</h3>
        </div>
      </div>
    </section>

    <!-- Popular Recipes -->
    <section class="py-16 bg-gray-50">
      <h2 class="text-3xl font-bold text-center text-green-700 mb-10">Popular Recipes</h2>
      <div class="grid md:grid-cols-3 gap-8 px-6">
        <div v-for="recipe in featuredRecipes" :key="recipe.title"
          class="rounded-xl border hover:border-green-600 p-4 shadow-md">
          <img :src="recipe.image" class="rounded-lg mb-4" />
          <h3 class="text-xl font-semibold">{{ recipe.title }}</h3>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-16 bg-green-100">
      <h2 class="text-3xl font-bold text-center text-green-700 mb-10">What Our Users Say</h2>
      <div class="flex flex-col md:flex-row justify-center gap-6 px-6">
        <div v-for="t in testimonials" :key="t.name"
          class="bg-white p-6 rounded-2xl shadow-md w-full md:w-1/3">
          <img :src="t.avatar" class="w-16 h-16 rounded-full mx-auto mb-4" />
          <p class="italic text-gray-700 mb-4">"{{ t.text }}"</p>
          <h4 class="text-green-700 font-semibold text-center">{{ t.name }}</h4>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-green-700 text-white py-8 text-center">
      <p>© 2025 MyRecipe. All Rights Reserved.</p>
    </footer>
  </div>
</template>
