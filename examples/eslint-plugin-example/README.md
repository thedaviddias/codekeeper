# ESLint Plugin Only Example

This example shows **CodeKeeper as a pure ESLint plugin** - perfect for developers who want real-time IDE validation without git hooks.

## 🚀 Quick Test

```bash
# Install dependencies  
npm install

# See real-time errors in VS Code
code .  # Open in VS Code and check the Problems panel

# Run ESLint from command line
npm run lint

# Run individual validation checks
npm run validate:types
npm run validate:complexity

# Auto-fix with ESLint
npm run lint
```

## 💡 Why ESLint Plugin Only?

Perfect for teams that want:
- **Real-time IDE feedback** - See errors as you type
- **Existing ESLint workflow** - No new tools to learn
- **No git hook complexity** - Simple setup, just ESLint
- **Individual developer control** - Everyone can configure their own workflow
- **CI/CD integration** - Standard ESLint patterns work everywhere

## 🛠️ What's Included

### ESLint Plugin Features
- **Real-time validation** - Instant feedback in IDE
- **Auto-fix support** - `eslint --fix` handles simple issues
- **Customizable rules** - Standard ESLint configuration
- **IDE integration** - Works with VS Code, WebStorm, Vim, etc.
- **CI/CD ready** - Standard ESLint commands

### CodeKeeper Rules Available
```javascript
// .eslintrc.js
module.exports = {
  plugins: ['codekeeper'],
  rules: {
    'codekeeper/no-unsafe-as-casts': 'error',      // Blocks 'as any'
    'codekeeper/no-barrel-files': 'warn',          // Prevents barrel exports
    'codekeeper/max-file-complexity': 'warn',      // Limits file complexity
    'codekeeper/require-jsdoc': 'warn',           // Enforces documentation
    'codekeeper/no-deep-imports': 'warn',         // Prevents deep relative imports
    'codekeeper/react-component-size': 'warn',    // Limits component size
  }
}
```

## 📁 Project Structure

```
eslint-plugin-example/
├── src/
│   ├── components/
│   │   ├── ProblematicComponent.tsx  # ❌ Multiple ESLint errors
│   │   └── CleanComponent.tsx        # ✅ Follows all rules
│   ├── utils/
│   │   ├── unsafe-utils.ts           # ❌ Type safety issues  
│   │   └── safe-utils.ts             # ✅ Proper typing
│   └── App.tsx
├── .eslintrc.js                     # ESLint + CodeKeeper config
├── .vscode/
│   └── settings.json               # VS Code integration
└── package.json
```

## 🐛 Problems Caught by ESLint Plugin

### 1. Real-time `as any` Detection
```tsx
// ❌ You'll see a red squiggly line immediately
const user = data as any;  // ESLint error: Unsafe type assertion

// ❌ IDE shows: "Type assertion 'as any' is unsafe and should be avoided"
const result = response.json() as any;
```

### 2. Barrel File Detection  
```tsx
// ❌ src/components/index.ts
export * from './Button';     // ESLint warning: Barrel file detected
export * from './Modal';      // This pattern prevents tree-shaking
export * from './Card';
```

### 3. Component Complexity Warnings
```tsx
// ❌ IDE will highlight the component name
const HugeComponent = () => {  // ESLint warning: Component exceeds complexity limits
  const [state1, setState1] = useState();
  const [state2, setState2] = useState();
  // ... 50+ lines of state and logic
  
  return (
    <div>
      {/* 200+ lines of JSX */}
    </div>
  );
}; // ESLint: Consider splitting into smaller components
```

### 4. Missing JSDoc Documentation
```tsx
// ❌ IDE warning on component definition
const UserProfile = ({ user, onUpdate }) => {  // ESLint warning: Missing JSDoc
  return <div>{user.name}</div>;
};
```

## ✅ Real-time Fixes

### Auto-fix with `eslint --fix`
Some issues can be automatically fixed:

```bash
npm run lint -- --fix
```

**Auto-fixable:**
- Missing semicolons
- Unused imports
- Basic formatting issues
- Some TypeScript issues

**Manual fixes required:**
- `as any` → proper types
- Complex component splitting
- JSDoc documentation
- Barrel file refactoring

### IDE Integration Examples

#### VS Code
1. **Install ESLint extension**
2. **Real-time errors** appear as you type
3. **Quick fixes** available with Ctrl+. (Cmd+.)
4. **Auto-fix on save** configurable

**VS Code Settings:**
```json
// .vscode/settings.json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact", 
    "typescript",
    "typescriptreact"
  ]
}
```

#### WebStorm/IntelliJ
1. **ESLint auto-configuration** detected
2. **Inline error highlighting**
3. **Quick fix suggestions** via Alt+Enter
4. **Batch fix** for entire project

#### Vim/Neovim
```lua
-- With ALE plugin
let g:ale_linters = {
\   'typescript': ['eslint'],
\   'typescriptreact': ['eslint'],
\}
let g:ale_fixers = {
\   'typescript': ['eslint'],
\   'typescriptreact': ['eslint'],
\}
```

## 🧪 Testing the Setup

### Step 1: IDE Integration Test
1. Open `src/components/ProblematicComponent.tsx` in your IDE
2. You should see immediate red underlines for:
   - `as any` type assertions
   - Missing JSDoc comments
   - Complexity warnings

