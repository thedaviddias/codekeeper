#!/usr/bin/env node

/**
 * Check Node.js version compatibility with CodeKeeper
 */

const fs = require('fs')
const path = require('path')

function checkNodeVersion() {
  const currentVersion = process.version
  const currentMajor = parseInt(currentVersion.slice(1).split('.')[0])
  
  console.log('🔍 Node.js Version Check')
  console.log('========================')
  console.log(`Current Node.js version: ${currentVersion}`)
  
  // Read .nvmrc if it exists
  const nvmrcPath = path.join(__dirname, '..', '.nvmrc')
  if (fs.existsSync(nvmrcPath)) {
    const recommendedVersion = fs.readFileSync(nvmrcPath, 'utf8').trim()
    console.log(`Recommended version (.nvmrc): v${recommendedVersion}`)
  }
  
  // Check engines in package.json
  const packagePath = path.join(__dirname, '..', 'package.json')
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    if (packageJson.engines && packageJson.engines.node) {
      console.log(`Required version (package.json): ${packageJson.engines.node}`)
    }
  }
  
  console.log()
  
  // Version compatibility check
  if (currentMajor < 18) {
    console.log('❌ Node.js version is too old!')
    console.log('   CodeKeeper requires Node.js 18.0.0 or higher')
    console.log('   Please update Node.js for optimal compatibility')
    process.exit(1)
  } else if (currentMajor >= 18 && currentMajor <= 22) {
    console.log('✅ Node.js version is compatible!')
  } else {
    console.log('⚠️  Node.js version is newer than tested versions')
    console.log('   CodeKeeper should work but hasn\'t been tested with this version')
  }
  
  console.log()
  console.log('📋 Version Info:')
  console.log(`   Node.js: ${process.version}`)
  console.log(`   npm: v${process.env.npm_version || 'unknown'}`)
  console.log(`   Platform: ${process.platform}`)
  console.log(`   Architecture: ${process.arch}`)
}

if (require.main === module) {
  checkNodeVersion()
}

module.exports = { checkNodeVersion }