<template>
	<nav class="bg-white shadow-md fixed w-full z-50">
		<div class="container mx-auto flex justify-between items-center px-4 py-3">
			<!-- Logo -->
			<NuxtLink
				to="/"
				class="text-2xl font-bold text-green-600"
			>
				🍴 Foodie
			</NuxtLink>

			<!-- Links (Desktop) -->
			<div class="hidden md:flex items-center space-x-6">
				<NuxtLink
					to="/"
					class="hover:text-green-600"
				>Home</NuxtLink>

				<!-- Categories Dropdown -->
				<div class="relative group">
					<button class="hover:text-green-600">
						Categories
					</button>
					<div class="absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-2 w-48">
						<NuxtLink
							v-for="cat in categories"
							:key="cat.id"
							:to="`/categories/${cat.slug}`"
							class="block px-4 py-2 hover:bg-green-50"
						>
							{{ cat.name }}
						</NuxtLink>
					</div>
				</div>

				<NuxtLink
					to="/browse"
					class="hover:text-green-600"
				>Browse</NuxtLink>
			</div>

			<!-- Search -->
			<div class="hidden md:block">
				<input
					v-model="search"
					type="text"
					placeholder="Search recipes..."
					class="px-3 py-1 rounded-lg border focus:ring-2 focus:ring-green-500"
					@keyup.enter="goSearch"
				>
			</div>

			<!-- Auth Section -->
			<div class="flex items-center space-x-3">
				<template v-if="!isAuthenticated">
					<NuxtLink
						to="/login"
						class="px-3 py-1 rounded-lg hover:bg-green-100"
					>
						Login
					</NuxtLink>
					<NuxtLink
						to="/signup"
						class="px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700"
					>
						Signup
					</NuxtLink>
				</template>

				<template v-else>
					<div class="relative group">
						<button class="flex items-center space-x-2 hover:text-green-600">
							<img
								:src="user.avatar || '/default-avatar.png'"
								alt="profile"
								class="w-8 h-8 rounded-full border"
							>
							<span>{{ user.username }}</span>
						</button>
						<div
							class="absolute right-0 hidden group-hover:block bg-white shadow-lg rounded-md mt-2 w-48"
						>
							<NuxtLink
								to="/my-recipes"
								class="block px-4 py-2 hover:bg-green-50"
							>
								My Recipes
							</NuxtLink>
							<NuxtLink
								to="/bookmarks"
								class="block px-4 py-2 hover:bg-green-50"
							>
								Bookmarks
							</NuxtLink>
							<NuxtLink
								to="/likes"
								class="block px-4 py-2 hover:bg-green-50"
							>
								Liked Recipes
							</NuxtLink>
							<button
								class="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
								@click="logout"
							>
								Logout
							</button>
						</div>
					</div>
				</template>
			</div>

			<!-- Mobile Menu Button -->
			<button
				class="md:hidden text-2xl focus:outline-none"
				@click="isOpen = !isOpen"
			>
				☰
			</button>
		</div>

		<!-- Mobile Menu -->
		<div
			v-if="isOpen"
			class="md:hidden bg-white border-t shadow-lg"
		>
			<NuxtLink
				to="/"
				class="block px-4 py-2 hover:bg-green-50"
			>Home</NuxtLink>
			<NuxtLink
				to="/browse"
				class="block px-4 py-2 hover:bg-green-50"
			>Browse</NuxtLink>
			<NuxtLink
				v-for="cat in categories"
				:key="cat.id"
				:to="`/categories/${cat.slug}`"
				class="block px-4 py-2 hover:bg-green-50"
			>
				{{ cat.name }}
			</NuxtLink>
			<div
				v-if="!isAuthenticated"
				class="border-t mt-2"
			>
				<NuxtLink
					to="/login"
					class="block px-4 py-2 hover:bg-green-50"
				>Login</NuxtLink>
				<NuxtLink
					to="/signup"
					class="block px-4 py-2 hover:bg-green-50"
				>Signup</NuxtLink>
			</div>
		</div>
	</nav>
</template>

<script setup>
import { ref } from "vue";

const isOpen = ref(false);
const search = ref("");

// Fake auth state (replace with Vue Apollo / Pinia / Hasura JWT auth)
const isAuthenticated = ref(true);
const user = ref({
	username: "Amanuel",
	avatar: null,
});

// Example categories (fetch from Hasura later)
const categories = ref([
	{ id: 1, name: "Breakfast", slug: "breakfast" },
	{ id: 2, name: "Lunch", slug: "lunch" },
	{ id: 3, name: "Desserts", slug: "desserts" },
	{ id: 4, name: "Breakfast", slug: "breakfast" },
	{ id: 5, name: "Lunch", slug: "lunch" },
	{ id: 6, name: "Desserts", slug: "desserts" },
	{ id: 7, name: "Breakfast", slug: "breakfast" },
	{ id: 8, name: "Lunch", slug: "lunch" },
	{ id: 9, name: "Desserts", slug: "desserts" },
	{ id: 10, name: "Breakfast", slug: "breakfast" },
	{ id: 12, name: "Lunch", slug: "lunch" },
	{ id: 13, name: "Desserts", slug: "desserts" },
	{ id: 14, name: "Breakfast", slug: "breakfast" },
	{ id: 15, name: "Lunch", slug: "lunch" },
	{ id: 16, name: "Desserts", slug: "desserts" },
]);

const goSearch = () => {
	if (search.value) {
		navigateTo(`/search?query=${search.value}`);
	}
};

const logout = () => {
	console.log("Logging out...");
	// TODO: clear JWT + redirect
};
</script>
