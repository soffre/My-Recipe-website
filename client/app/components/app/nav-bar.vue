<template>
	<nav class="sticky top-0 w-full z-50 transition-all duration-300 backdrop-blur-md"
		:class="isScrolled ? 'nav-scrolled' : 'nav-blur'">
		<div class="container mx-auto flex justify-between items-center px-4 py-3">
			<!-- Mobile Menu Button -->
			<!-- 1) Tag the toggle button and stop propagation -->
			<button
				class="md:hidden focus:outline-none transition-transform duration-300 relative z-50 w-8 h-8 flex flex-col justify-center items-center mobile-menu-toggle"
				@click.stop="toggleMobileMenu" :class="{ 'hamburger-active': isOpen }">
				<span class="hamburger-line block w-6 h-0.5 bg-gray-800 mb-1.5 transition-all"></span>
				<span class="hamburger-line block w-6 h-0.5 bg-gray-800 mb-1.5 transition-all"></span>
				<span class="hamburger-line block w-6 h-0.5 bg-gray-800 transition-all"></span>
			</button>

			<!-- (optional but nice) prevent clicks inside the panel from bubbling up -->
			<transition name="menu">
				<div v-if="isOpen"
					class="mobile-menu fixed top-0 right-0 w-64 h-full bg-white shadow-xl z-50 overflow-y-auto"
					@click.stop>
					<!-- ... -->
				</div>
			</transition>

			<!-- Logo -->
			<NuxtLink to="/" class="flex items-center space-x-2">
				<div
					class="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white logo-font text-lg">
					T
				</div>
				<span class="logo-font text-xl font-bold text-green-700">Tafach</span>
			</NuxtLink>

			<!-- Links (Desktop) -->
			<div class="hidden md:flex items-center space-x-6">
				<NuxtLink to="/" class="text-gray-700 hover:text-green-600 font-medium category-highlight">Home
				</NuxtLink>

				<!-- Categories Dropdown -->
				<div class="relative group">
					<button
						class="text-gray-700 hover:text-green-600 font-medium flex items-center space-x-1 category-highlight">
						<span>Categories</span>
						<i class="fas fa-chevron-down text-xs transition-transform group-hover:rotate-180"></i>
					</button>
					<div
						class="absolute hidden group-hover:block bg-white shadow-xl rounded-lg mt-3 w-56 p-2 z-50 border border-gray-100">
						<NuxtLink v-for="cat in categories" :key="cat.id" :to="`/categories/${cat.slug}`"
							class="flex items-center space-x-3 px-4 py-2 hover:bg-green-50 rounded-md transition-colors">
							<i class="fas text-green-600" :class="cat.icon"></i>
							<span class="text-gray-700">{{ cat.name }}</span>
						</NuxtLink>
					</div>
				</div>

				<NuxtLink to="/browse" class="text-gray-700 hover:text-green-600 font-medium category-highlight">Browse
				</NuxtLink>
			</div>

			<!-- Search (Desktop + Mobile Icon) -->
			<div class="hidden md:block relative w-64">
				<input v-model="searchQuery" type="text" placeholder="Search recipes..."
					class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
					@keyup.enter="goSearch" />
				<i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
			</div>
			<button class="md:hidden text-xl px-2 text-gray-700 hover:text-green-600 transition-colors"
				@click="toggleMobileSearch">
				<i class="fas fa-search"></i>
			</button>

			<!-- Auth Section -->
			<div class="flex items-center space-x-3">
				<template v-if="!isAuthenticated">
					<NuxtLink to="/login"
						class="hidden md:block px-4 py-2 rounded-full hover:bg-green-100 text-gray-700 font-medium transition-colors">
						Login
					</NuxtLink>
					<NuxtLink to="/signup"
						class="hidden md:block px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 font-medium transition-colors">
						Signup
					</NuxtLink>
				</template>

				<template v-else>
					<div class="relative user-dropdown">
						<button class="flex items-center space-x-2 hover:text-green-600 transition-colors"
							@click="toggleUserDropdown">
							<div
								class="avatar-ring w-9 h-9 rounded-full border-2 border-white overflow-hidden shadow-md">
								<img :src="user.avatar || '/default-avatar.png'" alt="profile"
									class="w-full h-full object-cover" />
							</div>
							<span class="hidden lg:block font-medium text-gray-700">{{ user.username }}</span>
							<i class="fas fa-chevron-down text-xs transition-transform"
								:class="{ 'rotate-180': showUserDropdown }"></i>
						</button>
						<transition name="dropdown">
							<div v-if="showUserDropdown"
								class="absolute right-0 bg-white shadow-xl rounded-lg mt-3 w-48 p-2 z-50 border border-gray-100">
								<NuxtLink to="/profile"
									class="flex items-center space-x-3 px-4 py-2 hover:bg-green-50 rounded-md transition-colors"
									@click="showUserDropdown = false">
									<i class="fas fa-user text-green-600"></i>
									<span class="text-gray-700">Profile</span>
								</NuxtLink>
								<NuxtLink to="/my-recipes"
									class="flex items-center space-x-3 px-4 py-2 hover:bg-green-50 rounded-md transition-colors"
									@click="showUserDropdown = false">
									<i class="fas fa-book text-green-600"></i>
									<span class="text-gray-700">My Recipes</span>
								</NuxtLink>
								<NuxtLink to="/bookmarks"
									class="flex items-center space-x-3 px-4 py-2 hover:bg-green-50 rounded-md transition-colors"
									@click="showUserDropdown = false">
									<i class="fas fa-bookmark text-green-600"></i>
									<span class="text-gray-700">Bookmarks</span>
								</NuxtLink>
								<div class="border-t my-1"></div>
								<button
									class="w-full text-left flex items-center space-x-3 px-4 py-2 hover:bg-red-50 rounded-md text-red-600 transition-colors"
									@click="logout">
									<i class="fas fa-sign-out-alt"></i>
									<span>Logout</span>
								</button>
							</div>
						</transition>
					</div>
				</template>
			</div>
		</div>

		<!-- Mobile Search Bar -->
		<transition name="search-bar">
			<div v-if="showMobileSearch" class="md:hidden px-4 py-3 bg-white/80 border-t">
				<div class="relative">
					<input v-model="searchQuery" type="text" placeholder="Search recipes..."
						class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
						@keyup.enter="goSearch" />
					<i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
				</div>
			</div>
		</transition>

		<!-- Backdrop for mobile menu -->
		<transition name="backdrop">
			<div v-if="isOpen" class="backdrop md:hidden" @click="closeMobileMenu"></div>
		</transition>

		<!-- Mobile Menu -->
		<transition name="menu">
			<div v-if="isOpen"
				class="mobile-menu fixed top-0 right-0 w-64 h-screen bg-white shadow-xl z-50 overflow-y-auto">
				<div class="px-5 pt-5 pb-14 border-b">
					<div class="flex items-center space-x-3 mb-6">
						<div
							class="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white logo-font text-lg">
							T
						</div>
						<span class="logo-font text-xl font-bold text-green-700">Tafach</span>
					</div>

					<!-- Main Links -->
					<NuxtLink to="/"
						class="menu-item flex items-center space-x-3 px-4 py-3 hover:bg-green-50 rounded-lg mb-2"
						@click="closeMobileMenu">
						<i class="fas fa-home text-green-600 w-5"></i>
						<span class="font-medium">Home</span>
					</NuxtLink>

					<!-- Categories Accordion -->
					<div>
						<button
							class="menu-item w-full text-left flex items-center justify-between px-4 py-3 hover:bg-green-50 rounded-lg mb-2"
							@click="toggleCategories">
							<div class="flex items-center space-x-3">
								<i class="fas fa-layer-group text-green-600 w-5"></i>
								<span class="font-medium">Categories</span>
							</div>
							<i class="fas text-sm transition-transform"
								:class="showCategories ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
						</button>
						<div v-if="showCategories" class="pl-12 mb-2">
							<NuxtLink v-for="cat in categories" :key="cat.id" :to="`/categories/${cat.slug}`"
								class="menu-item flex items-center space-x-3 px-4 py-2 hover:bg-green-50 rounded-lg mb-1"
								@click="closeMobileMenu">
								<i class="fas text-green-500 text-sm" :class="cat.icon"></i>
								<span class="text-gray-700">{{ cat.name }}</span>
							</NuxtLink>
						</div>
					</div>

					<NuxtLink to="/browse"
						class="menu-item flex items-center space-x-3 px-4 py-3 hover:bg-green-50 rounded-lg mb-2"
						@click="closeMobileMenu">
						<i class="fas fa-compass text-green-600 w-5"></i>
						<span class="font-medium">Browse</span>
					</NuxtLink>
					

					<!-- Auth links -->
					<div v-if="!isAuthenticated" class="mt-6 border-t pt-4">
						<NuxtLink to="/login"
							class="menu-item flex items-center space-x-3 px-4 py-3 hover:bg-green-50 rounded-lg mb-2"
							@click="closeMobileMenu">
							<i class="fas fa-sign-in-alt text-green-600 w-5"></i>
							<span class="font-medium">Login</span>
						</NuxtLink>
						<NuxtLink to="/signup"
							class="menu-item flex items-center space-x-3 px-4 py-3 bg-green-600 text-white hover:bg-green-700 rounded-lg"
							@click="closeMobileMenu">
							<i class="fas fa-user-plus w-5"></i>
							<span class="font-medium">Signup</span>
						</NuxtLink>
					</div>

					<div v-else class="mt-6 border-t pt-4">
						<div class="flex items-center space-x-3 px-4 py-3 mb-4">
							<div class="w-9 h-9 rounded-full border-2 border-white overflow-hidden shadow-md">
								<img :src="user.avatar || '/default-avatar.png'" alt="profile"
									class="w-full h-full object-cover" />
							</div>
							<div>
								<p class="font-medium text-gray-800">{{ user.username }}</p>
								<p class="text-sm text-gray-500">View profile</p>
							</div>
						</div>

						<NuxtLink to="/my-recipes"
							class="menu-item flex items-center space-x-3 px-4 py-2 hover:bg-green-50 rounded-lg mb-1"
							@click="closeMobileMenu">
							<i class="fas fa-book text-green-600 w-5"></i>
							<span class="text-gray-700">My Recipes</span>
						</NuxtLink>
						<NuxtLink to="/bookmarks"
							class="menu-item flex items-center space-x-3 px-4 py-2 hover:bg-green-50 rounded-lg mb-1"
							@click="closeMobileMenu">
							<i class="fas fa-bookmark text-green-600 w-5"></i>
							<span class="text-gray-700">Bookmarks</span>
						</NuxtLink>
						<NuxtLink to="/likes"
							class="menu-item flex items-center space-x-3 px-4 py-2 hover:bg-green-50 rounded-lg mb-1"
							@click="closeMobileMenu">
							<i class="fas fa-heart text-green-600 w-5"></i>
							<span class="text-gray-700">Liked Recipes</span>
						</NuxtLink>
						<button
							class="menu-item w-full text-left flex items-center space-x-3 px-4 py-2 hover:bg-red-50 rounded-lg text-red-600 mt-2"
							@click="logout">
							<i class="fas fa-sign-out-alt w-5"></i>
							<span>Logout</span>
						</button>
					</div>
				</div>

				<div class="absolute bottom-0 w-full p-4 border-t bg-white">
					<p class="text-center text-sm text-gray-500">© 2023 Tafach Recipes</p>
				</div>
			</div>
		</transition>
	</nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const isOpen = ref(false);
