# CodeKeeper Examples

Test CodeKeeper with different tool combinations using these mini projects. Each example is a working React/Next.js app with intentional "AI-generated" problems that CodeKeeper will catch.

## 🚀 Quick Test

```bash
# Clone any example
git clone https://github.com/thedaviddias/codekeeper.git
cd codekeeper/examples/react-husky-example

# Install and test
npm install
npm run test-codekeeper

# Try to commit the problematic code
git add .
git commit -m "test commit"  # This will fail with CodeKeeper errors!
```

## 📁 Available Examples

### 1. **React + Husky + lint-staged**
📂 `react-husky-example/`
- **Tools**: Husky, lint-staged, ESLint, CodeKeeper
- **Features**: Pre-commit hooks, staged file validation
- **Best for**: Most React teams, industry standard setup

### 2. **Next.js + Lefthook**  
📂 `nextjs-lefthook-example/`
- **Tools**: Lefthook, ESLint, CodeKeeper
- **Features**: Fast parallel validation, YAML config
- **Best for**: Performance-focused teams, simple setup

### 3. **ESLint Plugin Only**
📂 `eslint-plugin-example/`
- **Tools**: ESLint + CodeKeeper plugin
- **Features**: Real-time IDE validation, no git hooks
- **Best for**: Developer experience focused, existing ESLint users

### 4. **Standalone Scripts**
📂 `standalone-scripts-example/`  
- **Tools**: Pure CodeKeeper validation scripts
- **Features**: Independent validation, custom workflows
- **Best for**: Custom build processes, CI/CD only

### 5. **GitHub Actions CI**
📂 `github-actions-example/`
- **Tools**: GitHub Actions, CodeKeeper, automated checks
- **Features**: PR validation, CI/CD integration
- **Best for**: Open source projects, automated workflows

### 6. **Full Stack (All Tools)**
📂 `full-stack-example/`
- **Tools**: ESLint plugin + Husky + GitHub Actions
- **Features**: Complete workflow from development to CI
- **Best for**: Enterprise teams, maximum protection

## 🎯 What Each Example Includes

### Problematic Code Samples
Each example contains intentional problems that AI often creates:

```tsx
// ❌ This will be caught by CodeKeeper
const UserComponent = ({ data }: any) => {
  const user = data as any;  // Unsafe type assertion
  
  // Missing JSDoc, component too complex
  const [state1, setState1] = useState();
  const [state2, setState2] = useState(); 
  const [state3, setState3] = useState();
  // ... 20+ lines of complex logic
  
  return <div>{user.naem.toUpperCase()}</div>; // Typo will crash
}

// ❌ Barrel file that breaks tree-shaking  
export * from './components';
export * from './hooks';
export * from './utils';
```

### Working Solutions
And the corrected versions:

```tsx  
// ✅ CodeKeeper enforces this pattern
interface UserData {
  name: string;
}

interface UserComponentProps {
  data: UserData;
}

/**
 * Displays user information
 * @param data - User data object
 */
const UserComponent = ({ data }: UserComponentProps) => {
  return <div>{data.name.toUpperCase()}</div>;
}

// ✅ Direct imports for better tree-shaking
import { Button } from './components/Button';
import { useAuth } from './hooks/useAuth';
```

## 🧪 Testing Instructions

### For Each Example:

1. **Setup**
   ```bash
   cd examples/[example-name]
   npm install
   ```

2. **See the problems**
   ```bash
   npm run lint  # Shows ESLint + CodeKeeper errors
   npm run validate  # Shows standalone validation errors
   ```

3. **Test git hooks** (if applicable)
   ```bash
   git add .
   git commit -m "test"  # Should fail with validation errors
   ```

4. **Fix the problems**
   ```bash
   npm run fix  # Auto-fixes what can be fixed
   # Manually fix the rest following the suggestions
   ```

5. **Verify success**
   ```bash
   git add .
   git commit -m "fixed issues"  # Should succeed
   ```

## 📊 Comparison Matrix

| Example | Setup Time | IDE Integration | Git Hooks | CI/CD | Learning Curve |
|---------|------------|----------------|-----------|--------|----------------|
| **React + Husky** | 🟡 5 min | ✅ | ✅ | ✅ | 🟢 Easy |
| **Next.js + Lefthook** | 🟢 2 min | ✅ | ✅ | ✅ | 🟢 Easy |
| **ESLint Plugin** | 🟢 1 min | ✅ | ❌ | ✅ | 🟢 Easy |
| **Standalone Scripts** | 🟡 3 min | ❌ | ⚠️ Manual | ✅ | 🟡 Moderate |
| **GitHub Actions** | 🟢 2 min | ❌ | ❌ | ✅ | 🟢 Easy |
| **Full Stack** | 🔴 10 min | ✅ | ✅ | ✅ | 🟡 Moderate |

## 🎮 Interactive Demo

Want to try before installing? Use our online demos:

- **[CodeSandbox Demo](https://codesandbox.io/s/codekeeper-demo)** - ESLint plugin in action
- **[Stackblitz Demo](https://stackblitz.com/edit/codekeeper-next)** - Next.js with validation
- **[GitHub Codespaces](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=thedaviddias/codekeeper)** - Full development environment

## 🏃‍♂️ Quick Start Script

Don't want to choose? Let our script pick the best example for you:

```bash
curl -fsSL https://raw.githubusercontent.com/thedaviddias/codekeeper/main/examples/quick-start.sh | bash
```

This script will:
1. Detect your current project setup
2. Recommend the best CodeKeeper example
3. Set up a test project
4. Guide you through testing

## 📝 Creating Your Own Example

Want to contribute an example for a different tool combination?

1. **Copy the template**
   ```bash
   cp -r examples/_template examples/your-example-name
   ```

2. **Customize the setup** - Add your preferred tools
3. **Add problematic code** - Include common AI-generated issues  
4. **Test the validation** - Ensure CodeKeeper catches the problems
5. **Document the workflow** - Update the README
6. **Submit a PR** - Share with the community!

## 🎯 Example Templates

### Minimal Template Structure
```
example-name/
├── package.json          # Dependencies and scripts
├── README.md            # Setup and testing instructions  
├── src/
│   ├── components/
│   │   ├── BadComponent.tsx    # Problematic AI-generated code
│   │   └── GoodComponent.tsx   # Fixed version
│   ├── utils/
│   │   └── problematic-utils.ts
│   └── App.tsx
├── .eslintrc.js         # ESLint + CodeKeeper config
├── .gitignore
└── validation-config/   # CodeKeeper scripts and configs
    ├── lefthook.yml
    ├── .husky/
    └── scripts/
```

## 🤝 Contributing Examples

We welcome new examples! Especially for:
- **Different frameworks** (Vue, Angular, Svelte)
- **Build tools** (Vite, Webpack, Parcel)
- **Deployment platforms** (Vercel, Netlify, AWS)
- **Testing frameworks** (Jest, Vitest, Cypress)
- **Monorepo setups** (Lerna, Nx, Rush)

See our [Contributing Guide](../CONTRIBUTING.md) for details.

---

**🚀 Get Started**: Pick an example that matches your current setup and see CodeKeeper in action in under 5 minutes!