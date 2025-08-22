/**
 * ESLint Rule: require-jsdoc
 * Uses CodeKeeper validation logic for JSDoc requirements
 */

const { JSDocValidator } = require('../lib/validators/jsdoc');

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require JSDoc comments using CodeKeeper validation',
      category: 'Best Practices',
      recommended: false,
    },
    messages: {
      missingJSDoc: 'JSDoc violation: {{error}} (CodeKeeper)',
    },
    schema: []
  },

  create(context) {
    return {
      Program(node) {
        const filename = context.getFilename();
        
        // Skip if not a supported file type
        if (!/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(filename)) return;
        
        try {
          // Use our existing validation logic
          const validator = new JSDocValidator();
          validator.validateFile(filename);
          const report = validator.generateReport();
          
          if (report.summary.hasViolations) {
            report.violations.forEach(violation => {
              violation.errors.forEach(error => {
                context.report({
                  loc: {
                    start: { line: violation.line, column: 0 },
                    end: { line: violation.line, column: 0 }
                  },
                  messageId: 'missingJSDoc',
                  data: { error }
                });
              });
            });
          }
        } catch (error) {
          // Skip if file can't be validated
          return;
        }
      }
    };
  }
};