# 📋 CodeKeeper: Adding New Validation Rules Checklist

## 🎯 Overview

This checklist ensures complete integration of new validation rules across CodeKeeper's dual architecture (standalone scripts + ESLint plugin).

---

## 📝 Phase 1: Core Implementation

### ✅ 1.1 Create Shared Validator Library

**File:** `lib/validators/{rule-name}.js`
- Export validation patterns/configurations
- Export main validation function that returns `{ violations, skipped, reason }`
- Include framework-specific checks (Next.js, React, etc.)
- Add proper JSDoc documentation

Example structure:
```javascript
module.exports = {
  PATTERNS,
  EXCLUDE_PATHS,
  findViolations,
  checkFrameworkConfig
}
```

### ✅ 1.2 Create Standalone Validation Script

**File:** `scripts/validation/check-{rule-name}.js`
- Add shebang line: `#!/usr/bin/env node`
- Include comprehensive file header with description
- Add configuration section:
```javascript
// ============================================================================
// CONFIGURATION - Customize these settings for your project
// ============================================================================
```
- Import shared validator from `../../lib/validators/{rule-name}.js`
- Implement file discovery logic
- Add colored console output with proper exit codes
- Include helpful suggestions in error messages
- Export functions for testing: `module.exports = { ... }`
- Add conditional execution: `if (require.main === module) { main() }`
- Make executable: `chmod +x scripts/validation/check-{rule-name}.js`

---

## 🧪 Phase 2: Test Infrastructure

### ✅ 2.1 Create Test Fixtures

**Directory:** `tests/fixtures/{rule-name}/`
- File: `bad-{rule-name}.{ext}` - Contains violations (fails validation)
- File: `good-{rule-name}.{ext}` - No violations (passes validation)
- Include realistic, representative code examples
- Cover edge cases and allowed patterns

### ✅ 2.2 Update Test Runner

**File:** `tests/test-runner.js`
- Add new test configuration to TESTS object:
```javascript
'check-{rule-name}': {
  shouldFail: ['tests/fixtures/{rule-name}/bad-{rule-name}.{ext}'],
  shouldPass: ['tests/fixtures/{rule-name}/good-{rule-name}.{ext}'],
  expectedViolations: N, // Number of violations in bad file
}
```

### ✅ 2.3 Add npm Test Script

**File:** `package.json`
- Add script: `"test:{rule-name}": "node scripts/validation/check-{rule-name}.js tests/fixtures/{rule-name}/bad-{rule-name}.{ext}"`
- Verify script works: `npm run test:{rule-name}`

---

## 🔌 Phase 3: ESLint Plugin Integration

### ✅ 3.1 Create ESLint Rule

**File:** `eslint-plugin-codekeeper/rules/{rule-name}.js`
- Import shared validator: `require('../lib/validators/{rule-name}')`
- Define rule metadata (type, docs, schema, messages)
- Implement `create(context)` function
- Handle framework-specific logic (Next.js detection, etc.)
- Use proper ESLint context methods (`getSourceCode()`, `getFilename()`)
- Report violations with `context.report()`

### ✅ 3.2 Update ESLint Plugin Index

**File:** `eslint-plugin-codekeeper/index.js`
- Import new rule: `const {ruleName} = require('./rules/{rule-name}')`
- Add to rules object: `'{rule-name}': {ruleName}`
- Add to recommended config with appropriate severity
- Add to strict config (usually 'error')
- Add to react config with framework-specific options

### ✅ 3.3 Sync Validator to ESLint Plugin

**Command:** `cp lib/validators/{rule-name}.js eslint-plugin-codekeeper/lib/validators/`
- Copy shared validator to ESLint plugin directory
- Verify paths resolve correctly

### ✅ 3.4 Update ESLint Plugin Tests

**File:** `test-validation/test-eslint-plugin.js`
- Import rule: `const {ruleName} = require('../eslint-plugin-codekeeper/rules/{rule-name}')`
- Add fixture: `'{rule-name}.{ext}': fs.readFileSync(path.join(__dirname, '../tests/fixtures/{rule-name}/bad-{rule-name}.{ext}'), 'utf8')`
- Add test case:
```javascript
total++;
if (testRule('{rule-name}', {ruleName}, 'tests/fixtures/{rule-name}/bad-{rule-name}.{ext}', fixtures['{rule-name}.{ext}'])) {
  passed++;
}
```

