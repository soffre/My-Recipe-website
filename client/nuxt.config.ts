// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	css: ["@/assets/css/tailwind.css"],
	modules: [
		"@nuxt/eslint",
		"@nuxtjs/tailwindcss",
		"@nuxtjs/google-fonts",
	],
	devtools: { enabled: true },
	compatibilityDate: "2025-07-15",

	googleFonts: {
		families: {
			'Playfair Display': [400, 500, 700],
			Inter: [400, 500, 600, 700],
		},
		display: 'swap',
		download: true,
	},

	eslint: {
		config: {
			stylistic: {
				indent: "tab",
				semi: true,
				quotes: "double",

			},
		},
	},
});