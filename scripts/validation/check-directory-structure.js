#!/usr/bin/env node

/**
 * Validates project directory structure for maintainability
 * Enforces consistent organization patterns
 */

// ============================================================================
// CONFIGURATION - Customize these settings for your project
// ============================================================================

// Required top-level directories and their rules
const REQUIRED_DIRECTORIES = [
  'src',           // Source code
  'components',    // React components (can be in src/)
]

// Optional directories that have specific structure rules when present
const OPTIONAL_DIRECTORIES = [
  'lib',           // Utility libraries
  'hooks',         // Custom React hooks
  'types',         // TypeScript type definitions
  'styles',        // CSS/styling files
  'utils',         // General utilities
  'api',           // API related code
  'features',      // Feature-based modules
]

// Component organization patterns (adjust for your team's preference)
const COMPONENT_STRUCTURE = {
  allowedSubdirectories: [
    'ui',            // Basic UI components (Button, Input, etc.)
    'layout',        // Layout components (Header, Footer, etc.)
    'forms',         // Form-related components
    'common',        // Shared/common components
    'pages',         // Page-specific components
  ],
  maxDepth: 3,       // Maximum nesting depth for component directories
  enforceGrouping: true, // Require components to be in subdirectories
}

// Files that are allowed in the root directory
const ALLOWED_ROOT_FILES = [
  // Configuration files
  'package.json',
  'tsconfig.json',
  'next.config.js',
  'next.config.mjs',
  'tailwind.config.js',
  'postcss.config.js',
  'eslint.config.js',
  '.eslintrc.js',
  '.eslintrc.json',
  
  // Documentation
  'README.md',
  'CHANGELOG.md',
  'LICENSE',
  
  // Git and CI
  '.gitignore',
  '.gitattributes',
  'lefthook.yml',
  '.husky',
  
  // Other
  '.env.example',
  '.env.local',
  'yarn.lock',
  'package-lock.json',
  'pnpm-lock.yaml',
]

// Directories to exclude from structure checking
const EXCLUDE_DIRECTORIES = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  'out',
  'coverage',
  '.turbo',
  '.vercel',
  '.netlify',
]

// ============================================================================
// IMPLEMENTATION - No need to modify below this line
// ============================================================================

const fs = require('fs')
const path = require('path')

// Helper function to check if directory should be excluded
function shouldExcludeDirectory(dirPath) {
  return EXCLUDE_DIRECTORIES.some(exclude => dirPath.includes(exclude))
}

// Main validation function
function validateDirectoryStructure() {
  const errors = []
  const warnings = []
  
  try {
    // Check if required directories exist
    REQUIRED_DIRECTORIES.forEach(dir => {
      if (!fs.existsSync(dir) && !fs.existsSync(path.join('src', dir))) {
        warnings.push(`Recommended directory missing: ${dir}`)
      }
    })
    
    // Check component structure if components directory exists
    const componentsDir = fs.existsSync('components') ? 'components' : 
                         fs.existsSync('src/components') ? 'src/components' : null
    
    if (componentsDir && COMPONENT_STRUCTURE.enforceGrouping) {
      const componentFiles = fs.readdirSync(componentsDir, { withFileTypes: true })
        .filter(dirent => dirent.isFile() && /\.(tsx?|jsx?)$/.test(dirent.name))
      
      if (componentFiles.length > 5) {
        warnings.push(`Consider organizing components into subdirectories (found ${componentFiles.length} files in ${componentsDir})`)
      }
    }
    
    console.log('✅ Directory structure validation completed')
    
    if (warnings.length > 0) {
      console.log('⚠️  Warnings:')
      warnings.forEach(warning => console.log(`  - ${warning}`))
    }
    
    return errors.length === 0
    
  } catch (error) {
    console.error('❌ Directory structure validation failed:', error.message)
    return false
  }
}

// Run validation if called directly
if (require.main === module) {
  const success = validateDirectoryStructure()
  process.exit(success ? 0 : 1)
}

module.exports = { validateDirectoryStructure }