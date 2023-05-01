function findVersion(text) {
  return (
    /\d+\.\d+\.\d+/.exec(text)?.[0] || /\d+\.\d+/.exec(text)?.[0].concat('.0') || /\d+/.exec(text)?.[0].concat('.0.0')
  )
}

function parseVersion(version) {
  return version.split('.').map(part => Number(part))
}

function formatVersion(parts) {
  return parts.map(part => String(part)).join('.')
}

function upgradeVersion(parts, versioning) {
  switch (versioning) {
    case 'major':
      return [parts[0] + 1, 0, 0]

    case 'minor':
      return [parts[0], parts[1] + 1, 0]

    case 'patch':
      return [parts[0], parts[1], parts[2] + 1]
  }
}

module.exports = {
  findVersion,
  parseVersion,
  formatVersion,
  upgradeVersion,
}