const searchQuery = ref("");
const showMobileSearch = ref(false);
const showCategories = ref(false);
const isScrolled = ref(false);
const showUserDropdown = ref(false);

// Fake auth state
const isAuthenticated = ref(true);
const user = ref({
	username: "Amanuel",
	avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80",
});

// Example categories
const categories = ref([
	{ id: 1, name: "Breakfast", slug: "breakfast", icon: "fa-mug-hot" },
	{ id: 2, name: "Lunch", slug: "lunch", icon: "fa-bowl-food" },
	{ id: 3, name: "Dinner", slug: "dinner", icon: "fa-utensils" },
	{ id: 4, name: "Desserts", slug: "desserts", icon: "fa-ice-cream" },
	{ id: 5, name: "Snacks", slug: "snacks", icon: "fa-cookie" },
	{ id: 6, name: "Vegetarian", slug: "vegetarian", icon: "fa-leaf" },
]);

const goSearch = () => {
	if (searchQuery.value) {
		navigateTo(`/search?query=${searchQuery.value}`);
		closeMobileMenu();
	}
};

const logout = () => {
	console.log("Logging out...");
	isAuthenticated.value = false;
	showUserDropdown.value = false;
};

const toggleMobileMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMobileMenu = () => {
  isOpen.value = false;
  showCategories.value = false;
};

