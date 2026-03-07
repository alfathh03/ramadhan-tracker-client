import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // BARU: Panggil Tailwind

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // BARU: Masukkan Tailwind ke dalam plugin
  ],
})