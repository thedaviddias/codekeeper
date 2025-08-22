# ESLint Plugin CodeKeeper

AI Development Guardrails as ESLint Rules

## Installation

```bash
npm install --save-dev @thedaviddias/eslint-plugin-codekeeper
```

## Usage

Add to your `.eslintrc.js`:

```javascript
module.exports = {
  plugins: ['@thedaviddias/codekeeper'],
  extends: ['plugin:@thedaviddias/codekeeper/recommended']
};
```

## Rules

### `codekeeper/no-unsafe-as-casts`
Prevents dangerous TypeScript `as` casts that bypass type safety.

```typescript
// ❌ Bad
const user = data as User;

// ✅ Good  
const user = validateUser(data);
```

### `codekeeper/no-barrel-files`
Warns against barrel files that could harm tree-shaking.

```javascript
// ❌ Bad (barrel file with many re-exports)
export * from './component1';
export * from './component2';
export * from './component3';

// ✅ Good (direct imports)
import { Component1 } from './component1';
```

### `codekeeper/max-file-complexity`
Enforces file complexity limits (lines, functions, nesting depth).

**Options:**
- `maxLines`: Maximum lines per file (default: 500)
- `maxFunctions`: Maximum functions per file (default: 15) 
- `maxNestingDepth`: Maximum nesting depth (default: 4)

### `codekeeper/require-jsdoc`
Requires JSDoc comments for functions and classes.

**Options:**
- `requireForFunctions`: Require JSDoc for functions (default: true)
- `requireForClasses`: Require JSDoc for classes (default: true)
- `requireForComponents`: Require JSDoc for React components (default: false)

## Configurations

### `recommended`
Balanced rules for most projects:
```javascript
extends: ['plugin:@thedaviddias/codekeeper/recommended']
```

### `strict` 
Stricter rules for high-quality codebases:
```javascript
extends: ['plugin:@thedaviddias/codekeeper/strict']
```

### `react`
Optimized for React projects:
```javascript
extends: ['plugin:@thedaviddias/codekeeper/react']
```

## License

MIT