const toggleMobileSearch = () => {
	showMobileSearch.value = !showMobileSearch.value;
};

const toggleCategories = () => {
	showCategories.value = !showCategories.value;
};

const toggleUserDropdown = () => {
	showUserDropdown.value = !showUserDropdown.value;
};

const handleScroll = () => {
	isScrolled.value = window.scrollY > 10;
};
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const clickedInsideMenu = target.closest(".mobile-menu");
  const clickedToggle = target.closest(".mobile-menu-toggle");
  if (isOpen.value && !clickedInsideMenu && !clickedToggle) {
    closeMobileMenu();
  }

  if (showUserDropdown.value && !target.closest(".user-dropdown")) {
    showUserDropdown.value = false;
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.nav-blur {
	backdrop-filter: blur(12px);
	-webkit-backdrop-filter: blur(12px);
	background: rgba(255, 255, 255, 0.85);
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.nav-scrolled {
	background: rgba(255, 255, 255, 0.95);
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.menu-enter-active,
.menu-leave-active {
	transition: all 0.4s cubic-bezier(0.77, 0, 0.175, 1);
}

.menu-enter-from,
.menu-leave-to {
	opacity: 0;
	transform: translateX(100%);
}

.menu-item {
	transition: all 0.3s ease;
}

.menu-item:hover {
	transform: translateX(8px);
}

.dropdown-enter-active,
.dropdown-leave-active {
	transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}

.search-bar-enter-active,
.search-bar-leave-active {
	transition: all 0.3s ease;
}

.search-bar-enter-from,
.search-bar-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}

.backdrop {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.4);
	z-index: 40;
	backdrop-filter: blur(4px);
}

.backdrop-enter-active,
.backdrop-leave-active {
	transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
	opacity: 0;
}

.avatar-ring {
	transition: all 0.3s ease;
}

.avatar-ring:hover {
	box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.4);
}

.hamburger-line {
	transition: all 0.3s ease;
}

.hamburger-active .hamburger-line:nth-child(1) {
	transform: translateY(8px) rotate(45deg);
}

.hamburger-active .hamburger-line:nth-child(2) {
	opacity: 0;
}

.hamburger-active .hamburger-line:nth-child(3) {
	transform: translateY(-8px) rotate(-45deg);
}

.category-highlight {
	position: relative;
}

.category-highlight::after {
	content: '';
	position: absolute;
	bottom: -2px;
	left: 0;
	width: 0;
	height: 2px;
	background: #16a34a;
	transition: width 0.3s ease;
}

.category-highlight:hover::after {
	width: 100%;
}
</style>