---

## ⚙️ Phase 4: GitHub Actions Integration

### ✅ 4.1 Update Composite Actions

**File:** `.github/actions/run-validation-tests/action.yml`
- Add `"test:{rule-name}"` to SCRIPTS array in comprehensive validation step

### ✅ 4.2 Update Script Validation

**File:** `.github/actions/validate-scripts/action.yml`
- Add `"check-{rule-name}.js"` to EXPECTED_SCRIPTS array

---

## 📚 Phase 5: Documentation Updates

### ✅ 5.1 Update Main README

**File:** `README.md`

#### 5.1.1 Available Scripts Section

- Add new script to the validation scripts table:

| Script | Purpose | Example |
|--------|---------|---------|
| `check-{rule-name}.js` | Brief description of what it validates | `node scripts/validation/check-{rule-name}.js` |

#### 5.1.2 Usage Examples Section

- Add standalone usage example:

### {Rule Name} Validation
```bash
# Check specific file
node scripts/validation/check-{rule-name}.js src/components/MyComponent.tsx

# Check all files
node scripts/validation/check-{rule-name}.js --all
```

#### 5.1.3 ESLint Plugin Rules Section

- Add rule to the ESLint rules table:

| Rule | Description | Severity | Fixable |
|------|-------------|----------|---------|
| `codekeeper/{rule-name}` | Brief description | warn/error | ❌/✅ |

#### 5.1.4 Configuration Examples

- Add ESLint configuration example:
```javascript
// .eslintrc.js
module.exports = {
  plugins: ['@thedaviddias/codekeeper'],
  rules: {
    'codekeeper/{rule-name}': ['warn', {
      // rule-specific options
    }]
  }
}
```

#### 5.1.5 Rule-Specific Documentation

- Add detailed section for the new rule:

## {Rule Name} Validation

### What it catches
- Brief bullet points of violations detected

### Why it matters
- Explanation of the problem this solves
- Impact on code quality/performance/maintainability

### Examples

#### ❌ Bad (will fail validation)
```typescript
// Example of code that violates the rule
```

#### ✅ Good (will pass validation)
```typescript
// Example of compliant code
```

### Configuration Options

- Document any customizable options
- Include default values

### Framework-Specific Behavior

- Next.js considerations (if applicable)
- React-specific handling (if applicable)
- Other framework notes

### ✅ 5.2 Update ESLint Plugin README

**File:** `eslint-plugin-codekeeper/README.md`
- Add rule to rules list with description
- Include configuration examples
- Add to configuration presets documentation
- Update rule count in overview section

### ✅ 5.3 Update Example Project READMEs

**Files:** `examples/*/README.md`
- Add new script to available commands
- Include integration examples
- Update any relevant setup instructions

---

## 🔍 Phase 6: Validation & Testing

### ✅ 6.1 Syntax & Structure Validation

- Syntax check: `node -c scripts/validation/check-{rule-name}.js`
- Configuration section: `grep -q "CONFIGURATION.*Customize these settings" scripts/validation/check-{rule-name}.js`
- Executable permission: `ls -la scripts/validation/check-{rule-name}.js` (should show x permission)
- npm script exists: `grep -q "test:{rule-name}" package.json`

### ✅ 6.2 Functional Testing

- Standalone script with bad file: `npm run test:{rule-name}` (should exit with code 1)
- Standalone script with good file: `node scripts/validation/check-{rule-name}.js tests/fixtures/{rule-name}/good-{rule-name}.{ext}` (should exit with code 0)
- Test runner: `npm test` (should include new rule and pass)
- ESLint plugin: `node test-validation/test-eslint-plugin.js` (should detect violations)

### ✅ 6.3 Integration Testing

- CI validation: All GitHub Actions composite actions work
- Script discovery: New script appears in validation workflows
- ESLint configs: Rule appears in recommended/strict/react presets
- Documentation: Rule behavior matches expected patterns

### ✅ 6.4 Documentation Quality Check

- Links work: All internal documentation links are valid
- Examples run: Code examples in README can be executed
- Consistency: Terminology and formatting match existing docs
- Completeness: All major use cases are documented