### Step 2: Command Line Test
```bash
npm run lint
```
Output:
```
/src/components/ProblematicComponent.tsx
  3:23  error    Type assertion 'as any' is unsafe    codekeeper/no-unsafe-as-casts
  5:1   warning  Missing JSDoc comment                codekeeper/require-jsdoc
  12:1  warning  Component exceeds complexity limits   codekeeper/max-file-complexity

/src/components/index.ts
  1:1   warning  Barrel file detected                 codekeeper/no-barrel-files
  
✖ 4 problems (1 error, 3 warnings)
```

### Step 3: Auto-fix Test
```bash
npm run lint -- --fix
```
Some issues get fixed automatically, others remain for manual fixing.

### Step 4: CI/CD Test
```bash
# This is how it works in CI
npm run lint -- --max-warnings 0
```
Exits with error code if any warnings/errors found.

## ⚙️ Configuration Options

### Basic Configuration
```javascript
// .eslintrc.js
module.exports = {
  plugins: ['codekeeper'],
  extends: ['plugin:codekeeper/recommended'],
  rules: {
    // All CodeKeeper rules with default settings
  }
}
```

### React-specific Configuration  
```javascript
module.exports = {
  plugins: ['codekeeper'],
  extends: ['plugin:codekeeper/react'],
  rules: {
    'codekeeper/react-component-size': ['warn', {
      maxLines: 200,
      maxFunctions: 8
    }]
  }
}
```

### Custom Rule Configuration
```javascript
module.exports = {
  plugins: ['codekeeper'], 
  rules: {
    'codekeeper/no-unsafe-as-casts': 'error',
    'codekeeper/no-barrel-files': 'warn',
    'codekeeper/max-file-complexity': ['warn', {
      maxLines: 300,
      maxFunctions: 12,
      maxComplexity: 15
    }],
    'codekeeper/require-jsdoc': ['warn', {
      requireForComponents: true,
      requireForHooks: false,
      requireForUtils: true
    }]
  }
}
```

### Per-file Overrides
```javascript
module.exports = {
  plugins: ['codekeeper'],
  extends: ['plugin:codekeeper/recommended'],
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx'],
      rules: {
        'codekeeper/no-unsafe-as-casts': 'off', // Allow in tests
        'codekeeper/require-jsdoc': 'off'        // Skip JSDoc in tests
      }
    },
    {
      files: ['src/components/**/*.tsx'],
      rules: {
        'codekeeper/react-component-size': ['error', { maxLines: 150 }]
      }
    }
  ]
}
```

## 📊 Comparison: ESLint Plugin vs Other Setups

| Feature | ESLint Plugin | + Git Hooks | + CI/CD |
|---------|--------------|-------------|---------|
| **Real-time IDE feedback** | ✅ | ✅ | ❌ |
| **Blocks problematic commits** | ❌ | ✅ | ✅ |
| **Team consistency** | ⚠️ Individual choice | ✅ Enforced | ✅ Enforced |
| **Setup complexity** | 🟢 Simple | 🟡 Moderate | 🟡 Moderate |  
| **Performance** | 🟢 Fast | 🟡 Commit delay | 🔴 Build delay |

## 🚀 Migration Path

### From Standalone Scripts
```javascript
// Replace this in package.json:
"scripts": {
  "validate": "node scripts/validate-all.js"
}

// With this:
"scripts": {
  "lint": "eslint . --ext .ts,.tsx"
}
```

### To Git Hooks Later
Easy to add Husky later:
```bash
npm install --save-dev husky lint-staged
npx husky-init

# .husky/pre-commit
npx lint-staged

# package.json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix"]
}
```

### To CI/CD Integration
```yaml
# .github/workflows/ci.yml
- name: Lint with CodeKeeper
  run: npm run lint -- --max-warnings 0
```

## 🎯 Best Practices

### 1. Start with Recommended Config
```javascript
module.exports = {
  extends: ['plugin:codekeeper/recommended'],
  // Add customizations gradually
}
```

### 2. Use IDE Auto-fix on Save
```json
// VS Code
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### 3. Customize Gradually
Start strict, then relax rules that don't fit your team:
```javascript
rules: {
  'codekeeper/max-file-complexity': ['warn', { maxLines: 500 }], // Increased limit
  'codekeeper/require-jsdoc': 'off' // Disabled for now
}
```

### 4. Document Your Rules
```javascript
// .eslintrc.js
module.exports = {
  rules: {
    // Block unsafe type assertions (prevents runtime errors)
    'codekeeper/no-unsafe-as-casts': 'error',
    
    // Warn about barrel files (performance impact)
    'codekeeper/no-barrel-files': 'warn',
    
    // Component size limits (maintainability)
    'codekeeper/react-component-size': ['warn', { maxLines: 300 }]
  }
}
```

## 🤝 Team Adoption

### Individual Developer Benefits
- **Immediate feedback** - Catch issues while coding
- **Learning tool** - Understand React/TypeScript best practices  
- **Productivity** - Auto-fix saves time
- **Code quality** - Consistent patterns

### Team Benefits
- **Consistent style** - Everyone uses same rules
- **Reduced review time** - Fewer basic issues in PRs
- **Knowledge sharing** - Rules encode team standards
- **Gradual improvement** - Incrementally raise quality bar

---

**This example shows how CodeKeeper integrates seamlessly with existing ESLint workflows for immediate developer productivity gains!**