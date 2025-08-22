#!/usr/bin/env node

const fs = require('fs')

const ALLOWED_RELATIVE_IMPORTS = [
  './types', // Local type imports within same directory
  './components', // Local component imports
  './utils', // Local utility imports
]

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const violations = []

  lines.forEach((line, index) => {
    // Check for relative imports
    const importMatch = line.match(/from\s+['"](\.\.[^'"`]+)['"]/)
    if (importMatch) {
      const importPath = importMatch[1]

      // Check if it's an allowed relative import pattern
      const isAllowed = ALLOWED_RELATIVE_IMPORTS.some((pattern) => importPath.startsWith(pattern))

      if (!isAllowed && !importPath.startsWith('./')) {
        violations.push({
          line: index + 1,
          import: importPath,
          text: line.trim(),
        })
      }
    }
  })

  return violations
}

function main() {
  const files = process.argv.slice(2)

  if (files.length === 0) {
    console.log('No files to check')
    process.exit(0)
  }

  let hasViolations = false
  const allViolations = []

  files.forEach((file) => {
    if (!fs.existsSync(file)) {
      return
    }

    const violations = checkFile(file)
    if (violations.length > 0) {
      hasViolations = true
      allViolations.push({ file, violations })
    }
  })

  if (hasViolations) {
    console.log('❌ Found relative import violations:')
    allViolations.forEach(({ file, violations }) => {
      console.log(`\n📁 ${file}:`)
      violations.forEach(({ line, import: importPath }) => {
        console.log(`  Line ${line}: "${importPath}" should use "@/" alias`)
      })
    })
    console.log('\n💡 Use "@/" aliases instead of relative imports')
    process.exit(1)
  }

  console.log('✅ All imports use proper aliases')
  process.exit(0)
}

main()
