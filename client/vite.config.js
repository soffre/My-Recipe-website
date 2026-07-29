import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true
  },
  build: {
    // Elevates the warning trigger threshold so your build logs stay clean
    chunkSizeWarningLimit: 1200, 
    rolldownOptions: {
      output: {
        // Automatically splits node_modules into a separate, cached vendor chunk
        codeSplitting: {
          minSize: 20000,
          groups: [
            {
              name: 'vendor',
              test: /node_modules/,
            },
          ],
        },
      },
    },
  },
});
