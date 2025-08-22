#!/usr/bin/env node

/**
 * Quick test script to verify validation scripts work
 * Run this during development to check your changes
 */

const { execSync } = require('child_process')
const path = require('path')

function runTest(command, description) {
  console.log(`\n🧪 ${description}`)
  try {
    const result = execSync(command, { encoding: 'utf8', cwd: path.join(__dirname, '..') })
    console.log(`✅ PASS: ${description}`)
    if (result.trim()) {
      console.log(`   Output: ${result.trim().split('\n')[0]}...`)
    }
  } catch (error) {
    console.log(`❌ Expected failure: ${description}`)
    if (error.stdout) {
      console.log(`   Output: ${error.stdout.trim().split('\n')[0]}...`)
    }
  }
}

console.log('🚀 Running quick validation tests...')

// Test each validation script with known bad files
runTest(
  'node scripts/validation/check-as-casts.js tests/fixtures/as-casts/bad-component.tsx',
  'AS casts validation (should find violations)'
)

runTest(
  'node scripts/validation/check-barrel-files.js',
  'Barrel files validation (should find test fixtures)'
)

runTest(
  'node scripts/validation/check-relative-imports.js tests/fixtures/relative-imports/bad-imports.tsx',
  'Relative imports validation (should find violations)'
)

runTest(
  'node scripts/validation/check-jsdoc.js tests/fixtures/jsdoc/bad-jsdoc.ts',
  'JSDoc validation (should find missing docs)'
)

runTest(
  'node scripts/validation/check-file-complexity.js tests/fixtures/complexity/complex-file.tsx',
  'File complexity validation (should find violations)'
)

runTest(
  'node scripts/validation/check-directory-structure.js',
  'Directory structure validation (should pass)'
)

console.log('\n🎉 Quick test completed! Run "npm test" for comprehensive testing.')