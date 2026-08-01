import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Bundsgaards-Private-Pasningsordning-hjemmeside/',
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
