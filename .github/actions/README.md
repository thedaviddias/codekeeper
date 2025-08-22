# CodeKeeper Composite Actions

This directory contains reusable composite actions that standardize the CI/CD workflows for CodeKeeper.

## 🧩 Available Actions

### `setup-node`

Sets up Node.js environment with optimized caching for CodeKeeper projects.

**Inputs:**
- `install-dependencies` (default: `'true'`): Whether to install npm dependencies
- `cache-key-suffix` (default: `''`): Additional suffix for cache key

**Outputs:**
- `node-version`: The Node.js version that was installed
- `cache-hit`: Whether npm cache was hit

**Features:**
- ✅ Uses `.nvmrc` for consistent Node.js version
- ✅ Multi-layer caching (npm cache + node_modules)
- ✅ Cache key includes package files for optimal invalidation
- ✅ Offline-first installation with `--prefer-offline`
- ✅ Skip audit for faster installs

**Usage:**
```yaml
- name: Setup Node.js with CodeKeeper
  uses: ./.github/actions/setup-node
  with:
    install-dependencies: 'true'
    cache-key-suffix: '-${{ matrix.node-version }}'
```

### `run-validation-tests`

Runs comprehensive validation tests for CodeKeeper scripts with result tracking.

**Inputs:**
- `test-type` (default: `'full'`): Type of tests (`full`, `quick`, or `individual`)
- `specific-script` (default: `''`): Specific script to test (for individual testing)
- `upload-results` (default: `'false'`): Whether to upload test results as artifacts

**Outputs:**
- `test-results`: Summary of test results
- `tests-passed`: Whether all tests passed

**Features:**
- ✅ Supports multiple test types (full suite, quick tests, individual scripts)
- ✅ Captures test output for debugging
- ✅ Uploads test artifacts when requested
- ✅ Generates comprehensive test summaries
- ✅ Proper error handling and reporting

**Usage:**
```yaml
- name: Run comprehensive validation tests
  uses: ./.github/actions/run-validation-tests
  with:
    test-type: 'full'
    upload-results: 'true'
```

### `validate-scripts`

Validates syntax, permissions, and integrity of validation scripts.

**Inputs:**
- `check-syntax` (default: `'true'`): Whether to check JavaScript syntax
- `check-permissions` (default: `'true'`): Whether to check and fix file permissions
- `check-configuration` (default: `'true'`): Whether to validate configuration sections

**Outputs:**
- `validation-results`: Results of script validation
- `issues-found`: Number of issues found

**Features:**
- ✅ JavaScript syntax validation with `node -c`
- ✅ Automatic permission fixing for executable scripts
- ✅ Configuration section presence validation
- ✅ Script completeness verification
- ✅ npm script consistency checking

**Usage:**
```yaml
- name: Validate all scripts
  uses: ./.github/actions/validate-scripts
  with:
    check-syntax: 'true'
    check-permissions: 'true'
    check-configuration: 'true'
```

## 🎯 Benefits of Composite Actions

### **Consistency**
- Same setup across all workflows
- Standardized caching strategy
- Consistent error handling

### **Maintainability**
- Single place to update common logic
- Easier to add new features
- Reduced workflow duplication

### **Performance**
- Optimized caching reduces setup time
- Multi-layer cache strategy
- Parallel test execution

### **Reliability**
- Comprehensive error handling
- Proper output capture
- Consistent test reporting

## 🔧 Development

### Adding a New Action

1. Create a new directory under `.github/actions/`
2. Add an `action.yml` file with the action definition
3. Use `composite` actions with shell scripts
4. Follow the naming convention and documentation style

### Testing Actions Locally

```bash
# Test the Node.js setup
act -j test-primary

# Test specific workflow
act -j validate-scripts-integrity
```

### Cache Strategy

Our caching strategy uses multiple layers:

1. **npm cache**: Global npm cache directory
2. **node_modules**: Project dependencies
3. **Cache keys**: Include package files for proper invalidation

This ensures:
- Fast installs on cache hits
- Proper cache invalidation when dependencies change
- Minimal network usage in CI

## 📊 Cache Performance

Typical cache hit rates:
- **Cold start** (no cache): ~2-3 minutes setup
- **Warm cache** (deps cached): ~30-60 seconds setup
- **Hot cache** (full hit): ~10-20 seconds setup

This significantly reduces CI runtime and costs! 🚀