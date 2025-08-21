// https://nuxt.com/docs/api/configuration/nuxt-config
import colors from 'tailwindcss/colors'

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }

  // tailwindcss: {
  //   config: {
  //     theme :{ 
  //       extend: {
  //         colors : {primary : colors.green}
  //       }
  //     }
  //   }
  // }
})
