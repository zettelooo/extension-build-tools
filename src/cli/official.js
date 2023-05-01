const fs = require('fs')
const path = require('path')
const { findVersion } = require('./versioning')

const OFFICIAL_DEPENDENCY_PREFIX = '@zettelproject/'

function findOfficialDependencies(projectPath) {
  const officialDependencies = []

  const packagePath = path.join(projectPath, 'package.json')
  try {
    const package = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
    const dependencies = Object.keys(package.dependencies || {})
    dependencies.forEach(dependency => {
      if (dependency.startsWith(OFFICIAL_DEPENDENCY_PREFIX)) {
        officialDependencies.push({
          name: dependency,
          version: findVersion(package.dependencies[dependency]),
          type: 'production',
        })
      }
    })
    const devDependencies = Object.keys(package.devDependencies || {})
    devDependencies.forEach(dependency => {
      if (dependency.startsWith(OFFICIAL_DEPENDENCY_PREFIX)) {
        officialDependencies.push({
          name: dependency,
          version: findVersion(package.devDependencies[dependency]),
          type: 'development',
        })
      }
    })
  } catch {}

  const packageLockPath = path.join(projectPath, 'package-lock.json')
  try {
    const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf-8'))
    const dependencies = packageLock.dependencies || {}
    officialDependencies.forEach(officialDependency => {
      const exactVersion = dependencies[officialDependency.name]?.version
      if (exactVersion) {
        officialDependency.version = exactVersion
      }
    })
  } catch {}

  return officialDependencies
}

module.exports = {
  findOfficialDependencies,
}
