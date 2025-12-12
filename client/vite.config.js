import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ 
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Puritec PWA',
        short_name: 'Puritec',
        description: 'Puritec Progressive Web App',
        theme_color: '#008DD2',
        icons: [
            {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png'
            }
        ]
      }
    })
  ],
  server: {
    proxy: {
        '/api': {
            target: 'http://localhost:3000',
            changeOrigin: true
        },
        '/socket.io': {
            target: 'http://localhost:3000',
            ws: true,
            changeOrigin: true
        }
    }
  }
})
