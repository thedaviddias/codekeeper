#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const BARREL_FILE_PATTERNS = ['index.ts', 'index.js', 'index.tsx', 'index.jsx']

// Directories to exclude from barrel file checks
const EXCLUDED_DIRS = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  'out',
  'coverage',
  '.turbo',
]

// Specific files to allow (e.g., Next.js pages/index.tsx is legitimate)
const ALLOWED_BARREL_FILES = [
  'app/page.tsx', // Next.js 13+ app router root page
  'pages/index.tsx', // Next.js pages router root page
  'pages/index.js',
  'src/pages/index.tsx',
  'src/pages/index.js',
]

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
      if (EXCLUDED_DIRS.includes(entry.name)) {
        continue
      }

      // Recursively check subdirectories
      barrelFiles.push(...findBarrelFiles(fullPath, relativePath))
    } else if (entry.isFile() && BARREL_FILE_PATTERNS.includes(entry.name)) {
      // Check if this barrel file is in the allowed list
      if (!ALLOWED_BARREL_FILES.includes(relativePath)) {
        barrelFiles.push(relativePath)
      }
    }
  }

  return barrelFiles
}

function main() {
  console.log('🔍 Checking for barrel files...')

  // Exclude generated types directory from barrel checks
  const barrelFiles = findBarrelFiles('.').filter((p) => !p.startsWith('lib/types/generated'))

  if (barrelFiles.length > 0) {
    console.log('❌ COMMIT BLOCKED: Barrel files are not allowed!')
    console.log('')
    console.log('💡 Use explicit imports instead of barrel files:')
    console.log("   ❌ import { Component } from '@/components'")
    console.log("   ✅ import { Component } from '@/components/component'")
    console.log('')
    console.log('📋 Found barrel files:')
    barrelFiles.forEach((file) => {
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
    console.log('🛠️  To fix: Remove index.ts files and update imports to be explicit')

    if (process.env.NODE_ENV !== 'development') {
      process.exit(1)
    }
  } else {
    console.log('✅ No barrel files found')
  }

  process.exit(0)
}

main()
