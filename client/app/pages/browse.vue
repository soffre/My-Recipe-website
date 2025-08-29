<script setup lang="ts">
import { ref, reactive, computed } from "vue";

// State
const searchQuery = ref("");
const sortBy = ref("newest");
const mobileFiltersOpen = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(6);
const creatorSearch = ref("");
const ingredientSearch = ref("");

const filters = reactive({
    categories: [] as string[],
    ingredients: [] as string[],
    prepTime: [0, 120],
    creators: [] as string[],
    minRating: 0,
});

// Recipes data (mock for now)
const recipes = ref([
    {
        id: 1,
        title: "Avocado Toast with Poached Eggs",
        creator: "Chef Maria",
        creatorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80",
        prepTime: 15,
        image: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1364&q=80",
        likes: 245,
        rating: 4.8,
        bookmarks: 120,
        category: "Breakfast",
        ingredients: ["avocado", "bread", "eggs"]
    },
    {
        id: 2,
        title: "Creamy Mushroom Pasta",
        creator: "Chef John",
        creatorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80",
        prepTime: 25,
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80",
        likes: 312,
        rating: 4.6,
        bookmarks: 98,
        category: "Dinner",
        ingredients: ["pasta", "mushrooms", "cream"]
    },
    {
        id: 3,
        title: "Chocolate Chip Cookies",
        creator: "Baker Sarah",
        creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1364&q=80",
        prepTime: 35,
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1364&q=80",
        likes: 487,
        rating: 4.9,
        bookmarks: 210,
        category: "Dessert",
        ingredients: ["chocolate", "flour", "butter"]
    },
    {
        id: 4,
        title: "Greek Salad Bowl",
        creator: "Chef Alex",
        creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80",
        prepTime: 20,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1360&q=80",
        likes: 178,
        rating: 4.5,
        bookmarks: 85,
        category: "Lunch",
        ingredients: ["tomato", "cucumber", "feta"]
    },
    {
        id: 5,
        title: "Berry Smoothie Bowl",
        creator: "Nutritionist Lisa",
        creatorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1288&q=80",
        prepTime: 10,
        image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1370&q=80",
        likes: 321,
        rating: 4.7,
        bookmarks: 142,
        category: "Breakfast",
        ingredients: ["berries", "yogurt", "granola"]
    },
    {
        id: 6,
        title: "Grilled Salmon with Asparagus",
        creator: "Chef Michael",
        creatorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80",
        prepTime: 30,
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1370&q=80",
        likes: 412,
        rating: 4.8,
        bookmarks: 187,
        category: "Dinner",
        ingredients: ["salmon", "asparagus", "lemon"]
    },
    {
        id: 7,
        title: "Veggie Stir Fry",
        creator: "Chef Maria",
        creatorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80",
        prepTime: 20,
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80",
        likes: 198,
        rating: 4.3,
        bookmarks: 76,
        category: "Lunch",
        ingredients: ["broccoli", "carrots", "bell peppers"]
    },
    {
        id: 8,
        title: "Classic Beef Burger",
        creator: "Chef John",
        creatorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80",
        prepTime: 25,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1590&q=80",
        likes: 356,
        rating: 4.7,
        bookmarks: 132,
        category: "Dinner",
        ingredients: ["beef", "buns", "cheese"]
    },
    {
        id: 9,
        title: "Banana Pancakes",
        creator: "Baker Sarah",
        creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=c crop&w=1364&q=80",
        prepTime: 15,
        image: "https://images.unsplash.com/photo-1598214886806-c87b84b7078b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1625&q=80",
        likes: 278,
        rating: 4.6,
        bookmarks: 94,
        category: "Breakfast",
        ingredients: ["banana", "flour", "milk"]
    }
]);

// Categories & ingredients
const categories = ref([
    "Breakfast", "Lunch", "Dinner", "Dessert", "Snacks", "Vegetarian", "Vegan",
]);

// Extract all unique ingredients from recipes
const allIngredients = computed(() => {
    const ingredientsSet = new Set<string>();
    recipes.value.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
            ingredientsSet.add(ingredient);
        });
    });
    return Array.from(ingredientsSet).sort();
});

const popularIngredients = ref([
    "Tomato", "Chicken", "Pasta", "Cheese", "Chocolate", "Avocado", "Lemon", "Garlic",
    "Berries", "Salmon", "Eggs", "Mushrooms", "Beef", "Banana", "Yogurt"
]);

