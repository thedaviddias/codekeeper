#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const EXPECTED_STRUCTURE = {
  app: {
    required: true,
    subdirs: ['(public)', '(protected)', 'api'],
    pattern: /^(\(.*\)|api|.*\.tsx?|.*\.css)$/,
    description: 'App router pages and API routes',
  },
  components: {
    required: true,
    subdirs: [
      'ui',
      'domain',
      'features',
      'layouts',
      'forms',
      'feedback',
      'navigation',
      'visualization',
      'media',
      'templates',
      'interactions',
      'accessibility',
      'responsive',
      'state',
    ],
    pattern:
      /^(ui|domain|features|layouts|forms|feedback|navigation|visualization|media|templates|interactions|accessibility|responsive|state|.*\.tsx?)$/,
    description: 'Domain-based UI components architecture',
  },
  features: {
    required: false,
    pattern: /^[a-z-]+$/,
    description: 'Feature-specific modules',
    validateSubdir: (dir) => {
      const expectedFeatureDirs = ['api', 'queries', 'schemas', 'components']
      const hasValidStructure = expectedFeatureDirs.some((expected) =>
        fs.existsSync(path.join('features', dir, expected)),
      )
      return hasValidStructure || fs.readdirSync(path.join('features', dir)).length === 0
    },
  },
  lib: {
    required: true,
    subdirs: [
      'core',
      'features',
      'services',
      'types',
      'infrastructure',
      'patterns',
      'utilities',
      'algorithms',
      'workflows',
      'bridges',
      'shared',
    ],
    pattern:
      /^(core|features|services|types|infrastructure|patterns|utilities|algorithms|workflows|bridges|shared|.*\.ts)$/,
    description: 'Domain-based shared libraries and utilities',
  },
  hooks: {
    required: true,
    subdirs: ['api', 'auth', 'data', 'ui'],
    pattern: /^(api|auth|data|ui|use-[a-z-]+\.ts|index\.ts)$/,
    description: 'Categorized custom React hooks',
  },
  tests: {
    required: true,
    subdirs: ['mocks', 'utils'],
    pattern: /^(mocks|utils|.*\.test\.tsx?)$/,
    description: 'Test utilities and mocks',
  },
  scripts: {
    required: false,
    subdirs: ['validation'],
    pattern: /^(validation|.*\.js)$/,
    description: 'Build and validation scripts',
  },
  styles: {
    required: false,
    pattern: /^.*\.(css|scss)$/,
    description: 'Global styles',
  },
}

const FORBIDDEN_PATTERNS = [
  {
    pattern: /^src$/,
    message: 'Use App Router structure instead of src/ directory',
  },
  {
    pattern: /^pages$/,
    message: 'Use App Router (app/) instead of Pages Router',
  },
  {
    pattern: /^temp$|^tmp$|^backup$/,
    message: 'Temporary directories should not be committed',
  },
]

function checkForbiddenDirectories() {
  const violations = []
  const rootDirs = fs.readdirSync('.')

  FORBIDDEN_PATTERNS.forEach(({ pattern, message }) => {
    rootDirs.forEach((dir) => {
      if (pattern.test(dir) && fs.statSync(dir).isDirectory()) {
        violations.push({ dir, message })
      }
    })
  })

  return violations
}

function validateDirectoryContents(dir, config) {
  const violations = []

  if (!fs.existsSync(dir)) {
    if (config.required) {
      violations.push({
        type: 'missing',
        dir,
        message: `Required directory missing: ${config.description}`,
      })
    }
    return violations
  }

  const contents = fs.readdirSync(dir)

  // Check for required subdirectories
  if (config.subdirs) {
    config.subdirs.forEach((subdir) => {
      if (!contents.includes(subdir)) {
        violations.push({
          type: 'structure',
          dir: `${dir}/${subdir}`,
          message: `Missing expected subdirectory`,
        })
      }
    })
  }

  // Validate naming patterns
  if (config.pattern) {
    contents.forEach((item) => {
      const itemPath = path.join(dir, item)
      const isDirectory = fs.statSync(itemPath).isDirectory()

      // Skip validation for directories if we have subdirs defined
      if (isDirectory && config.subdirs && config.subdirs.includes(item)) {
        return
      }

      // Skip hidden files and common config files
      if (item.startsWith('.') || item === 'package.json' || item === 'README.md') {
        return
      }

      if (!config.pattern.test(item)) {
        violations.push({
          type: 'naming',
          dir: `${dir}/${item}`,
          message: `Invalid naming pattern (expected: ${config.pattern})`,
        })
      }
    })
  }

  // Custom validation for feature directories
  if (config.validateSubdir) {
    const subdirs = contents.filter((item) => fs.statSync(path.join(dir, item)).isDirectory())

    subdirs.forEach((subdir) => {
      if (!config.validateSubdir(subdir)) {
        violations.push({
          type: 'structure',
          dir: `${dir}/${subdir}`,
          message:
            'Feature directory missing expected structure (api, queries, schemas, or components)',
        })
      }
    })
  }

  return violations
}

