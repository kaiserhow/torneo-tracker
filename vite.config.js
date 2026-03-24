import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Cambia 'torneotrack' por el nombre exacto de tu repo en GitHub
export default defineConfig({
  plugins: [react()],
  base: '/torneotrack/',
});
