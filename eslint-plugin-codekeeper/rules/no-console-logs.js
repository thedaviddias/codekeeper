/**
 * @fileoverview Rule to detect console.log statements in production code
 * @author CodeKeeper
 */

const { findConsoleLogs, checkNextJsConfig } = require('../lib/validators/console-logs')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow console.log statements in production code',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          skipNextJsProjects: {
            type: 'boolean',
            default: true
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      consoleLogFound: 'Console statement found: {{type}}. Remove or wrap in development condition.'
    }
  },

  create(context) {
    const options = (context.options && context.options[0]) || {}
    const skipNextJsProjects = options.skipNextJsProjects !== false

    return {
      Program(node) {
        const sourceCode = context.getSourceCode()
        const filename = context.getFilename()
        const text = sourceCode.getText()
        
        // Check Next.js configuration if enabled
        if (skipNextJsProjects) {
          const projectRoot = process.cwd()
          const nextConfig = checkNextJsConfig(projectRoot)
          
          if (nextConfig.hasNextJs && nextConfig.hasConsoleRemoval) {
            // Skip validation if Next.js will handle console removal
            return {}
          }
        }
        
        const result = findConsoleLogs(text, filename)
        
        if (result.skipped) {
          return {}
        }
        
        result.violations.forEach(violation => {
          const loc = {
            line: violation.line,
            column: 0
          }
          
          context.report({
            loc,
            messageId: 'consoleLogFound',
            data: {
              type: violation.type
            }
          })
        })
      }
    }
  }
}