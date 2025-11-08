import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig ({
      plugins: [react()],
      test: {
            coverage: {
                        provider: 'v8',
                        reporter: ['lcov', 'html', 'text-summary' ]
                  },
             browser: {
               enabled: true,
               headless: true,
               provider: playwright(),
               instances: [
                 {
                   browser: 'chromium'
                 }
               ]
             }
        }
})