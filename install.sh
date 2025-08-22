#!/bin/bash

# CodeKeeper Installation Script
# This script helps you quickly set up CodeKeeper in your project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Banner
echo -e "${CYAN}"
echo "╔═══════════════════════════════════════╗"
echo "║                                       ║"
echo "║  🛡️  CodeKeeper Installation Script   ║"
echo "║  React/Next.js AI Guardrails          ║"
echo "║                                       ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# Function to print colored messages
print_step() {
    echo -e "${BLUE}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if we're in a git repository
check_git_repo() {
    if [ -d .git ]; then
        print_success "Git repository detected"
        return 0
    else
        print_warning "Not a git repository. Some features may be limited."
        return 1
    fi
}

# Detect project type
detect_project_type() {
    print_step "Detecting project type..."
    
    PROJECT_TYPE="react"
    
    if [ -f "package.json" ]; then
        if grep -q "next" package.json 2>/dev/null; then
            PROJECT_TYPE="nextjs"
            print_success "Next.js project detected"
        elif grep -q "react" package.json 2>/dev/null; then
            PROJECT_TYPE="react"
            print_success "React project detected"
        else
            print_warning "Node.js project detected. CodeKeeper is optimized for React/Next.js projects."
            PROJECT_TYPE="react"
        fi
    else
        print_error "package.json not found. CodeKeeper requires a Node.js project with React or Next.js."
        exit 1
    fi
}

# Copy validation scripts
copy_validation_scripts() {
    print_step "Copying validation scripts..."
    
    # Create scripts directory if it doesn't exist
    mkdir -p scripts/validation
    
    # Get the directory where this script is located
    SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
    
    # Copy validation scripts
    if [ -d "$SCRIPT_DIR/scripts/validation" ]; then
        cp -r "$SCRIPT_DIR/scripts/validation/"* scripts/validation/
        print_success "Validation scripts copied to scripts/validation/"
    else
        print_error "Could not find validation scripts. Please ensure you're running from the CodeKeeper directory."
        exit 1
    fi
    
    # Copy the individual validation scripts (granular approach)
    print_success "Individual validation scripts copied (granular approach)"
    print_step "Each script handles a specific concern for better debugging"
}

# Setup git hooks
setup_git_hooks() {
    if ! check_git_repo; then
        print_warning "Skipping git hooks setup (not a git repository)"
        return
    fi
    
    print_step "Setting up git hooks..."
    
    # Check if lefthook is installed
    if command -v lefthook &> /dev/null; then
        print_success "Lefthook is already installed"
    else
        print_step "Installing lefthook..."
        
        if command -v npm &> /dev/null; then
            npm install -g lefthook
            print_success "Lefthook installed via npm"
        elif command -v brew &> /dev/null; then
            brew install lefthook
            print_success "Lefthook installed via Homebrew"
        else
            print_warning "Could not install lefthook automatically. Please install it manually:"
            echo "  npm install -g lefthook"
            echo "  or"
            echo "  brew install lefthook"
            return
        fi
    fi
    
    # Copy lefthook configuration
    SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
    if [ -f "$SCRIPT_DIR/lefthook.yml" ]; then
        cp "$SCRIPT_DIR/lefthook.yml" .
        print_success "Lefthook configuration copied"
        
        # Install git hooks
        lefthook install
        print_success "Git hooks installed"
    else
        print_warning "Could not find lefthook.yml configuration"
    fi
}

# Add npm scripts
add_npm_scripts() {
    if [ ! -f "package.json" ]; then
        return
    fi
    
    print_step "Adding npm scripts..."
    
    # Check if jq is available for JSON manipulation
    if command -v jq &> /dev/null; then
        # Add validation scripts to package.json
        jq '.scripts."validate:types" = "node scripts/validation/check-as-casts.js"' package.json > tmp.json && mv tmp.json package.json
        jq '.scripts."validate:complexity" = "node scripts/validation/check-file-complexity.js"' package.json > tmp.json && mv tmp.json package.json
        jq '.scripts."validate:docs" = "node scripts/validation/check-jsdoc.js"' package.json > tmp.json && mv tmp.json package.json
        print_success "Added npm scripts for validation"
    else
        print_warning "jq not found. Please manually add these scripts to package.json:"
        echo '  "validate:types": "node scripts/validation/check-as-casts.js"'
        echo '  "validate:complexity": "node scripts/validation/check-file-complexity.js"'
        echo '  "validate:docs": "node scripts/validation/check-jsdoc.js"'
    fi
}

# Create configuration file
create_config() {
    print_step "Creating configuration file..."
    
    cat > .codekeeper.json << EOF
{
  "projectType": "${PROJECT_TYPE}",
  "rules": {
    "typeSafety": {
      "enabled": true,
      "allowedPatterns": ["as const"]
    },
    "complexity": {
      "enabled": true,
      "limits": {
        "lines": $([ "$PROJECT_TYPE" = "react" ] && echo 300 || echo 500),
        "functions": $([ "$PROJECT_TYPE" = "react" ] && echo 10 || echo 15),
        "nestingDepth": 10
      }
    },
    "imports": {
      "enabled": true,
      "preventBarrelFiles": true,
      "enforceAliases": true
    },
    "documentation": {
      "enabled": true,
      "requireJSDoc": true
    }
  }
}
EOF
    
    print_success "Configuration file created: .codekeeper.json"
}

# Test installation
test_installation() {
    print_step "Testing installation..."
    
    # Test individual validation scripts
    local test_passed=true
    
    for script in "check-as-casts.js" "check-file-complexity.js" "check-jsdoc.js"; do
        if [ -f "scripts/validation/$script" ]; then
            print_success "✓ $script found"
        else
            print_warning "✗ $script missing"
            test_passed=false
        fi
    done
    
    if [ "$test_passed" = true ]; then
        print_success "All validation scripts installed successfully"
    else
        print_warning "Some validation scripts may be missing"
    fi
}

# Main installation flow
main() {
    echo -e "${BOLD}Starting CodeKeeper installation...${NC}\n"
    
    # Check current directory
    print_step "Installing in: $(pwd)"
    echo -n "Continue? (y/n) "
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Installation cancelled."
        exit 0
    fi
    
    echo ""
    
    # Run installation steps
    detect_project_type
    copy_validation_scripts
    setup_git_hooks
    add_npm_scripts
    create_config
    test_installation
    
    # Success message
    echo ""
    echo -e "${GREEN}${BOLD}✅ CodeKeeper installation complete!${NC}"
    echo ""
    echo -e "${CYAN}Next steps:${NC}"
    echo "  1. Review the configuration in .codekeeper.json"
    echo "  2. Run validation: ${BOLD}npm run validate${NC}"
    echo "  3. Customize rules for your React/Next.js project"
    echo ""
    echo -e "${CYAN}Quick commands:${NC}"
    echo "  • npm run validate:types      - Check type safety"
    echo "  • npm run validate:complexity - Check file complexity"
    echo "  • npm run validate:docs       - Check JSDoc documentation"
    echo ""
    echo -e "${CYAN}Pro tip:${NC} Configure your editor to run validation on save!"
    echo ""
    echo -e "${YELLOW}Documentation:${NC} https://github.com/thedaviddias/codekeeper"
    echo ""
}

# Run main installation
main