# React + Husky + CodeKeeper Example

This example shows CodeKeeper working with the most popular React setup: **Husky + lint-staged + ESLint**.

## 🚀 Quick Test

```bash
# Install dependencies
npm install

# See the problems CodeKeeper catches
npm run demo:problems

# Try to commit (will fail with validation errors)
git add .
git commit -m "test commit"

# Fix the problems and commit successfully  
npm run demo:fix
git add .
git commit -m "fixed with CodeKeeper"
```

## 🛠️ What's Included

### Tools Setup
- **React 18** - Modern React with TypeScript
- **Husky** - Git hooks management
- **lint-staged** - Run checks only on staged files
- **ESLint** - JavaScript/TypeScript linting
- **CodeKeeper** - AI guardrails and validation
- **Prettier** - Code formatting

### Validation Pipeline
1. **Pre-commit hook** → Runs on every commit
2. **lint-staged** → Only checks staged files (fast!)
3. **ESLint --fix** → Auto-fixes what it can
4. **CodeKeeper validation** → Catches AI-generated problems
5. **Prettier** → Formats code consistently

## 📁 Project Structure

```
react-husky-example/
├── src/
│   ├── components/
│   │   ├── BadComponent.tsx      # ❌ Problematic AI code
│   │   ├── GoodComponent.tsx     # ✅ Fixed version  
│   │   └── BarrelExport.ts       # ❌ Performance killer
│   ├── utils/
│   │   └── unsafe-utils.ts       # ❌ Type safety issues
│   └── App.tsx
├── scripts/
│   └── validation/               # CodeKeeper scripts
├── .husky/
│   └── pre-commit               # Git hook configuration
├── .eslintrc.js                # ESLint + CodeKeeper rules
└── package.json                # Scripts and dependencies
```

## 🐛 Problems This Example Catches

### 1. Unsafe Type Assertions (`BadComponent.tsx`)
```tsx
// ❌ AI often generates this
const BadComponent = ({ data }: any) => {
  const user = data as any;  // Runtime bomb!
  return <div>{user.naem.toUpperCase()}</div>; // Typo crashes
}
```

**CodeKeeper Error:**
```
❌ Unsafe type assertion 'as any' detected
   File: src/components/BadComponent.tsx:3
   Use proper TypeScript interfaces instead
```

### 2. Barrel Files (`BarrelExport.ts`)
```tsx  
// ❌ Destroys tree-shaking and build performance
export * from './BadComponent';
export * from './GoodComponent'; 
export * from './AnotherComponent';
// ... exports everything, bundle includes unused code
```

**CodeKeeper Error:**
```
❌ Barrel file detected: BarrelExport.ts
   This pattern prevents tree-shaking
   Use direct imports for better performance
```

### 3. Component Complexity (`BadComponent.tsx`)
```tsx
// ❌ AI creates mega-components
const BadComponent = () => {
  // 50+ lines of state
  const [state1, setState1] = useState();
  const [state2, setState2] = useState(); 
  // ... 20 more useState hooks
  
  // 30+ lines of useEffect hooks
  useEffect(() => { /* complex logic */ }, []);
  useEffect(() => { /* more logic */ }, []);
  
  // 300+ lines of JSX
  return (
    <div>
      {/* deeply nested components */}
    </div>
  );
}
```

**CodeKeeper Error:**
```
❌ File exceeds complexity limits:
   - Lines: 387 (max: 300)  
   - Functions: 12 (max: 10)
   - useState hooks: 23 (recommended: <8)
   
   Consider splitting into smaller components
```

### 4. Missing Documentation
```tsx
// ❌ No JSDoc, unclear props
const MyComponent = ({ data, onUpdate, isVisible }) => {
  return <div>...</div>;
}
```

**CodeKeeper Error:**
```
❌ Missing JSDoc documentation
   File: src/components/BadComponent.tsx:1
   Add component and props documentation
```

## ✅ How to Fix

### 1. Replace `as any` with Proper Types
```tsx
// ✅ Define proper interfaces
interface UserData {
  name: string;
  email: string;
}

interface UserComponentProps {
  data: UserData;
}

const UserComponent = ({ data }: UserComponentProps) => {
  return <div>{data.name.toUpperCase()}</div>;
}
```

### 2. Use Direct Imports
```tsx
// ✅ Import directly for better tree-shaking
import { UserComponent } from './components/UserComponent';
import { Button } from './components/Button';
```

