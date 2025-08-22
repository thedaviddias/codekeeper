#!/usr/bin/env node

/**
 * Detects barrel files that hurt build performance and tree-shaking
 * Prevents re-export patterns that slow down bundlers
 */

// ============================================================================
// CONFIGURATION - Customize these settings for your project
// ============================================================================

// File names that are considered potential barrel files
const BARREL_FILE_PATTERNS = [
  'index.ts', 
  'index.js', 
  'index.mjs',
  'index.cjs',
  'index.tsx', 
  'index.jsx'
]

// Directories to exclude from barrel file checking
const EXCLUDED_DIRECTORIES = [
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

// Index files that are legitimate (not barrel files)
const ALLOWED_INDEX_FILES = [
  // Next.js legitimate index files
  'app/page.tsx',           // Next.js 13+ app router root page
  'pages/index.tsx',        // Next.js pages router root page  
  'pages/index.js',
  'pages/index.mjs',
  'src/pages/index.tsx',
  'src/pages/index.js',
  'src/pages/index.mjs',
  
  // Other legitimate index files
  'src/index.ts',           // Package entry point
  'src/index.js',           // Package entry point
  'src/index.mjs',          // ES module entry point
  'src/index.cjs',          // CommonJS entry point
  'lib/index.ts',           // Library entry point
  'lib/index.js',           // Library entry point
  'lib/index.mjs',          // Library ES module entry point
]

// Patterns that indicate a barrel file (re-exports)
const BARREL_EXPORT_PATTERNS = [
  /export\s*\*\s*from/g,           // export * from './module'
  /export\s*{\s*.*\s*}\s*from/g,   // export { something } from './module'
]

// Minimum number of exports to consider it a barrel file
const MIN_EXPORTS_FOR_BARREL = 3

// ============================================================================
// IMPLEMENTATION - No need to modify below this line
// ============================================================================

const fs = require('fs')
const path = require('path')

// Check if a file is actually a barrel file by analyzing its content
function isBarrelFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    let exportCount = 0
    
    // Count barrel export patterns
    BARREL_EXPORT_PATTERNS.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) {
        exportCount += matches.length
      }
    })
    
    // Consider it a barrel file if it has enough re-exports
    return exportCount >= MIN_EXPORTS_FOR_BARREL
  } catch (error) {
    // If we can't read the file, assume it's not a barrel file
    return false
  }
}

function findBarrelFiles(dir, basePath = '') {
  const barrelFiles = []

  if (!fs.existsSync(dir)) {
    return barrelFiles
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.join(basePath, entry.name).replace(/\\/g, '/')

    if (entry.isDirectory()) {
      // Skip excluded directories
      if (EXCLUDED_DIRECTORIES.includes(entry.name)) {
        continue
      }

      // Recursively check subdirectories
      barrelFiles.push(...findBarrelFiles(fullPath, relativePath))
    } else if (entry.isFile() && BARREL_FILE_PATTERNS.includes(entry.name)) {
      // Check if this barrel file is in the allowed list
      if (!ALLOWED_INDEX_FILES.includes(relativePath)) {
        // Check if file contains barrel export patterns
        if (isBarrelFile(fullPath)) {
          barrelFiles.push(relativePath)
        }
      }
    }
  }

  return barrelFiles
}

function main() {
  console.log('🔍 Checking for barrel files...')

  // Parse command line arguments
  const args = process.argv.slice(2)
  const specificDirs = args.filter(arg => !arg.startsWith('--'))
  
  // Determine directories to search
  const searchDirs = specificDirs.length > 0 ? specificDirs : ['.']
  
  // Find barrel files in all specified directories
  let allBarrelFiles = []
  searchDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const barrelFiles = findBarrelFiles(dir)
      allBarrelFiles = allBarrelFiles.concat(barrelFiles)
    }
  })
  
  // Exclude generated types directory from barrel checks
  allBarrelFiles = allBarrelFiles.filter((p) => !p.startsWith('lib/types/generated'))

  if (allBarrelFiles.length > 0) {
    console.log('❌ COMMIT BLOCKED: Barrel files are not allowed!')
    console.log('')
    console.log('💡 Use explicit imports instead of barrel files:')
    console.log("   ❌ import { Component } from '@/components'")
    console.log("   ✅ import { Component } from '@/components/component'")
    console.log('')
    console.log('📋 Found barrel files:')
    allBarrelFiles.forEach((file) => {
      console.log(`   - ${file}`)
    })
    console.log('')
    console.log('🔧 Benefits of explicit imports:')
    console.log('   • Better tree-shaking and smaller bundles')
    console.log('   • No circular dependency issues')
    console.log('   • Clearer dependency tracking')
    console.log('   • Faster builds and IDE performance')
    console.log('   • More explicit and maintainable code')
    console.log('')
    console.log('🛠️  To fix: Remove index files and update imports to be explicit')

    if (process.env.NODE_ENV !== 'development') {
      process.exit(1)
    }
  } else {
    console.log('✅ No barrel files found')
  }

  process.exit(0)
}

// Run validation (only if called directly)
if (require.main === module) {
  main()
}

// Export for use in ESLint plugin
module.exports = {
  BARREL_FILE_PATTERNS,
  EXCLUDED_DIRECTORIES,
  ALLOWED_INDEX_FILES,
  BARREL_EXPORT_PATTERNS,
  MIN_EXPORTS_FOR_BARREL,
  isBarrelFile,
  findAllBarrelFiles: () => {
    const barrelFiles = findAllIndexFiles()
    return barrelFiles.filter(file => isBarrelFile(file))
  }
}
