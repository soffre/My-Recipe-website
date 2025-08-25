// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		"@nuxt/eslint",
		"@nuxtjs/tailwindcss",
		"@nuxtjs/google-fonts",
	],
	devtools: { enabled: true },
	css: ["@/assets/css/tailwind.css"],
	compatibilityDate: "2025-07-15",

	eslint: {
		config: {
			stylistic: {
				indent: "tab",
				semi: true,
				quotes: "double",

			},
		},
	},

	googleFonts: {
		families: {
			"Playfair Display": [400, 500, 700],
			"Inter": [400, 500, 600, 700],
		},
		display: "swap",
		download: true,
	},
});
