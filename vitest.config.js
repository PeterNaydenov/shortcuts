import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig ({
      plugins: [react()],
      test: {
            coverage: {
                        reporter: ['lcov', 'text-summary']
                  },
            browser: {
              enabled: true,
              headless: true,
              provider: 'playwright',
              instances: [
                {
                  browser: 'chromium'
                }
              ]
            }
        }
})