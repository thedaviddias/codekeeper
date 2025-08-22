module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
  ],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Enhanced rules that work well with CodeKeeper
    '@typescript-eslint/no-explicit-any': 'error', // Block 'any' types
    '@typescript-eslint/no-unused-vars': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off', // We use TypeScript for prop validation
    
    // Rules that complement CodeKeeper validation
    'no-console': 'warn', // AI often leaves console.logs
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Complexity rules (ESLint catches what CodeKeeper doesn't)
    'complexity': ['warn', 10],
    'max-depth': ['warn', 4],
    'max-lines-per-function': ['warn', 50],
  },
  
  // Allow certain patterns in test files
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off', // Allow 'any' in tests for mocking
      },
    },
  ],
};