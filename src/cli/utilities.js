const fs = require('fs')

function throwError(message) {
  console.error(String(message))
  process.exit(1)
}

function ensureFolder(folderPath) {
  try {
    fs.accessSync(folderPath, fs.constants.F_OK)
  } catch {
    try {
      fs.mkdirSync(folderPath, { recursive: true })
    } catch {}
  }
}

module.exports = {
  throwError,
  ensureFolder,
}
