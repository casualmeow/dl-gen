import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "entities": path.resolve(__dirname, "./src/entities"),
      "pages": path.resolve(__dirname, "./src/pages"),
      "shared": path.resolve(__dirname, "./src/shared"),
    }
  }
})
