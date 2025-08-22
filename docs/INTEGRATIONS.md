# CodeKeeper Integration Guide

CodeKeeper works with **any** development workflow. Choose the setup that matches your current tools.

## 📋 Quick Setup Checklist

- [ ] Choose ESLint plugin OR standalone scripts (or both)
- [ ] Pick your git hook manager (Husky, Lefthook, pre-commit)
- [ ] Configure CI/CD pipeline
- [ ] Set up editor integration
- [ ] Test with a sample commit

## 🔧 ESLint Integration

### Basic Setup
```bash
npm install --save-dev eslint-plugin-codekeeper
```

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['codekeeper'],
  extends: ['plugin:codekeeper/react'],
  rules: {
    'codekeeper/no-unsafe-as-casts': 'error',
    'codekeeper/max-file-complexity': 'warn',
  }
}
```

### With TypeScript
```javascript
// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'codekeeper'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:codekeeper/react'
  ],
  rules: {
    'codekeeper/no-unsafe-as-casts': 'error',
    'codekeeper/require-jsdoc': ['warn', { requireForComponents: true }]
  }
}
```

### VS Code Integration
```json
// .vscode/settings.json
{
  "eslint.validate": ["typescript", "typescriptreact"],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.workingDirectories": ["."]
}
```

## 🪝 Git Hook Integrations

### 1. Husky + lint-staged (Most Popular)

```bash
# Install dependencies
npm install --save-dev husky lint-staged
npx husky-init

# Configure package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "node scripts/validate-all.js --staged"
    ],
    "*.{js,jsx,ts,tsx,json,css,md}": [
      "prettier --write"
    ]
  }
}

# Update .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx lint-staged
```

#### Advanced Husky Setup
```bash
# Different hooks for different validation levels
echo "npx lint-staged" > .husky/pre-commit
echo "npm run test" > .husky/pre-push
echo "node scripts/validate-all.js --all" > .husky/pre-push
```

### 2. Lefthook (Fast & Simple)

```bash
npm install -g lefthook
```

```yaml
# lefthook.yml
pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{ts,tsx}"
      run: eslint --fix {staged_files}
    validate:
      glob: "*.{ts,tsx}"
      run: node scripts/validate-all.js {staged_files}
    prettier:
      glob: "*.{ts,tsx,json,css,md}"
      run: prettier --write {staged_files}

pre-push:
  commands:
    test:
      run: npm test
    full-validation:
      run: node scripts/validate-all.js --all
```

```bash
lefthook install
```

### 3. pre-commit (Python)

```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: eslint
        name: ESLint
        entry: npx eslint --fix
        language: node
        files: \.(ts|tsx)$
        
      - id: codekeeper
        name: CodeKeeper Validation
        entry: node scripts/validate-all.js
        language: node
        files: \.(ts|tsx)$
        
      - repo: https://github.com/pre-commit/mirrors-prettier
        rev: v3.0.0
        hooks:
          - id: prettier
```

```bash
pip install pre-commit
pre-commit install
```

### 4. simple-git-hooks (Lightweight)

```bash
npm install --save-dev simple-git-hooks
```

```json
// package.json
{
  "simple-git-hooks": {
    "pre-commit": "npm run lint && node scripts/validate-all.js"
  },
  "scripts": {
    "postinstall": "simple-git-hooks"
  }
}
```

## 🚀 CI/CD Integrations

### GitHub Actions

#### Basic Validation
```yaml
# .github/workflows/validation.yml
name: Code Validation
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Run CodeKeeper validation
        run: node scripts/validate-all.js --all
      
      - name: Run tests
        run: npm test
```

#### Advanced with Matrix
```yaml
name: Comprehensive Validation
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: node scripts/validate-all.js --all --verbose
      - run: npm run build
      - run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        if: matrix.node-version == '18'
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - validate
  - test
  - build

variables:
  NODE_VERSION: "18"

cache:
  paths:
    - node_modules/

before_script:
  - npm ci

lint:
  stage: validate
  script:
    - npm run lint
    - node scripts/validate-all.js --all
  only:
    - merge_requests
    - main

test:
  stage: test
  script:
    - npm test -- --coverage
  coverage: '/Statements\s*:\s*(\d+\.\d+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
