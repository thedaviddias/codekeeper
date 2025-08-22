/**
 * ESLint Plugin: CodeKeeper
 * AI Development Guardrails as ESLint Rules
 */

const noUnsafeAsCasts = require('./rules/no-unsafe-as-casts');
const noBarrelFiles = require('./rules/no-barrel-files');
const maxFileComplexity = require('./rules/max-file-complexity');
const requireJsdoc = require('./rules/require-jsdoc');

module.exports = {
  meta: {
    name: 'eslint-plugin-codekeeper',
    version: '1.0.0',
  },
  
  rules: {
    'no-unsafe-as-casts': noUnsafeAsCasts,
    'no-barrel-files': noBarrelFiles,
    'max-file-complexity': maxFileComplexity,
    'require-jsdoc': requireJsdoc,
  },
  
  configs: {
    recommended: {
      plugins: ['codekeeper'],
      rules: {
        'codekeeper/no-unsafe-as-casts': 'error',
        'codekeeper/no-barrel-files': 'warn',
        'codekeeper/max-file-complexity': 'warn',
        'codekeeper/require-jsdoc': 'warn',
      },
    },
    
    strict: {
      plugins: ['codekeeper'],
      rules: {
        'codekeeper/no-unsafe-as-casts': 'error',
        'codekeeper/no-barrel-files': 'error', 
        'codekeeper/max-file-complexity': 'error',
        'codekeeper/require-jsdoc': 'error',
      },
    },
    
    react: {
      plugins: ['codekeeper'],
      rules: {
        'codekeeper/no-unsafe-as-casts': 'error',
        'codekeeper/no-barrel-files': 'warn',
        'codekeeper/max-file-complexity': ['warn', { 
          maxLines: 300, 
          maxFunctions: 10 
        }],
        'codekeeper/require-jsdoc': ['warn', { 
          requireForComponents: true 
        }],
      },
    },
  },
};