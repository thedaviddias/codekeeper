/**
 * Test ESLint Plugin Rules
 * Simple test to verify our ESLint rules work correctly
 */

const path = require('path');

// Import ESLint rules
const noUnsafeAsCasts = require('../eslint-plugin-codekeeper/rules/no-unsafe-as-casts');
const noBarrelFiles = require('../eslint-plugin-codekeeper/rules/no-barrel-files');
const maxFileComplexity = require('../eslint-plugin-codekeeper/rules/max-file-complexity');
const requireJsdoc = require('../eslint-plugin-codekeeper/rules/require-jsdoc');

// Mock ESLint context
function createMockContext(filename, sourceCode) {
  const violations = [];
  
  return {
    getFilename: () => filename,
    getSourceCode: () => ({
      getText: () => sourceCode,
      lines: sourceCode.split('\n'),
      getCommentsBefore: () => []
    }),
    report: (violation) => {
      violations.push(violation);
    },
    _getViolations: () => violations
  };
}

function testRule(ruleName, rule, filename, sourceCode) {
  console.log(`\n🧪 Testing ${ruleName}:`);
  console.log(`📁 File: ${filename}`);
  
  const context = createMockContext(filename, sourceCode);
  const ruleImplementation = rule.create(context);
  
  try {
    // Create a mock AST node for Program
    const programNode = {
      type: 'Program',
      body: []
    };
    
    // Run the rule
    if (ruleImplementation.Program) {
      ruleImplementation.Program(programNode);
    }
    
    const violations = context._getViolations();
    
    if (violations.length > 0) {
      console.log(`❌ Found ${violations.length} violation(s):`);
      violations.forEach((v, i) => {
        console.log(`  ${i + 1}. ${v.messageId}: ${JSON.stringify(v.data)}`);
      });
    } else {
      console.log(`✅ No violations found`);
    }
    
    return violations.length > 0;
  } catch (error) {
    console.log(`🔥 Error running rule: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Testing CodeKeeper ESLint Plugin Rules\n');
  
  const fs = require('fs');
  
  // Test fixtures
  const fixtures = {
    'bad-as-casts.tsx': fs.readFileSync(path.join(__dirname, 'fixtures/bad-as-casts.tsx'), 'utf8'),
    'barrel-file/index.ts': fs.readFileSync(path.join(__dirname, 'fixtures/barrel-file/index.ts'), 'utf8'),
    'complex-file.tsx': fs.readFileSync(path.join(__dirname, 'fixtures/complex-file.tsx'), 'utf8'),
    'missing-jsdoc.ts': fs.readFileSync(path.join(__dirname, 'fixtures/missing-jsdoc.ts'), 'utf8')
  };
  
  let passed = 0;
  let total = 0;
  
  // Test no-unsafe-as-casts rule
  total++;
  if (testRule('no-unsafe-as-casts', noUnsafeAsCasts, 'test/bad-as-casts.tsx', fixtures['bad-as-casts.tsx'])) {
    passed++;
  }
  
  // Test no-barrel-files rule
  total++;
  if (testRule('no-barrel-files', noBarrelFiles, 'test-validation/fixtures/barrel-file/index.ts', fixtures['barrel-file/index.ts'])) {
    passed++;
  }
  
  // Test max-file-complexity rule
  total++;
  if (testRule('max-file-complexity', maxFileComplexity, 'test-validation/fixtures/complex-file.tsx', fixtures['complex-file.tsx'])) {
    passed++;
  }
  
  // Test require-jsdoc rule
  total++;
  if (testRule('require-jsdoc', requireJsdoc, 'test-validation/fixtures/missing-jsdoc.ts', fixtures['missing-jsdoc.ts'])) {
    passed++;
  }
  
  console.log(`\n📊 Test Results: ${passed}/${total} rules detected violations correctly`);
  
  if (passed === total) {
    console.log('✅ All ESLint rules are working correctly!');
    process.exit(0);
  } else {
    console.log('❌ Some ESLint rules may not be working as expected');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});