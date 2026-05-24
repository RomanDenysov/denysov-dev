// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import vercel from '@astrojs/vercel';



// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
  adapter: vercel({
    webAnalytics: {
      enabled: true, // set to false when using @vercel/analytics@1.4.0
    },
  }),
})
