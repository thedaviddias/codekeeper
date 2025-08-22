#!/bin/bash
# Setup git commit message template

echo "🔧 Setting up git commit message template..."

# Set the commit message template
git config commit.template .gitmessage

echo "✅ Git commit message template configured!"
echo "📝 Now when you run 'git commit', you'll see the conventional commit template"
echo ""
echo "💡 Remember:"
echo "  - Use conventional commit format: type(scope): description"
echo "  - Releases are automatic when you merge to main"
echo "  - Breaking changes trigger major version bumps"
echo ""
echo "🔗 See .github/CONTRIBUTING.md for detailed guidelines"