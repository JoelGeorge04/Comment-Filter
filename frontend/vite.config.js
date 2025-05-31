import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Frontend on port 3000
    host: 'localhost', 
    strictPort: true, 
    proxy: {
      '/api': 'http://localhost:5000' // Backend on port 5000
    }
  }
});
