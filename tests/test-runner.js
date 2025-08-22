#!/usr/bin/env node

/**
 * Test runner for CodeKeeper validation scripts
 * Ensures all validation rules work as expected
 */

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

// Test configurations - define what should pass/fail for each script
const TESTS = {
  'check-as-casts': {
    shouldFail: ['tests/fixtures/as-casts/bad-component.tsx'],
    shouldPass: ['tests/fixtures/as-casts/good-component.tsx'],
    expectedViolations: 4, // Number of violations expected in bad file
  },
  'check-barrel-files': {
    shouldFail: ['tests/fixtures/barrel-files'],
    shouldPass: [], // Will test that src/index.ts is allowed
    expectedViolations: 1, // components/index.ts should be detected
  },
  'check-relative-imports': {
    shouldFail: ['tests/fixtures/relative-imports/bad-imports.tsx'],
    shouldPass: ['tests/fixtures/relative-imports/good-imports.tsx'],
    expectedViolations: 4, // Number of deep imports in bad file
  },
  'check-jsdoc': {
    shouldFail: ['tests/fixtures/jsdoc/bad-jsdoc.ts'],
    shouldPass: ['tests/fixtures/jsdoc/good-jsdoc.ts'],
    expectedViolations: 3, // Missing JSDoc for function, class, hook
  },
  'check-file-complexity': {
    shouldFail: ['tests/fixtures/complexity/complex-file.tsx'],
    shouldPass: ['tests/fixtures/complexity/simple-file.tsx'],
    expectedViolations: 4, // Lines, functions, imports, complexity violations
  },
  'check-directory-structure': {
    shouldFail: [],
    shouldPass: ['.'], // Current directory should pass
    expectedViolations: 0,
  }
}

class TestRunner {
  constructor() {
    this.passed = 0
    this.failed = 0
    this.scriptPath = path.join(__dirname, '..', 'scripts', 'validation')
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      error: '\x1b[31m',   // Red
      warning: '\x1b[33m', // Yellow
      reset: '\x1b[0m'
    }
    console.log(`${colors[type]}${message}${colors.reset}`)
  }

  runScript(scriptName, files = []) {
    const scriptPath = path.join(this.scriptPath, `${scriptName}.js`)
    const filesArg = files.length > 0 ? files.join(' ') : ''
    
    try {
      const result = execSync(`node "${scriptPath}" ${filesArg}`, {
        encoding: 'utf8',
        stdio: 'pipe'
      })
      return { success: true, output: result, exitCode: 0 }
    } catch (error) {
      return { 
        success: false, 
        output: error.stdout + error.stderr, 
        exitCode: error.status 
      }
    }
  }

  testScript(scriptName) {
    this.log(`\n🧪 Testing ${scriptName}...`, 'info')
    const config = TESTS[scriptName]
    let testsPassed = 0
    let testsTotal = 0

    // Test files that should fail
    for (const file of config.shouldFail) {
      testsTotal++
      const result = this.runScript(scriptName, [file])
      
      if (!result.success) {
        this.log(`  ✅ ${file} correctly failed validation`, 'success')
        testsPassed++
        
        // Check if expected number of violations were found
        if (config.expectedViolations > 0) {
          const violationCount = this.countViolations(result.output)
          if (violationCount >= config.expectedViolations) {
            this.log(`    ✅ Found ${violationCount} violations (expected >= ${config.expectedViolations})`, 'success')
          } else {
            this.log(`    ❌ Found ${violationCount} violations (expected >= ${config.expectedViolations})`, 'error')
          }
        }
      } else {
        this.log(`  ❌ ${file} should have failed but passed`, 'error')
        this.log(`    Output: ${result.output}`, 'warning')
      }
    }

    // Test files that should pass
    for (const file of config.shouldPass) {
      testsTotal++
      const result = this.runScript(scriptName, [file])
      
      if (result.success) {
        this.log(`  ✅ ${file} correctly passed validation`, 'success')
        testsPassed++
      } else {
        this.log(`  ❌ ${file} should have passed but failed`, 'error')
        this.log(`    Output: ${result.output}`, 'warning')
      }
    }

    // If no specific files, test the script runs without errors
    if (config.shouldFail.length === 0 && config.shouldPass.length === 0) {
      testsTotal++
      const result = this.runScript(scriptName)
      if (result.success || result.exitCode === 0) {
        this.log(`  ✅ Script runs without errors`, 'success')
        testsPassed++
      } else {
        this.log(`  ❌ Script failed to run`, 'error')
        this.log(`    Output: ${result.output}`, 'warning')
      }
    }

    if (testsPassed === testsTotal) {
      this.log(`✅ ${scriptName}: ${testsPassed}/${testsTotal} tests passed`, 'success')
      this.passed++
    } else {
      this.log(`❌ ${scriptName}: ${testsPassed}/${testsTotal} tests passed`, 'error')
      this.failed++
    }
  }

  countViolations(output) {
    // Count common violation indicators
    const lines = output.split('\n')
    let count = 0
    
    for (const line of lines) {
      if (line.includes('Line ') || 
          line.includes('- ') ||
          line.includes('Found ') ||
          line.includes('violation') ||
          line.includes('error')) {
        count++
      }
    }
    
    return count
  }

  runAllTests() {
    this.log('🚀 Running CodeKeeper validation tests...\n', 'info')
    
    // Check if test fixtures exist
    if (!fs.existsSync(path.join(__dirname, 'fixtures'))) {
      this.log('❌ Test fixtures not found! Please create test fixtures first.', 'error')
      process.exit(1)
    }

    // Run tests for each script
    Object.keys(TESTS).forEach(scriptName => {
      this.testScript(scriptName)
    })

    // Summary
    this.log('\n📊 Test Summary:', 'info')
    this.log(`✅ Passed: ${this.passed}`, 'success')
    this.log(`❌ Failed: ${this.failed}`, this.failed > 0 ? 'error' : 'success')
    
    if (this.failed === 0) {
      this.log('\n🎉 All validation scripts are working correctly!', 'success')
      process.exit(0)
    } else {
      this.log('\n💥 Some validation scripts have issues that need fixing.', 'error')
      process.exit(1)
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const runner = new TestRunner()
  runner.runAllTests()
}

module.exports = TestRunner