function checkForMisplacedFiles() {
  const violations = []

  // Check for TypeScript files in root (except config files)
  const rootFiles = fs.readdirSync('.')
  const suspiciousRootFiles = rootFiles.filter(
    (file) =>
      (file.endsWith('.tsx') || file.endsWith('.ts')) &&
      !['next.config.mjs', 'jest.setup.ts', 'next-env.d.ts'].includes(file) &&
      !file.includes('config'),
  )

  suspiciousRootFiles.forEach((file) => {
    violations.push({
      type: 'misplaced',
      file,
      message: 'Source files should not be in the root directory',
    })
  })

  // Check for components outside of components directory
  const checkForComponents = (dir, currentPath = '') => {
    if (!fs.existsSync(dir) || dir === 'components' || dir === 'node_modules') return

    const contents = fs.readdirSync(dir)
    contents.forEach((item) => {
      const fullPath = path.join(dir, item)
      const relativePath = currentPath ? `${currentPath}/${item}` : item

      if (fs.statSync(fullPath).isFile()) {
        // Check if file looks like a component (PascalCase .tsx files)
        if (item.match(/^[A-Z].*\.tsx$/) && !dir.includes('components')) {
          violations.push({
            type: 'misplaced',
            file: relativePath,
            message: 'Component files should be in the components directory',
          })
        }
      } else if (fs.statSync(fullPath).isDirectory() && !item.startsWith('.')) {
        checkForComponents(fullPath, relativePath)
      }
    })
  }

  // Skip checking in app directory as it can have page components
  ;['lib', 'hooks'].forEach((dir) => checkForComponents(dir))

  return violations
}

function main() {
  console.log('📁 Validating project structure...\n')

  let hasViolations = false
  const allViolations = []

  // Check forbidden directories
  const forbidden = checkForbiddenDirectories()
  if (forbidden.length > 0) {
    hasViolations = true
    allViolations.push({ type: 'forbidden', violations: forbidden })
  }

  // Validate expected structure
  Object.entries(EXPECTED_STRUCTURE).forEach(([dir, config]) => {
    const violations = validateDirectoryContents(dir, config)
    if (violations.length > 0) {
      hasViolations = true
      allViolations.push({ type: 'structure', dir, violations })
    }
  })

  // Check for misplaced files
  const misplaced = checkForMisplacedFiles()
  if (misplaced.length > 0) {
    hasViolations = true
    allViolations.push({ type: 'misplaced', violations: misplaced })
  }

  // Exclude generated types from structure violations
  allViolations.forEach((group) => {
    if (group.type === 'structure') {
      group.violations = group.violations.filter(
        (v) => !String(v.dir).startsWith('lib/types/generated'),
      )
    }
  })

  // Exclude generated types from structure violations
  allViolations.forEach((group) => {
    if (group.type === 'structure') {
      group.violations = group.violations.filter(
        (v) => !String(v.dir).startsWith('lib/types/generated'),
      )
    }
  })

  // Report violations
  if (hasViolations) {
    console.log('❌ Directory structure violations found:\n')

    // Forbidden directories
    const forbiddenViolations = allViolations.find((v) => v.type === 'forbidden')
    if (forbiddenViolations) {
      console.log('🚫 Forbidden directories:')
      forbiddenViolations.violations.forEach(({ dir, message }) => {
        console.log(`  - ${dir}: ${message}`)
      })
      console.log()
    }

    // Structure violations
    allViolations
      .filter((v) => v.type === 'structure')
      .forEach(({ dir, violations }) => {
        console.log(`📁 ${dir}:`)
        violations.forEach((v) => {
          console.log(`  - ${v.dir}: ${v.message}`)
        })
        console.log()
      })

    // Misplaced files
    const misplacedViolations = allViolations.find((v) => v.type === 'misplaced')
    if (misplacedViolations) {
      console.log('📍 Misplaced files:')
      misplacedViolations.violations.forEach(({ file, message }) => {
        console.log(`  - ${file}: ${message}`)
      })
      console.log()
    }

    console.log('💡 Fix directory structure violations before committing')

    if (process.env.NODE_ENV !== 'development') {
      process.exit(1)
    }
  } else {
    console.log('✅ Project structure is valid')
  }

  process.exit(0)
}

main()
