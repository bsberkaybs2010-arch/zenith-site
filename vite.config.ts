import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/three/')) return 'three-core'
          if (id.includes('/node_modules/@react-three/') || id.includes('/node_modules/react-reconciler/')) return 'three-fiber'
          if (id.includes('/node_modules/framer-motion/') || id.includes('/node_modules/motion/')) return 'motion'
          if (id.includes('/node_modules/lucide-react/')) return 'icons'
        },
      },
    },
  },
})
