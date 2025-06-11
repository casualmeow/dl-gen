/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import svgr from 'vite-plugin-svgr';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mdx = await import('@mdx-js/rollup');

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
    svgr(), 
    tailwindcss(),
    mdx.default(),
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
      },
      {
        name: "alias-only-src-entities",
      enforce: "pre",
      async resolveId(source, importer) {
        if (
          importer &&                                   
          source.startsWith("entities/") &&            
          importer.startsWith(path.resolve(__dirname, "src")) 
        ) {
          const sub = source.slice("entities/".length);
          const resolved = path.resolve(__dirname, "src/entities", sub);
          return this.resolve(resolved, importer, { skipSelf: true });
        }
      },
    },

],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      app: path.resolve(__dirname, './src/app'),
      widgets: path.resolve(__dirname, './src/widgets'),
      features: path.resolve(__dirname, './src/features'),
      pages: path.resolve(__dirname, './src/pages'),
      shared: path.resolve(__dirname, './src/shared'),

      "parse5/dist/serializer/index.js": path.resolve(
        __dirname,
        "node_modules/parse5/dist/serializer/index.js"
      ),
      "parse5/dist/serializer/escape.js": path.resolve(
        __dirname,
        "node_modules/parse5/dist/serializer/escape.js"
      ),
    },
  },
});
