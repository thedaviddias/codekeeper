/**
 * ESLint Rule: no-unsafe-as-casts
 * Prevents unsafe TypeScript type assertions
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow unsafe TypeScript type assertions',
      category: 'TypeScript',
      recommended: true,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          allowedPatterns: {
            type: 'array',
            items: { type: 'string' }
          },
          allowInTests: {
            type: 'boolean',
            default: true
          }
        },
        additionalProperties: false,
      },
    ],
    messages: {
      unsafeAsAny: "Type assertion 'as any' is unsafe and should be avoided",
      unsafeAsUnknown: "Type assertion 'as unknown' should be used carefully",
      unsafeTypeAssertion: "Type assertion '{{ assertion }}' may be unsafe. Consider using type guards instead",
      preferTypeGuard: "Consider using a type guard: if (typeof value === '{{ type }}') { ... }",
      preferTypePredicate: "Consider using a type predicate function instead",
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const allowedPatterns = options.allowedPatterns || ['as const'];
    const allowInTests = options.allowInTests !== false;
    
    // Check if we're in a test file
    const filename = context.getFilename();
    const isTestFile = /\.(test|spec)\.(ts|tsx)$/.test(filename) || 
                      filename.includes('__tests__');
    
    if (allowInTests && isTestFile) {
      return {}; // Skip test files if allowed
    }

    function checkTSTypeAssertion(node) {
      // Get the type being asserted to
      const typeAnnotation = node.typeAnnotation;
      
      // Convert AST node to string representation
      const sourceCode = context.getSourceCode();
      const assertionText = sourceCode.getText(typeAnnotation);
      
      // Check for unsafe patterns
      if (assertionText === 'any') {
        context.report({
          node,
          messageId: 'unsafeAsAny',
          data: { assertion: assertionText }
        });
        return;
      }
      
      if (assertionText === 'unknown') {
        context.report({
          node,
          messageId: 'unsafeAsUnknown', 
          data: { assertion: assertionText }
        });
        return;
      }
      
      // Check if assertion matches allowed patterns
      const isAllowed = allowedPatterns.some(pattern => {
        return new RegExp(pattern).test(assertionText);
      });
      
      if (!isAllowed) {
        // Suggest type guard for common cases
        let messageId = 'unsafeTypeAssertion';
        
        if (['string', 'number', 'boolean'].includes(assertionText.toLowerCase())) {
          messageId = 'preferTypeGuard';
        }
        
        context.report({
          node,
          messageId,
          data: { 
            assertion: assertionText,
            type: assertionText.toLowerCase()
          }
        });
      }
    }

    return {
      // TypeScript type assertions: value as Type
      TSTypeAssertion: checkTSTypeAssertion,
      
      // TypeScript angle bracket assertions: <Type>value (less common)
      TSTypeAssertionExpression: checkTSTypeAssertion,
      
      // Handle template literal types and other complex cases
      CallExpression(node) {
        // Check for type assertion functions that might be wrapping unsafe casts
        if (node.callee && node.callee.name && 
            /^(assert|cast|as)/.test(node.callee.name.toLowerCase())) {
          
          // This is a heuristic - might need refinement
          const sourceCode = context.getSourceCode();
          const callText = sourceCode.getText(node);
          
          if (callText.includes('as any') || callText.includes('as unknown')) {
            context.report({
              node,
              messageId: 'unsafeTypeAssertion',
              data: { assertion: 'function call' }
            });
          }
        }
      }
    };
  },
};