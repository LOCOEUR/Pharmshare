import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 3000, // Augmenté à 3000 pour supprimer tout avertissement de taille de chunk sur Vercel
  },
})
