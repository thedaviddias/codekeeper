# Contributing to CodeKeeper

First off, thank you for considering contributing to CodeKeeper! It's people like you that make CodeKeeper such a great tool for the developer community.

## 🎯 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (code snippets, error messages)
- **Describe the behavior you observed vs expected**
- **Include your environment details** (OS, Node version, etc.)

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful** to most users
- **List some examples** of how it would be used

### 🔧 Adding New Guardrails

Want to add a new validation rule? We have a comprehensive guide that covers the entire process!

📚 **[See the Complete Guide for Adding New Validation Rules](../docs/CONTRIBUTING-NEW-RULES.md)**

This guide covers:
- Creating shared validators and standalone scripts
- Setting up test infrastructure
- ESLint plugin integration
- GitHub Actions configuration
- Documentation requirements
- Example templates and best practices

For a quick overview:
1. **Create the validation script** in `scripts/validation/`
2. **Follow the existing pattern** from other validation scripts
3. **Add tests** for your guardrail
4. **Update the documentation** in README.md
5. **Add examples** in docs/EXAMPLES.md

### 📝 Improving Documentation

Documentation improvements are always welcome! This includes:

- Fixing typos or clarifying language
- Adding examples or use cases
- Translating documentation to other languages
- Improving the structure or navigation

## 🚀 Pull Request Process

1. **Fork the repo** and create your branch from `main`
2. **Make your changes** and ensure they follow our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Submit a pull request** with a clear description

### PR Checklist

- [ ] My code follows the existing code style
- [ ] I have tested my changes
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added examples if applicable

## 💻 Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/codekeeper.git
cd codekeeper

# Install dependencies
npm install

# Run tests
npm test

# Test your changes in a real project
cp scripts/validation/*.js ../your-test-project/scripts/validation/
```

## 🎨 Code Style

- Use **2 spaces** for indentation
- Use **single quotes** for strings
- Add **JSDoc comments** for functions
- Keep functions **small and focused**
- Write **descriptive variable names**

## 🏷️ Commit Message Guidelines

We follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add Python type checking guardrail
fix: improve barrel file detection accuracy
docs: add React setup guide
```

## 🌟 Recognition

Contributors are recognized in our:
- [Contributors page](https://github.com/thedaviddias/codekeeper/graphs/contributors)
- README.md acknowledgments
- Release notes

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity, level of experience, nationality, personal appearance, race, religion, or sexual identity.

### Our Standards

- **Be respectful** of differing viewpoints
- **Accept constructive criticism** gracefully
- **Focus on what's best** for the community
- **Show empathy** towards others

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team. All complaints will be reviewed and investigated.

## 🤝 Getting Help

- **Discord**: [Join our community](#) (coming soon)
- **Discussions**: [GitHub Discussions](https://github.com/thedaviddias/codekeeper/discussions)
- **Twitter**: [@thedaviddias](https://twitter.com/thedaviddias)

## 📚 Resources

- [Project Roadmap](https://github.com/thedaviddias/codekeeper/projects)
- [Open Issues](https://github.com/thedaviddias/codekeeper/issues)
- [Documentation](./docs/)

---

**Thank you for contributing to CodeKeeper!** 🚀