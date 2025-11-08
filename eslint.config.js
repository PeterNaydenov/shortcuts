export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        document: 'readonly',
        window: 'readonly',
        navigator: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        structuredClone: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        vi: 'readonly',
        userEvent: 'readonly',
        getByLabelText: 'readonly',
        getByText: 'readonly',
        getByTestId: 'readonly',
        queryByTestId: 'readonly',
        waitFor: 'readonly',
        html: 'readonly',
        Block: 'readonly',
        askForPromise: 'readonly',
        cssCode: 'readonly',
        performance: 'readonly',
        HTMLElement: 'readonly',
        getComputedStyle: 'readonly',
        vitest: 'readonly'
      }
    },
    rules: {
      // Only critical errors that can break code
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-dupe-args': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-invalid-regexp': 'error',
      'no-obj-calls': 'error',
      'no-sparse-arrays': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',
      
      // Important but not critical
      'no-debugger': 'warn',
      'no-eval': 'warn',
      'no-duplicate-imports': 'error',
      'object-shorthand': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',
      'no-var': 'error'
    },
    ignores: [
      'dist/**',
      'coverage/**',
      'node_modules/**',
      '*.min.js',
      'test/__screenshots__/**',
      'test/**/__screenshots__/**'
    ]
  },
  {
    // Test-specific configuration
    files: ['test/**/*.js', 'test-helpers/**/*.js'],
    rules: {
      'no-unused-vars': 'off',
      'no-debugger': 'off',
      'no-eval': 'off',
      'no-undef': 'off'
    }
  }
]