const creators = ref([
    "Chef Maria", "Chef John", "Baker Sarah", "Chef Alex", "Nutritionist Lisa", "Chef Michael"
]);

// Filtered creators based on search
const filteredCreators = computed(() => {
    if (!creatorSearch.value) return creators.value;
    return creators.value.filter(creator =>
        creator.toLowerCase().includes(creatorSearch.value.toLowerCase())
    );
});

// Filtered ingredients based on search
const filteredIngredients = computed(() => {
    if (!ingredientSearch.value) return allIngredients.value;
    return allIngredients.value.filter(ingredient =>
        ingredient.toLowerCase().includes(ingredientSearch.value.toLowerCase())
    );
});

// Trending recipes
const trendingRecipes = computed(() =>
    [...recipes.value].sort((a, b) => b.likes - a.likes).slice(0, 3)
);

// Filtered recipes
const filteredRecipes = computed(() => {
    let result = recipes.value;

    // Search
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(
            (recipe) =>
                recipe.title.toLowerCase().includes(query) ||
                recipe.ingredients.some((ing) => ing.toLowerCase().includes(query))
        );
    }

    // Categories
    if (filters.categories.length > 0) {
        result = result.filter((recipe) =>
            filters.categories.includes(recipe.category)
        );
    }

    // Prep time
    result = result.filter(
        (recipe) =>
            Array.isArray(filters.prepTime) &&
            filters.prepTime !== undefined &&
            filters.prepTime.length === 2 &&
            typeof filters.prepTime[0] === "number" &&
            typeof filters.prepTime[1] === "number" &&
            recipe.prepTime >= filters.prepTime[0] &&
            recipe.prepTime <= filters.prepTime[1]
    );

    // Rating
    if (filters.minRating > 0) {
        result = result.filter((recipe) => recipe.rating >= filters.minRating);
    }

    // Creators
    if (filters.creators.length > 0) {
        result = result.filter((recipe) =>
            filters.creators.includes(recipe.creator)
        );
    }

    // Ingredients
    if (filters.ingredients.length > 0) {
        result = result.filter((recipe) =>
            filters.ingredients.some(ingredient =>
                recipe.ingredients.includes(ingredient.toLowerCase())
            )
        );
    }

    // Sorting
    switch (sortBy.value) {
        case "newest":
            result = [...result].sort((a, b) => b.id - a.id);
            break;
        case "liked":
            result = [...result].sort((a, b) => b.likes - a.likes);
            break;
        case "rated":
            result = [...result].sort((a, b) => b.rating - a.rating);
            break;
        case "prepTime":
            result = [...result].sort((a, b) => a.prepTime - b.prepTime);
            break;
    }

    return result;
});

// Paginated recipes
const paginatedRecipes = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredRecipes.value.slice(start, end);
});

const totalPages = computed(() =>
    Math.ceil(filteredRecipes.value.length / itemsPerPage.value)
);

// Toggle category filter
const toggleCategory = (category: string) => {
    const index = filters.categories.indexOf(category);
    if (index > -1) {
        filters.categories.splice(index, 1);
    } else {
        filters.categories.push(category);
    }
};

// Toggle creator filter
const toggleCreator = (creator: string) => {
    const index = filters.creators.indexOf(creator);
    if (index > -1) {
        filters.creators.splice(index, 1);
    } else {
        filters.creators.push(creator);
    }
};

// Toggle ingredient filter
const toggleIngredient = (ingredient: string) => {
    const index = filters.ingredients.indexOf(ingredient);
    if (index > -1) {
        filters.ingredients.splice(index, 1);
    } else {
        filters.ingredients.push(ingredient);
    }
};

// Helpers
const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// Reset filters
const resetFilters = () => {
    filters.categories = [];
    filters.ingredients = [];
    filters.prepTime = [0, 120];
    filters.creators = [];
    filters.minRating = 0;
    creatorSearch.value = "";
    ingredientSearch.value = "";
};
</script>

