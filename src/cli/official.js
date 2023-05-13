const fs = require('fs')
const path = require('path')
const { findVersion } = require('./versioning')

const OFFICIAL_DEPENDENCIES_PREFIX = '@zettelyay/'

function findOfficialDependencies(projectPath) {
  const officialDependencies = []

  const packagePath = path.join(projectPath, 'package.json')
  try {
    const package = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
    const allDependencies = {
      ...(package.dependencies ?? {}),
      ...(package.devDependencies ?? {}),
      ...(package.peerDependencies ?? {}),
    }
    const allDependencyNames = Object.keys(allDependencies)
    allDependencyNames.forEach(dependencyName => {
      if (dependencyName.startsWith(OFFICIAL_DEPENDENCIES_PREFIX)) {
        officialDependencies.push({
          name: dependencyName,
          version: findVersion(allDependencies[dependencyName]),
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
