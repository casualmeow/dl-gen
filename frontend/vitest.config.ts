import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
    plugins: [react()],
    test: {
        include: ['src/__tests__/**/*.spec.ts'],
        exclude: ['node_modules', 'dist'],
        browser: {
            enabled: true,
            provider: 'playwright',
            instances: [
                { browser: 'chromium', headless: true },
            ]
        },
    },
})

