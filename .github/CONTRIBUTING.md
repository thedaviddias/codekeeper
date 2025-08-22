# Contributing to CodeKeeper

Thank you for your interest in contributing to CodeKeeper! This guide will help you understand our development process and contribution guidelines.

## 🚀 Automated Releases

We use automated releases with [release-please](https://github.com/googleapis/release-please) and conventional commits. When you merge a PR to `main`, releases are created automatically based on your commit messages.

## 📝 Conventional Commits

We use [Conventional Commits](https://www.conventionalcommits.org/) to automatically generate changelogs and determine version bumps.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature (triggers minor version bump)
- **fix**: A bug fix (triggers patch version bump)
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance (triggers minor version bump)
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Breaking Changes

To trigger a major version bump, add `BREAKING CHANGE:` in the commit footer or add `!` after the type:

```bash
feat!: remove support for Node.js 16

BREAKING CHANGE: Node.js 18+ is now required
```

### Examples

```bash
# New feature (minor bump)
feat: add new TypeScript interface validation

# Bug fix (patch bump)
fix: correct regex pattern in AS casts detection

# Documentation update (patch bump)  
docs: update installation instructions

# Breaking change (major bump)
feat!: update validation API to use async functions

BREAKING CHANGE: All validation functions now return promises
```

### Scopes (Optional)

You can add scopes to provide more context:

- `scripts`: Changes to validation scripts
- `eslint`: Changes to ESLint plugin
- `examples`: Changes to example projects
- `ci`: Changes to GitHub Actions
- `docs`: Changes to documentation

Examples:
```bash
feat(scripts): add new barrel file detection patterns
fix(eslint): correct rule loading in plugin
docs(examples): add Next.js integration example
```

## 🔄 Release Process

### What Happens When You Merge a PR:

1. **Commit Analysis**: Release-please analyzes conventional commits since the last release
2. **Version Calculation**: Determines version bump based on commit types
3. **Changelog Generation**: Creates changelog from commit messages
4. **Release Creation**: Creates GitHub releases for both main project and ESLint plugin
5. **Package Publishing**: Publishes ESLint plugin to GitHub Packages
6. **Asset Creation**: Creates downloadable release assets

### Two-Package Release Strategy:

- **Main Project** (`codekeeper-guardrails`): Contains validation scripts, examples, docs
- **ESLint Plugin** (`@thedaviddias/eslint-plugin-codekeeper`): Contains ESLint rules

Both packages are versioned independently but released together when relevant.

## 🛠️ Development Workflow

### Setting Up

1. **Clone the repository**
   ```bash
   git clone https://github.com/thedaviddias/codekeeper.git
   cd codekeeper
   ```

2. **Install dependencies**
   ```bash
   npm ci
   ```

3. **Install git hooks**
   ```bash
   npm run guardrails:setup
   ```

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes**
   - Edit validation scripts in `scripts/validation/`
   - Update shared validators in `lib/validators/` if needed
   - Add/update tests in `test-validation/`
   - Update examples if relevant

3. **Test your changes**
   ```bash
   npm test
   node test-validation/test-eslint-plugin.js
   ```

4. **Commit with conventional commit message**
   ```bash
   git add .
   git commit -m "feat: add new validation rule for components"
   ```

5. **Push and create PR**
   ```bash
   git push origin feat/your-feature-name
   ```

### Keeping Validators in Sync

If you modify `lib/validators/`, the ESLint plugin validators will be automatically synced:
- During PR validation
- Before ESLint plugin releases
- Via automated sync workflow

## 🧪 Testing

### Running Tests

```bash
# Run all validation tests
npm test

# Test ESLint plugin specifically
node test-validation/test-eslint-plugin.js

# Test individual validation scripts
npm run test:as-casts
npm run test:barrel-files
npm run test:jsdoc
npm run test:complexity
```

### Adding Tests

When adding new validation rules:

1. **Create test fixtures** in `test-validation/fixtures/`
2. **Add tests** to existing test files or create new ones
3. **Update ESLint plugin tests** if you modify validators
4. **Test both approaches** (standalone scripts + ESLint plugin)

## 📋 Pull Request Guidelines

### PR Title

Use conventional commit format for PR titles:
```
feat: add new TypeScript validation rule
fix: correct barrel file detection regex
docs: update installation instructions
```

### PR Description

Include:
- **What**: What changes you made
- **Why**: Why you made these changes  
- **How**: How you implemented the changes
- **Testing**: What testing you performed
- **Breaking Changes**: Any breaking changes (if applicable)

### PR Checklist

- [ ] Follows conventional commit format
- [ ] Tests pass locally (`npm test`)
- [ ] ESLint plugin tests pass (`node test-validation/test-eslint-plugin.js`)
- [ ] Documentation updated (if needed)
- [ ] Examples updated (if needed)
- [ ] Backward compatibility maintained (or breaking change noted)

## 🎯 Release Types

### When Releases Are Created:

- **feat**: New features → Minor version bump (1.0.0 → 1.1.0)
- **fix**: Bug fixes → Patch version bump (1.0.0 → 1.0.1)
- **feat!** or **BREAKING CHANGE**: → Major version bump (1.0.0 → 2.0.0)
- **docs, style, refactor, test, etc.**: → Patch version bump

### Release Artifacts:

**Main Project Release:**
- GitHub release with changelog
- Downloadable `.tar.gz` with all scripts and examples
- Installation script for easy setup

**ESLint Plugin Release:**  
- Published to GitHub Packages
- GitHub release with installation instructions
- Synchronized with latest validation logic

## 🔍 Code Review Process

1. **Automated Checks**: PR validation runs automatically
2. **Manual Review**: Maintainers review code and approach
3. **Testing**: Changes are tested in various scenarios
4. **Approval**: Once approved, PR can be merged
5. **Automatic Release**: Merging triggers release process

## 💡 Tips

### Writing Good Commit Messages:
- Use imperative mood ("add" not "added")
- Keep first line under 50 characters
- Reference issues when relevant
- Explain the "why" in the body

### Contributing Guidelines:
- Keep changes focused and atomic
- Update tests for any logic changes
- Maintain backward compatibility when possible
- Follow existing code style and patterns

### Getting Help:
- Check existing issues and discussions
- Ask questions in PR comments
- Review existing code for patterns and conventions

## 🙏 Thank You

Your contributions help make CodeKeeper better for everyone using AI-assisted development. Every improvement, bug fix, and piece of feedback is valued!

---

**Happy Contributing! 🚀**