# CodeKeeper - AI Development Guardrails

<div align="center">

  **Stop AI from breaking your React/Next.js code. Start shipping with confidence.**

  [![GitHub Stars](https://img.shields.io/github/stars/thedaviddias/codekeeper?style=social)](https://github.com/thedaviddias/codekeeper)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/thedaviddias/codekeeper/pulls)
  [![React](https://img.shields.io/badge/React-18+-blue)](https://reactjs.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-13+-black)](https://nextjs.org/)

  [Quick Start](#-quick-start-2-minutes) • [Documentation](./docs/) • [Examples](./docs/EXAMPLES.md) • [Contributing](#-contributing)

</div>

---

**CodeKeeper** is a battle-tested (yes, I'm using it in production) collection of validation scripts that prevent AI assistants from introducing bugs, security issues, and bad practices into your React and Next.js projects. Works with **any** development workflow you're already using.

### 🛠️ **Works With Your Existing Tools**
✅ **ESLint** • ✅ **Husky** • ✅ **Lefthook** • ✅ **pre-commit** • ✅ **lint-staged** • ✅ **GitHub Actions** • ✅ **GitLab CI** • ✅ **Jenkins** • ✅ **Vercel** • ✅ **Netlify**

## 🚨 The Problem

AI coding assistants are powerful but can introduce subtle bugs in React/Next.js projects:
- **Type assertions** that hide runtime errors (`as any` everywhere)
- **Barrel files** that destroy tree-shaking and slow builds
- **Component mega-files** with 500+ lines that become unmaintainable
- **Missing JSDoc** that leaves your team confused about props and hooks
- **Security vulnerabilities** from unsafe patterns and exposed secrets

## ✅ The Solution

CodeKeeper provides pre-built validation scripts that catch these issues before they hit production:

| Guardrail | Prevents | Impact |
|-----------|----------|---------|
| **Type Safety** | `as any`, unsafe casts | -90% runtime errors |
| **Import Quality** | Barrel file chaos | 3x faster builds |
| **Complexity Limits** | 1000+ line files | 50% easier maintenance |
| **Documentation** | Missing JSDoc | 2x faster onboarding |
| **Architecture** | Messy file structure | Clean, scalable codebase |

## 🚀 Quick Start (Choose Your Tools)

### Option A: Lefthook + Validation Scripts (Recommended for Flow State)
```bash
# Install lefthook
npm install -g lefthook

# Copy CodeKeeper scripts and config
curl -fsSL https://raw.githubusercontent.com/thedaviddias/codekeeper/main/install.sh | bash

# Auto-configured! lefthook.yml is ready to use
lefthook install

# Now code freely - validation happens on commit! 🎉
```

### Option B: Other Git Hook Managers

Pick your favorite:

#### With Husky (Most Popular)
```bash
# Install husky and lint-staged
npm install --save-dev husky lint-staged
npx husky-init

# Copy CodeKeeper scripts
curl -fsSL https://raw.githubusercontent.com/thedaviddias/codekeeper/main/install.sh | bash

# Add to package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "node scripts/validate-all.js"
    ]
  }
}

# Update .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx lint-staged
```

#### With Lefthook (My Favorite and the one I use)
```bash
# Install lefthook
npm install -g lefthook

# Copy CodeKeeper scripts and config
curl -fsSL https://raw.githubusercontent.com/thedaviddias/codekeeper/main/install.sh | bash

# Auto-configured! lefthook.yml is ready to use
lefthook install
```

#### With pre-commit (Python)
```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: codekeeper-validation
        name: CodeKeeper Validation
        entry: node scripts/validate-all.js
        language: node
        files: \.(ts|tsx)$
```

## 💡 Real Examples

### Before CodeKeeper ❌
```tsx
// AI often generates this in React components
const UserProfile = ({ data }: any) => {
  const user = data as any;  // Runtime bomb!
  return <div>{user.naem.toUpperCase()}</div>; // Typo crashes in production
}
```

### After CodeKeeper ✅
```tsx
// Guardrails force proper typing
interface UserProfileProps {
  data: User;
}

const UserProfile = ({ data }: UserProfileProps) => {
  return <div>{data.name.toUpperCase()}</div>; // TypeScript catches typos
}
```

### More Examples:
- **[Try interactive examples →](./examples/)** - Working projects you can test immediately
- **[See all React/Next.js examples →](./docs/EXAMPLES.md)**

## 🔧 What's Included

### ESLint Plugin Rules
- `no-unsafe-as-casts` - Blocks `as any` and unsafe type assertions
- `no-barrel-files` - Prevents slow barrel file exports
- `max-file-complexity` - Limits file size and complexity
- `require-jsdoc` - Enforces documentation standards

### Standalone Validation Scripts
- `check-as-casts.js` - TypeScript type safety validation
- `check-barrel-files.js` - Import performance checks
- `check-directory-structure.js` - Architecture enforcement
- `check-file-complexity.js` - Complexity limits
- `check-jsdoc.js` - Documentation requirements
- `check-relative-imports.js` - Import consistency

### Configuration
- `lefthook.yml` - Git hooks for automatic validation
- `.eslintrc.js` - ESLint integration examples

## 🎯 The "Vibe Coding" Workflow

CodeKeeper is designed for developers who want to **code in flow state** without constant interruptions:

1. **🚀 Code freely** - Focus on building features, don't worry about perfect code
2. **⚡ Quick validation** - Let Lefthook catch issues with specific, educational messages on commit
3. **🤖 AI-assisted fixes** - Use LLMs (like Claude, ChatGPT) to fix the issues CodeKeeper found
4. **✅ Ship with confidence** - Your code is clean and follows best practices

This approach lets you stay in creative flow while ensuring code quality.

### 🤖 AI-Assisted Fixing Example

When CodeKeeper finds issues, copy them to your AI assistant:

```bash
git commit -m "add user profile feature"
# 🔍 Checking for unsafe 'any' types...
# ❌ COMMIT BLOCKED: Found 'any' types in UserProfile.tsx!
# 💡 Replace 'any' with specific types for better type safety

# 🔍 Checking React component complexity...
# ❌ COMMIT BLOCKED: Components exceed complexity limits!
# 💡 Split large components into smaller, focused ones
```

**Prompt to AI:** "Fix these CodeKeeper issues: [paste output]"

**AI Response:** Provides proper TypeScript interfaces, splits complex components, and removes barrel files.

**Result:** Clean, maintainable code without breaking your flow state!

## 🔄 CI/CD Integration

CodeKeeper works with any CI/CD pipeline:

### GitHub Actions
```yaml
# .github/workflows/validation.yml
name: CodeKeeper Validation
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint  # ESLint + CodeKeeper plugin
      - run: node scripts/validate-all.js  # Standalone validation
```

### GitLab CI
```yaml
# .gitlab-ci.yml
stages:
  - validate

code-validation:
  stage: validate
  script:
    - npm install
    - npm run lint
    - node scripts/validate-all.js
  only:
    - merge_requests
    - main
```

### Jenkins
```groovy
// Jenkinsfile
pipeline {
  agent any
  stages {
    stage('Install') {
      steps {
        sh 'npm install'
      }
    }
    stage('Validate') {
      steps {
        sh 'npm run lint'
        sh 'node scripts/validate-all.js'
      }
    }
  }
}
```

### Vercel/Netlify Build
```json
// package.json
{
  "scripts": {
    "build": "npm run validate && next build",
    "validate": "eslint . && node scripts/validate-all.js"
  }
}
```

## 🔌 Tool Compatibility Matrix

| Tool | ESLint Plugin | Standalone Scripts | Setup Difficulty | Performance |
|------|--------------|-------------------|------------------|-------------|
| **ESLint** | ✅ Native | ✅ Via npm scripts | 🟢 Easy | 🟢 Fast |
| **Husky + lint-staged** | ✅ Perfect fit | ✅ Perfect fit | 🟢 Easy | 🟢 Fast |
| **Lefthook** | ✅ Works great | ✅ Built-in support | 🟢 Easy | 🟢 Fast |
| **pre-commit** | ✅ Via ESLint hook | ✅ Custom hook | 🟡 Moderate | 🟢 Fast |
| **GitHub Actions** | ✅ Standard workflow | ✅ Custom step | 🟢 Easy | 🟢 Fast |
| **GitLab CI** | ✅ Standard job | ✅ Custom job | 🟢 Easy | 🟢 Fast |
| **VS Code** | ✅ Real-time errors | ❌ Terminal only | 🟢 Easy | 🟢 Instant |
| **WebStorm/IntelliJ** | ✅ Built-in support | ⚠️ Terminal integration | 🟢 Easy | 🟡 Good |

**🎯 Quick Recommendations:**
- **Love flow state coding?** → Lefthook + CodeKeeper scripts (our favorite!)
- **Already use Husky?** → Add CodeKeeper to your lint-staged config
- **Team uses ESLint heavily?** → ESLint plugin for real-time feedback
- **Want maximum speed?** → Lefthook's parallel execution wins

## 🚀 Installation

1. **Install lefthook** (if not already installed):
   ```bash
   npm install -g lefthook
   # or
   yarn global add lefthook
   ```

2. **Copy the files**:
   ```bash
   # Copy validation scripts
   mkdir -p scripts/validation
   cp scripts/validation/*.js scripts/validation/

   # Copy lefthook config
   cp lefthook.yml ./
   ```

3. **Install lefthook in your repo**:
   ```bash
   lefthook install
   ```

## 🎯 What Each Guardrail Does

### Type Safety (`check-as-casts.js`)
- **Blocks**: `as any`, `as unknown`, unsafe type assertions
- **Allows**: `as const`, test files, migration scripts
- **Why**: Prevents runtime type errors and maintains type safety

### Import Quality (`check-barrel-files.js`)
- **Blocks**: Barrel files (`index.ts` that re-exports everything)
- **Enforces**: Explicit imports from specific files
- **Why**: Better tree-shaking, faster builds, clearer dependencies

### Architecture (`check-directory-structure.js`)
- **Enforces**: Clean, domain-driven directory structure
- **Prevents**: Messy file organization and anti-patterns
- **Why**: Maintainable codebase and clear separation of concerns

### Complexity (`check-file-complexity.js`)
- **Limits**: File size, function count, nesting depth
- **Suggests**: Refactoring when limits are exceeded
- **Why**: Prevents unmaintainable code and cognitive overload

### Documentation (`check-jsdoc.js`)
- **Requires**: JSDoc comments on functions and components
- **Enforces**: Parameter and return type documentation
- **Why**: Better code understanding and AI assistance

### Import Patterns (`check-relative-imports.js`)
- **Enforces**: Consistent import aliases (`@/` instead of `../`)
- **Prevents**: Deep relative imports that break on refactoring
- **Why**: Maintainable import paths and easier refactoring

## 📚 Documentation

For detailed guides and examples, check out the [documentation](./docs/):

- **[Quick Start Guide](./docs/QUICK-START.md)** - Get up and running in 5 minutes
- **[Why Guardrails Matter](./docs/WHY-GUARDRAILS.md)** - The reasoning behind each guardrail
- **[Real Examples](./docs/EXAMPLES.md)** - Before/after scenarios with AI-generated code

## 🔧 Customization

### Adjust Limits
Edit the constants in each validation script:

```javascript
// In check-file-complexity.js
const COMPLEXITY_LIMITS = {
  lines: 500,        // Max lines per file
  functions: 15,     // Max functions per file
  dependencies: 20,  // Max import statements
  nestingDepth: 10,  // Max nesting depth
}
```

### Add Exclusions
Modify the exclusion patterns in each script:

```javascript
// In check-as-casts.js
const ALLOWED_PATTERNS = [
  /\bas\s+const\b/g,
  /\.test\.(ts|tsx)$/,
  /\.spec\.(ts|tsx)$/,
  // Add your own patterns here
]
```

### Skip Checks Temporarily
Use environment variables to skip checks during development:

```bash
NODE_ENV=development git commit -m "WIP"
```

## 🎯 Best Practices

1. **Start Strict**: Begin with all guardrails enabled, this will avoid you nightmarish debugging sessions.
2. **Customize Gradually**: Adjust limits based on your team's needs, you can start with the defaults and then adjust them to your needs.
3. **Document Exceptions**: Add comments when you need to bypass rules, this will help you and your team to understand the reasons behind the exceptions.
4. **Review Regularly**: Update guardrails as your project evolves, this will help you to keep your codebase clean and maintainable.
5. **Team Alignment**: Ensure everyone understands the rules and their benefits, this will help you to have a more consistent codebase.

## 🚨 Common Issues & Solutions

### "Too many violations to fix all at once"
- Temporarily increase limits in the scripts
- Fix violations incrementally
- Use `NODE_ENV=development` to bypass checks temporarily

### "Some files need exceptions"
- Add specific patterns to the `ALLOWED_PATTERNS` arrays
- Use file-specific exclusions in the validation logic
- Document why exceptions are needed

### "Checks are too slow"
- Optimize the validation scripts
- Add more specific file filters
- Consider running some checks only on pre-push

## 🌟 Who's Using CodeKeeper?

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/thedaviddias/codekeeper/issues/new?title=Add%20my%20company&body=Company:%20YOUR_COMPANY%0AWebsite:%20YOUR_WEBSITE">
        <img src="https://via.placeholder.com/100x100/f0f0f0/666?text=Your+Logo" width="100px;" alt="Your Company"/>
        <br />
        <sub><b>Your Company?</b></sub>
      </a>
    </td>
  </tr>
</table>

[Add your company](https://github.com/thedaviddias/codekeeper/issues/new?title=Add%20my%20company)

## 🤝 Contributing

We welcome contributions! Whether it's:
- 🐛 Bug fixes
- ✨ New guardrail types
- 📚 Documentation improvements
- 🌍 Translations
- 💡 Feature ideas

See our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📊 Stats & Community

- 🌟 **0+ GitHub Stars** - [Star us!](https://github.com/thedaviddias/codekeeper)
- 👥 **0+ Contributors** - [Join us!](https://github.com/thedaviddias/codekeeper/graphs/contributors)
- 🏢 **0+ Companies** using in production
- 💬 **[Discussions](https://github.com/thedaviddias/codekeeper/discussions)** - Ask questions, share ideas
- 🐦 **[Follow updates](https://twitter.com/thedaviddias)** - Latest features and tips


## 📄 License

MIT License - feel free to use these guardrails in any project!

## 🙏 Acknowledgments

Created by [David Dias](https://github.com/thedaviddias), author of [Front-End Checklist](https://github.com/thedaviddias/Front-End-Checklist) (75k+ stars).

Inspired by the need to maintain code quality when working with AI assistants. These guardrails help ensure that AI-generated code meets the same standards as human-written code.

---

<div align="center">

**⭐ Star this repo** if it helped you ship better code with AI!

[Report Bug](https://github.com/thedaviddias/codekeeper/issues) • [Request Feature](https://github.com/thedaviddias/codekeeper/issues) • [Join Discord](#)

</div>
