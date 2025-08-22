/**
 * ESLint Rule: no-barrel-files
 * Uses CodeKeeper validation logic for barrel files
 */

const { isBarrelFile } = require('../lib/validators/barrel-files');

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow barrel files that could harm tree-shaking (CodeKeeper)',
      category: 'Best Practices',
      recommended: false,
    },
    messages: {
      barrelFile: 'This is a barrel file. Use explicit imports for better tree-shaking and performance.',
    },
    schema: []
  },

  create(context) {
    return {
      Program(node) {
        const filename = context.getFilename();
        
        // Use our existing validation logic
        if (isBarrelFile(filename)) {
          context.report({
            node,
            messageId: 'barrelFile'
          });
        }
      }
    };
  }
};