```

### Jenkins

```groovy
// Jenkinsfile
pipeline {
    agent any
    
    tools {
        nodejs "18"
    }
    
    environment {
        NODE_ENV = 'test'
    }
    
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Lint & Validate') {
            parallel {
                stage('ESLint') {
                    steps {
                        sh 'npm run lint'
                    }
                }
                stage('CodeKeeper') {
                    steps {
                        sh 'node scripts/validate-all.js --all --verbose'
                    }
                }
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test -- --coverage'
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        failure {
            emailext (
                subject: "Build Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: "Build failed. Check Jenkins for details.",
                to: "${env.CHANGE_AUTHOR_EMAIL}"
            )
        }
    }
}
```

### Azure DevOps

```yaml
# azure-pipelines.yml
trigger:
  branches:
    include:
      - main
      - develop

pr:
  branches:
    include:
      - main

pool:
  vmImage: 'ubuntu-latest'

variables:
  nodeVersion: '18'

stages:
- stage: Validate
  jobs:
  - job: LintAndValidate
    steps:
    - task: NodeTool@0
      inputs:
        versionSpec: $(nodeVersion)
      displayName: 'Install Node.js'
    
    - script: npm ci
      displayName: 'Install dependencies'
    
    - script: npm run lint
      displayName: 'Run ESLint'
    
    - script: node scripts/validate-all.js --all
      displayName: 'Run CodeKeeper validation'
    
    - script: npm test -- --coverage
      displayName: 'Run tests'
    
    - script: npm run build
      displayName: 'Build application'

- stage: Deploy
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
  jobs:
  - deployment: DeployToProduction
    environment: 'production'
    strategy:
      runOnce:
        deploy:
          steps:
          - script: echo "Deploy to production"
```

## 📱 Editor Integrations

### VS Code

#### Extensions
```json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

#### Settings
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "typescript.preferences.includePackageJsonAutoImports": "off"
}
```

#### Tasks
```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "CodeKeeper: Validate All",
      "type": "shell",
      "command": "node scripts/validate-all.js --all --verbose",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    }
  ]
}
```

### WebStorm/IntelliJ

#### ESLint Configuration
1. Go to **Settings** → **Languages & Frameworks** → **JavaScript** → **Code Quality Tools** → **ESLint**
2. Check **Automatic ESLint configuration**
3. Set **Run eslint --fix on save**

#### External Tools
1. Go to **Settings** → **Tools** → **External Tools**
2. Click **+** to add new tool:
   - **Name**: CodeKeeper Validation
   - **Program**: node
   - **Arguments**: scripts/validate-all.js --all
   - **Working directory**: $ProjectFileDir$

## 🔄 Workflow Examples

### Small Team Setup
```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build", 
    "lint": "eslint . --fix",
    "validate": "node scripts/validate-all.js --all",
    "pre-commit": "lint-staged"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "node scripts/validate-all.js"]
  }
}
```

### Enterprise Setup
```json
// package.json  
{
  "scripts": {
    "dev": "next dev",
    "build": "npm run validate:all && next build",
    "lint": "eslint . --fix --max-warnings 0",
    "lint:ci": "eslint . --format json --output-file eslint-report.json",
    "validate": "node scripts/validate-all.js",
    "validate:all": "node scripts/validate-all.js --all --verbose",
    "validate:ci": "node scripts/validate-all.js --all --reporter json",
    "test": "jest --coverage",
    "test:ci": "jest --coverage --ci --watchAll=false",
    "pre-commit": "lint-staged",
    "prepare": "husky install"
  }
}
```

## 🐛 Troubleshooting

### Common Issues

#### ESLint plugin not found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Make sure plugin is in dependencies
npm install --save-dev eslint-plugin-codekeeper
```

#### Git hooks not running
```bash
# For Husky
npx husky install
chmod +x .husky/pre-commit

# For Lefthook
lefthook install

# Check git config
git config core.hooksPath
```

#### Validation failing on CI but passing locally
```bash
# Ensure same Node version
node --version

# Check file line endings (Windows/Unix)
git config core.autocrlf false

# Run exact same command locally
node scripts/validate-all.js --all --verbose
```

## 📞 Getting Help

- **Issues**: [GitHub Issues](https://github.com/thedaviddias/codekeeper/issues)
- **Discussions**: [GitHub Discussions](https://github.com/thedaviddias/codekeeper/discussions)
- **Examples**: Check our [examples repository](https://github.com/thedaviddias/codekeeper-examples)

---

**💡 Pro Tip**: Start with ESLint plugin + Husky for the best developer experience, then add CI/CD validation for team enforcement.