### 3. Split Complex Components
```tsx
// ✅ Extract hooks
const useUserData = () => {
  const [user, setUser] = useState<UserData | null>(null);
  // Hook logic here
  return { user, setUser };
}

// ✅ Extract sub-components  
const UserProfile = ({ user }: { user: UserData }) => {
  return <div>{user.name}</div>;
}

// ✅ Main component stays focused
const UserDashboard = () => {
  const { user } = useUserData();
  return user ? <UserProfile user={user} /> : <div>Loading...</div>;
}
```

### 4. Add JSDoc Documentation
```tsx
/**
 * User component that displays user information
 * @param data - User data object containing name and email
 * @param onUpdate - Callback function when user data is updated
 * @param isVisible - Whether the component should be visible
 */
const UserComponent = ({ 
  data, 
  onUpdate, 
  isVisible 
}: UserComponentProps) => {
  return <div>...</div>;
}
```

## 🧪 Testing the Setup

### Step 1: See the Problems
```bash
npm run demo:problems
```
You'll see output like:
```
❌ ESLint found 12 issues:
  - 5 TypeScript errors
  - 4 React hooks violations
  - 3 unused variables

❌ Type safety check failed:
  - 3 unsafe 'as any' assertions in BadComponent.tsx

❌ Complexity check failed:
  - BadComponent.tsx exceeds 300 line limit (387 lines)
  - Too many functions in single component (12 max: 10)
```

### Step 2: Try to Commit (Will Fail)
```bash
git add .
git commit -m "test commit"
```
Output:
```
husky - pre-commit hook running...
❌ lint-staged failed:
  - ESLint: 12 errors
  - Type assertions check: 3 errors  
  - Complexity check: 2 errors
  
Commit blocked! Fix the issues and try again.
```

### Step 3: Auto-fix What's Possible
```bash
npm run demo:fix
```
This will:
- Fix ESLint auto-fixable issues
- Add basic JSDoc templates
- Remove some unused code
- Format with Prettier

### Step 4: Manual Fixes
Some issues need manual fixes:
- Replace `as any` with proper types
- Split complex components
- Remove barrel files
- Add meaningful documentation

### Step 5: Successful Commit
```bash  
git add .
git commit -m "fixed CodeKeeper issues"
```
Output:
```
husky - pre-commit hook running...
✅ ESLint: No issues found
✅ CodeKeeper: All validations passed
✅ Prettier: Code formatted

[main abc1234] fixed CodeKeeper issues
 8 files changed, 45 insertions(+), 23 deletions(-)
```

## 🎯 Learning Outcomes

After testing this example, you'll understand:

1. **How Husky integrates** with your React workflow
2. **Why lint-staged is crucial** for performance (only checks changed files)
3. **How CodeKeeper catches** AI-generated anti-patterns
4. **The fix workflow** from problem detection to resolution
5. **How to customize rules** for your team's needs

## 🔧 Customization

### Adjust CodeKeeper Rules
Edit `scripts/validation/check-file-complexity.js`:
```javascript
const REACT_LIMITS = {
  lines: 200,        // Stricter limit for components
  functions: 8,      // Fewer methods per component  
  hooks: 6,          // Limit useState/useEffect count
}
```

### Modify ESLint Integration
Edit `.eslintrc.js`:
```javascript
module.exports = {
  // Your current ESLint config
  rules: {
    // Add CodeKeeper-specific overrides
    'react-hooks/exhaustive-deps': 'warn', // AI often misses deps
    '@typescript-eslint/no-explicit-any': 'error', // Block 'any'
  }
}
```

### Change Git Hook Behavior
Edit `.husky/pre-commit`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run only on staging
npx lint-staged

# Or run full validation
# npm run validate:all
```

## 📊 Performance

This setup is optimized for speed:
- **lint-staged**: Only validates changed files
- **ESLint cache**: Reuses previous results  
- **Parallel execution**: Husky runs checks concurrently
- **Incremental**: Fast feedback loop

Typical commit time: **2-5 seconds** (vs 30+ seconds without optimization)

## 🚀 Next Steps

1. **Copy to your project**: Use this as a template
2. **Customize the rules**: Adjust limits for your team
3. **Add more checks**: Include testing, security scans
4. **Train your team**: Share the validation workflow
5. **Iterate**: Refine rules based on common issues

## 🤝 Contribute

Found issues or have improvements? 
- [Open an issue](https://github.com/thedaviddias/codekeeper/issues)
- [Submit a PR](https://github.com/thedaviddias/codekeeper/pulls)
- [Share your setup](https://github.com/thedaviddias/codekeeper/discussions)

---

**This example shows the gold standard React + CodeKeeper setup used by thousands of teams worldwide!**