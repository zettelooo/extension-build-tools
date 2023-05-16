const path = require('path')
const { rcFile } = require('rc-config-loader')
const { throwError } = require('./utilities')

function loadRcFile(rcFileName) {
  try {
    const results = rcFile(rcFileName)
    return results?.config ?? {}
  } catch (error) {
    throwError(error)
  }
}

module.exports = {
  loadRcFile,
}
