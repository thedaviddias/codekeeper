/**
 * ESLint Rule: max-file-complexity
 * Uses CodeKeeper validation logic for file complexity
 */

const { analyzeFile, shouldExcludeFile } = require('../lib/validators/file-complexity');

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce maximum file complexity using CodeKeeper validation',
      category: 'Best Practices',
      recommended: false,
    },
    messages: {
      complexityViolation: '{{violation}} (CodeKeeper)',
    },
    schema: []
  },

  create(context) {
    return {
      Program(node) {
        const filename = context.getFilename();
        
        // Skip if excluded by CodeKeeper rules
        if (shouldExcludeFile(filename)) return;
        
        try {
          // Use our existing validation logic
          const analysis = analyzeFile(filename);
          
          if (analysis.violations.length > 0) {
            analysis.violations.forEach(violation => {
              context.report({
                node,
                messageId: 'complexityViolation',
                data: { violation }
              });
            });
          }
        } catch (error) {
          // Skip if file can't be analyzed
          return;
        }
      }
    };
  }
};