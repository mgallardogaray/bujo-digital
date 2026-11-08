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
      injectRegister: false, // el registro se hace a mano en src/main.tsx
      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        name: 'Bujo Digital',
        short_name: 'Bujo',
        description: 'Mi bullet journal digital para organizarme con TDAH',
        lang: 'es',
        theme_color: '#f4efe6',
        background_color: '#f4efe6',
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
