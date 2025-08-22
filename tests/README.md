# CodeKeeper Testing

This directory contains comprehensive tests for all CodeKeeper validation scripts to ensure they work correctly and don't break when you make changes.

## Quick Testing

For rapid feedback during development:

```bash
# Run all tests
npm test

# Quick validation check
node tests/quick-test.js

# Test specific validation script
npm run test:as-casts
npm run test:barrel-files
npm run test:relative-imports
npm run test:jsdoc
npm run test:complexity
npm run test:structure
```

## Test Structure

### Test Fixtures (`tests/fixtures/`)

Each validation script has corresponding test fixtures with known violations:

- **`as-casts/`** - Files with good/bad TypeScript `as` cast patterns
- **`barrel-files/`** - Legitimate vs problematic barrel/index files  
- **`relative-imports/`** - Examples of deep relative imports vs proper alias usage
- **`jsdoc/`** - Files with missing vs proper JSDoc documentation
- **`complexity/`** - Simple vs overly complex files
- **`directory-structure/`** - Different project organization patterns

### Test Runner (`tests/test-runner.js`)

Comprehensive test suite that:
- ✅ Verifies scripts correctly identify violations in bad files
- ✅ Confirms scripts pass good files without false positives  
- ✅ Counts expected number of violations
- ✅ Tests all validation scripts automatically
- ✅ Provides detailed pass/fail reporting

## Adding New Tests

When you add a new validation rule or modify existing ones:

1. **Create test fixtures** in the appropriate `tests/fixtures/` directory
2. **Update test configuration** in `test-runner.js`:
   ```javascript
   'your-script-name': {
     shouldFail: ['tests/fixtures/your-test/bad-file.ts'],
     shouldPass: ['tests/fixtures/your-test/good-file.ts'],
     expectedViolations: 2, // Number of violations expected
   }
   ```
3. **Run tests** to verify everything works: `npm test`

## Continuous Integration

The test suite is designed to run in CI/CD pipelines to catch regressions:

```bash
# In your CI pipeline
npm test
# Exit code 0 = all tests pass
# Exit code 1 = some tests failed
```

## Test Coverage

Current test coverage includes:

| Validation Script | Test Status | Fixtures |
|------------------|-------------|----------|
| check-as-casts | ✅ | bad/good TypeScript casts |
| check-barrel-files | ✅ | barrel exports vs legitimate index files |
| check-relative-imports | ✅ | deep imports vs alias usage |
| check-jsdoc | ✅ | missing vs proper documentation |
| check-file-complexity | ✅ | complex vs simple files |
| check-directory-structure | ✅ | various project structures |

## Debugging Test Failures

If tests fail:

1. **Run individual tests** to isolate the issue:
   ```bash
   npm run test:as-casts
   ```

2. **Check test output** for specific violation details

3. **Verify test fixtures** still match expected patterns

4. **Update configurations** if validation rules changed

## Best Practices

- **Test both positive and negative cases** - files that should pass AND fail
- **Use realistic code examples** in test fixtures
- **Keep fixtures simple** but representative of real-world code
- **Update tests when changing validation rules**
- **Run tests before committing changes**

This ensures CodeKeeper's validation scripts remain reliable and catch the issues they're designed to prevent! 🛡️