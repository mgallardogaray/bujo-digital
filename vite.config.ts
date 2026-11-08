import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// La app se publica en https://mgallardogaray.github.io/bujo-digital/
export default defineConfig({
  base: '/bujo-digital/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        name: 'Bujo Digital',
        short_name: 'Bujo',
        description: 'Mi bullet journal digital para organizarme con TDAH',
        lang: 'es',
        theme_color: '#fbf6ea',
        background_color: '#fbf6ea',
        display: 'standalone',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
