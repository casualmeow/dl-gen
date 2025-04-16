/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  assetsInclude: ['**/*.worker.mjs'],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  server: {
    middlewareMode: false,
    fs: {
      strict: true,
    },
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: '[name]-[hash].[ext]'
      }
    }
  },
  plugins: [react(), 
    tailwindcss(),
    {
      name: 'fix-mjs-mime',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.endsWith('.mjs')) {
            res.setHeader('Content-Type', 'application/javascript');
          }
          next();
        });
      }
  }],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      app: path.resolve(__dirname, './src/app'),
      widgets: path.resolve(__dirname, './src/widgets'),
      features: path.resolve(__dirname, './src/features'),
      entities: path.resolve(__dirname, './src/entities'),
      pages: path.resolve(__dirname, './src/pages'),
      shared: path.resolve(__dirname, './src/shared'),
    },
  },
});
