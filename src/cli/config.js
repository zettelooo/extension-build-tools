const path = require('path')
const { rcFile } = require('rc-config-loader')
const { throwError } = require('./utilities')

function loadRcFile() {
  try {
    const results = rcFile('zettelebt')
    return results?.config ?? {}
  } catch (error) {
    throwError(error)
  }
}

module.exports = {
  loadRcFile,
}