---

## 📚 Phase 7: Example Project Updates

### ✅ 7.1 Update Example Projects

**Directories:** `examples/nextjs-lefthook-example/`, `examples/react-husky-example/`
- Scripts will be auto-synced by GitHub Actions workflow
- Verify examples work after sync: check CI workflows

### ✅ 7.2 Configuration Documentation

- Document rule options in ESLint plugin README
- Add usage examples for different severity levels
- Include framework-specific configuration notes

---

## 🚀 Phase 8: Release Preparation

### ✅ 8.1 Version Management

- Use conventional commit: `feat: add {rule-name} validation`
- Describe feature benefits and use cases
- Include breaking changes if any

### ✅ 8.2 Release Validation

- Validators sync: Ensure sync-validators.yml will trigger correctly
- ESLint plugin: Rule included in automatic publishing
- Examples sync: Auto-sync workflows include new script

### ✅ 8.3 Release Notes

- Changelog: Ensure rule is documented in release notes
- Migration guide: Include any breaking changes or migration steps
- Feature highlights: Emphasize key benefits and use cases

---

## 🎯 Quick Reference: Files to Update

| Phase   | File                                                   | Action                                       |
|---------|--------------------------------------------------------|----------------------------------------------|
| Core    | lib/validators/{rule-name}.js                          | Create shared validator                      |
| Core    | scripts/validation/check-{rule-name}.js                | Create standalone script                     |
| Test    | tests/fixtures/{rule-name}/bad-{rule-name}.{ext}       | Create violation test case                   |
| Test    | tests/fixtures/{rule-name}/good-{rule-name}.{ext}      | Create passing test case                     |
| Test    | tests/test-runner.js                                   | Add test configuration                       |
| Test    | package.json                                           | Add npm test script                          |
| ESLint  | eslint-plugin-codekeeper/rules/{rule-name}.js          | Create ESLint rule                           |
| ESLint  | eslint-plugin-codekeeper/index.js                      | Register rule & configs                      |
| ESLint  | eslint-plugin-codekeeper/lib/validators/{rule-name}.js | Copy shared validator                        |
| ESLint  | test-validation/test-eslint-plugin.js                  | Add ESLint test                              |
| CI      | .github/actions/run-validation-tests/action.yml        | Add to test scripts                          |
| CI      | .github/actions/validate-scripts/action.yml            | Add to expected scripts                      |
| 📚 Docs | README.md                                              | Add rule documentation, examples, and configuration |
| 📚 Docs | eslint-plugin-codekeeper/README.md                     | Add ESLint-specific docs                     |
| 📚 Docs | examples/*/README.md                                   | Update example documentation                 |

---

## 💡 Pro Tips

1. **Start with test fixtures** - Write your bad/good examples first to clarify expected behavior
2. **Use existing patterns** - Copy structure from check-as-casts.js for consistency
3. **Test early and often** - Run npm test after each major step
4. **Framework awareness** - Consider Next.js, React, and other framework-specific behaviors
5. **Error messages matter** - Provide actionable suggestions, not just "violation found"
6. **Conventional commits** - Use feat: prefix to trigger minor version bump in release-please
7. **📝 Documentation first** - Write the README sections before implementing to clarify the feature scope
8. **🔗 Cross-reference examples** - Ensure code examples in docs actually work with your implementation
9. **🎯 User perspective** - Write documentation from the user's perspective, not the implementer's

## 📚 Documentation Template Examples

### README Section Template:

## {Rule Name} Validation

### What it catches
- List of specific violations
- Edge cases handled
- Framework-specific behaviors

### Why it matters
Brief explanation of the problem and its impact.

### Examples

#### ❌ Bad (will fail validation)
```typescript
// Code that violates the rule
```

#### ✅ Good (will pass validation)
```typescript
// Compliant code
```

### Configuration Options

- option1: Description (default: value)
- option2: Description (default: value)

### Framework Integration

- Next.js: Automatic detection of removeConsole configuration
- React: Component-specific validation rules

---

This comprehensive checklist ensures your new validation rule is fully integrated, tested, and documented across the entire CodeKeeper ecosystem! 🎉