/**
 * ESLint Rule: no-unsafe-as-casts
 * Uses CodeKeeper validation logic for TypeScript as casts
 */

const { 
  checkFileForAsCasts, 
  findAsCasts,
  isAllowedFile 
} = require('../lib/validators/as-casts');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow unsafe TypeScript as casts using CodeKeeper validation',
      category: 'Possible Errors',
      recommended: true,
    },
    messages: {
      unsafeAsCast: 'Unsafe "as" type assertion: {{cast}} (CodeKeeper)',
    },
    schema: []
  },

  create(context) {
    return {
      Program(node) {
        const filename = context.getFilename();
        
        // Skip if not a TypeScript file
        if (!filename.endsWith('.ts') && !filename.endsWith('.tsx')) return;
        
        // Skip if allowed by CodeKeeper rules
        if (isAllowedFile(filename)) return;
        
        const sourceCode = context.getSourceCode();
        const content = sourceCode.getText();
        
        // Use our existing validation logic
        const violations = findAsCasts(filename, content);
        
        violations.forEach(violation => {
          // Convert line/column to ESLint location
          context.report({
            loc: {
              start: { line: violation.line, column: violation.column - 1 },
              end: { line: violation.line, column: violation.column + violation.match.length - 1 }
            },
            messageId: 'unsafeAsCast',
            data: { cast: violation.match }
          });
        });
      }
    };
  }
};