<template>
    <div class="min-h-screen bg-background">
        <!-- Header -->
        <!-- <header class="bg-white shadow-sm sticky top-0 z-10">
            <div class="container py-4">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h1 class="text-2xl font-heading">Recipe Explorer</h1>

                    <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div class="relative flex-1">
                            <input type="text" placeholder="Search recipes or ingredients..." v-model="searchQuery"
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>

                        <select v-model="sortBy"
                            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            <option value="newest">Newest</option>
                            <option value="liked">Most Liked</option>
                            <option value="rated">Highest Rated</option>
                            <option value="prepTime">Shortest Prep Time</option>
                        </select>
                    </div>
                </div>
            </div>
        </header> -->

        <main class="container py-8">
            <!-- Trending Recipes Section -->
            <section class="mb-12">
                <h2 class="text-2xl mb-6">Trending Recipes 🔥</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div v-for="recipe in trendingRecipes" :key="'trending-' + recipe.id"
                        class="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
                        <img :src="recipe.image" :alt="recipe.title" class="w-full h-48 object-cover">
                        <div class="p-4">
                            <h3 class="text-lg font-semibold mb-2">{{ recipe.title }}</h3>
                            <div class="flex items-center justify-between text-sm text-gray-600">
                                <span>By {{ recipe.creator }}</span>
                                <span>⏱ {{ formatTime(recipe.prepTime) }}</span>
                            </div>
                            <div class="mt-3 flex items-center justify-between">
                                <span class="flex items-center">
                                    <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                                        </path>
                                    </svg>
                                    {{ recipe.rating }}
                                </span>
                                <span class="text-primary font-medium">{{ recipe.likes }} likes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Sidebar Filters -->
                <aside class="lg:w-1/4">
                    <!-- Mobile filter toggle -->
                    <button @click="mobileFiltersOpen = !mobileFiltersOpen"
                        class="lg:hidden w-full mb-4 flex items-center justify-center gap-2 btn btn-primary">
                        <span>{{ mobileFiltersOpen ? 'Hide' : 'Show' }} Filters</span>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z">
                            </path>
                        </svg>
                    </button>

                    <div :class="['bg-white rounded-xl shadow p-6', mobileFiltersOpen ? 'block' : 'hidden lg:block']">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-xl font-heading">Filters</h2>
                            <button @click="resetFilters" class="text-sm text-primary hover:text-accent">Reset
                                All</button>
                        </div>

                        <!-- Categories -->
                        <div class="mb-6">
                            <h3 class="font-semibold mb-3">Categories</h3>
                            <div class="space-y-2">
                                <div v-for="category in categories" :key="category" class="flex items-center">
                                    <input :id="'category-' + category" type="checkbox" :value="category"
                                        v-model="filters.categories"
                                        class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded">
                                    <label :for="'category-' + category" class="ml-2 text-gray-700">{{ category }}</label>
                                </div>
                            </div>
                        </div>

                        <!-- Ingredients -->
                        <div class="mb-6">
                            <h3 class="font-semibold mb-3">Ingredients</h3>
                            <div class="relative mb-2">
                                <input type="text" placeholder="Search ingredients..." v-model="ingredientSearch"
                                    class="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                <svg class="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <div class="max-h-40 overflow-y-auto space-y-2">
                                <div v-for="ingredient in filteredIngredients" :key="ingredient"
                                    class="flex items-center">
                                    <input :id="'ingredient-' + ingredient" type="checkbox" :value="ingredient"
                                        v-model="filters.ingredients"
                                        class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded">
                                    <label :for="'ingredient-' + ingredient" class="ml-2 text-gray-700 capitalize">{{
                                        ingredient }}</label>
                                </div>
                            </div>
                        </div>

                        <!-- Prep Time -->
                        <div class="mb-6">
                            <h3 class="font-semibold mb-3">Prep Time (minutes)</h3>
                            <div class="px-2">
                                <input type="range" min="0" max="120" step="5" v-model="filters.prepTime[1]"
                                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                                <div class="flex justify-between text-sm text-gray-600 mt-1">
                                    <span>0 min</span>
                                    <span>Up to {{ filters.prepTime[1] }} min</span>
                                </div>
                            </div>
                        </div>

                        <!-- Creators -->
                        <div class="mb-6">
                            <h3 class="font-semibold mb-3">Creators</h3>
                            <div class="relative mb-2">
                                <input type="text" placeholder="Search creators..." v-model="creatorSearch"
                                    class="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                <svg class="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <div class="max-h-40 overflow-y-auto space-y-2">
                                <div v-for="creator in filteredCreators" :key="creator" class="flex items-center">
                                    <input :id="'creator-' + creator" type="checkbox" :value="creator"
                                        v-model="filters.creators"
                                        class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded">
                                    <label :for="'creator-' + creator" class="ml-2 text-gray-700">{{ creator }}</label>
                                </div>
                            </div>
                        </div>

                        <!-- Rating -->
                        <div class="mb-6">
                            <h3 class="font-semibold mb-3">Minimum Rating</h3>
                            <div class="flex space-x-2">
                                <button v-for="rating in [0, 2, 4, 6, 8]" :key="rating"
                                    @click="filters.minRating = rating / 2"
                                    :class="['px-3 py-1 rounded-full text-sm', filters.minRating === rating / 2 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800']">
                                    {{ rating / 2 > 0 ? `${rating / 2}+` : 'Any' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                <!-- Main Content -->
                <div class="lg:w-3/4">
                    <!-- Ingredient Cloud -->
                    <div class="mb-8 bg-white rounded-xl shadow p-6">
                        <h2 class="text-xl font-heading mb-4">Browse by Ingredient</h2>
                        <div class="flex flex-wrap gap-3">
                            <span v-for="ingredient in popularIngredients" :key="'ing-' + ingredient"
                                @click="toggleIngredient(ingredient.toLowerCase())"
                                :class="['px-4 py-2 rounded-full transition-colors cursor-pointer', filters.ingredients.includes(ingredient.toLowerCase()) ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200']">
                                {{ ingredient }}
                            </span>
                        </div>
                    </div>

                    <!-- Recipe Grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div v-for="recipe in paginatedRecipes" :key="recipe.id"
                            class="bg-white rounded-xl shadow-md overflow-hidden group relative">
                            <img :src="recipe.image" :alt="recipe.title" class="w-full h-48 object-cover">

                            <div class="p-4">
                                <h3 class="text-lg font-semibold mb-2">{{ recipe.title }}</h3>
                                <div class="flex items-center mb-3">
                                    <img :src="recipe.creatorAvatar" :alt="recipe.creator"
                                        class="w-6 h-6 rounded-full mr-2">
                                    <span class="text-sm text-gray-600">{{ recipe.creator }}</span>
                                </div>
                                <div class="flex items-center justify-between text-sm text-gray-600 mb-3">
                                    <span class="flex items-center">
                                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                clip-rule="evenodd"></path>
                                        </svg>
                                        {{ formatTime(recipe.prepTime) }}
                                    </span>
                                    <span class="flex items-center">
                                        <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor"
                                            viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                                            </path>
                                        </svg>
                                        {{ recipe.rating }}
                                    </span>
                                </div>
                            </div>

                            <!-- Hover Actions -->
                            <div
                                class="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div class="flex gap-3">
                                    <button class="btn btn-primary">View Recipe</button>
                                    <button class="p-2 bg-white rounded-full text-red-500 hover:bg-red-50">
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M4.318 6.318a4.5 4.5 极速4.5 0 000 6.364L12 20.364l7.682-7.682a4 4 0 00-6.364-6.364L12 7.636l-1.318-1.318a4 4 0 00-6.364 0z">
                                            </path>
                                        </svg>
                                    </button>
                                    <button class="p-2 bg-white rounded-full text-blue-500 hover:bg-blue-50">
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="极速0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- No results message -->
                    <div v-if="filteredRecipes.length === 0" class="text-center py-12">
                        <svg class="w-16 h-极速 mx-auto text-gray-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9.172 16.172a4 4 0 015.656 0M9 极速0h.01M15 10h.01M21 12a9 9 0 11-18 极速0 9 9 0 0118 0z">
                            </path>
                        </svg>
                        <h3 class="mt-4 text-xl font-semib极速 text-gray-700">No recipes found</h3>
                        <p class="mt-2 text-gray-500">Try adjusting your filters or search terms</p>
                    </div>

                    <!-- Pagination -->
                    <div v-if="totalPages > 1" class="mt-8 flex justify-center">
                        <nav class="flex items-center gap-2">
                            <button @click="currentPage = currentPage - 1" :disabled="currentPage === 1"
                                class="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Previous
                            </button>
                            <button v-for="page in totalPages" :key="page" @click="currentPage = page"
                                :class="['px-3 py-1 rounded border', currentPage === page ? 'border-primary bg-primary text-white' : 'border-gray极速300 bg-white text-gray-700 hover:bg-gray-50']">
                                {{ page }}
                            </button>
                            <button @click="currentPage = currentPage + 1" :disabled="currentPage === totalPages"
                                class="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Next
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>