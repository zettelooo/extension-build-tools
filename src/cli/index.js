#!/usr/bin/env node

const { loadRcFile } = require('@zettelooo/build-tools/lib/config')
const { findOfficialDependencies } = require('@zettelooo/build-tools/lib/official')
const { throwError, ensureFolder } = require('@zettelooo/build-tools/lib/utilities')
const { findVersion, formatVersion, parseVersion, upgradeVersion } = require('@zettelooo/build-tools/lib/versioning')
const fs = require('fs')
const JSZip = require('jszip')
const path = require('path')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const rcConfig = loadRcFile('zettelebt')
const defaultConfig = {
  paths: {
    root: rcConfig.paths?.root || '.',
    public: rcConfig.paths?.public || 'public',
    src: rcConfig.paths?.src || 'src',
    out: rcConfig.paths?.out || 'out',
  },
}

yargs(hideBin(process.argv))
  .alias('v', 'version')
  .alias('h', 'help')

  .option('r', {
    alias: 'root-path',
    describe: 'Project root relative path, contains "package.json" file, defaults to the current working directory',
    type: 'string',
  })
  .option('p', {
    alias: 'public-path',
    describe: 'Public folder relative path to root, contains "manifest.jsonc" file, defaults to "public"',
    type: 'string',
  })
  .option('s', {
    alias: 'src-path',
    describe: 'Source folder relative path to root, contains "extension-function.js" file, defaults to "src"',
    type: 'string',
  })
  .option('o', {
    alias: 'out-path',
    describe: 'Dist folder relative path to root, to place the packed content, defaults to "out"',
    type: 'string',
  })

  .command('version [version]', 'Increases the version of the extension in manifest', argv => {
    return argv
      .command(
        'major',
        'Apply a major version upgrade',
        argv => argv,
        args => applyVersioning(args._[1])
      )
      .command(
        'minor',
        'Apply a minor version upgrade',
        argv => argv,
        args => applyVersioning(args._[1])
      )
      .command(
        'patch',
        'Apply a patch version upgrade',
        argv => argv,
        args => applyVersioning(args._[1])
      )
      .demandCommand(1, 1)
      .strict()

    function applyVersioning(versioning) {
      try {
        const manifestPath = path.join(
          process.cwd(),
          argv.argv.r || defaultConfig.paths.root,
          argv.argv.p || defaultConfig.paths.public,
          'manifest.jsonc'
        )
        const manifest = fs.readFileSync(manifestPath, 'utf-8')
        let index = manifest.indexOf('"version"')
        if (index < 0) throwError('Invalid manifest.')
        index = manifest.indexOf(':', index + 1)
        if (index < 0) throwError('Invalid manifest.')
        const version = findVersion(manifest.slice(index + 1))
        if (!version) throwError('Invalid manifest.')
        index = manifest.indexOf(version, index + 1)
        const upgradedVersion = formatVersion(upgradeVersion(parseVersion(version), versioning))
        const newManifest = `${manifest.slice(0, index)}${upgradedVersion}${manifest.slice(index + version.length)}`
        fs.writeFileSync(manifestPath, newManifest, 'utf-8')
        console.log(`Upgraded to version "${upgradedVersion}" successfully!`)
      } catch (error) {
        throwError(error)
      }
    }
  })

  .command(
    'pack',
    'Packs the whole extension files into a zipped file ready to be uploaded',
    argv => argv,
    async args => {
      try {
        const rootPath = path.join(process.cwd(), args.r || defaultConfig.paths.root)
        const publicPath = path.join(rootPath, args.p || defaultConfig.paths.public)
        const srcPath = path.join(rootPath, args.s || defaultConfig.paths.src)
        const outPath = path.join(rootPath, args.o || defaultConfig.paths.out)

        const zippedPack = new JSZip()

        const extensionFunctionName = 'extension-function.js'
        const extensionFunctionPath = path.join(srcPath, extensionFunctionName)
        zippedPack.file(extensionFunctionName, await fs.promises.readFile(extensionFunctionPath))

        const officialDependencies = findOfficialDependencies(rootPath)
        const metadata = { officialDependencies: {} }
        officialDependencies.forEach(dependency => {
          metadata.officialDependencies[dependency.name.split('/')[1]] = dependency.version
        })
        zippedPack.file('metadata.json', JSON.stringify(metadata, null, 2))

        function walkFolder(folderPath, zip) {
          const entryNames = fs.readdirSync(folderPath)
          entryNames.forEach(entryName => {
            const entryPath = path.join(folderPath, entryName)
            const entryStatus = fs.statSync(entryPath)
            if (entryStatus.isFile()) {
              zip.file(entryName, fs.readFileSync(entryPath))
            } else if (entryStatus.isDirectory()) {
              walkFolder(entryPath, zip.folder(entryName))
            }
          })
        }
        walkFolder(publicPath, zippedPack)

        ensureFolder(outPath)
        await new Promise((resolve, reject) => {
          zippedPack
            .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
            .pipe(fs.createWriteStream(path.join(outPath, 'packed.zip')))
            .on('finish', resolve)
            .on('error', reject)
        })

        console.log(`Extension packed file "packed.zip" is created under the configured out folder successfully!`)
      } catch (error) {
        throwError(error)
      }
    }
  )

  .command(
    'upload',
    'Uploads the packed zipped file to the target environment, uses environment variables ZETTEL_TARGET_ENVIRONMENT and ZETTEL_DEVELOPER_ACCESS_KEY.',
    argv => argv,
    async args => {
      try {
        const officialDependencyServerSharedVersion = '3.0.0'
        const uploadEndPointPath = `/${officialDependencyServerSharedVersion}/developer/upload-extension`
        const uploadUrlsByTargetEnvironment = {
          local: `http://localhost:5002${uploadEndPointPath}`,
          stage: `https://papi-stage.zettel.ooo${uploadEndPointPath}`,
          live: `https://papi.zettel.ooo${uploadEndPointPath}`,
        }
        const targetEnvironment = process.env.ZETTEL_TARGET_ENVIRONMENT
        const developerAccessKey = process.env.ZETTEL_DEVELOPER_ACCESS_KEY
        if (!targetEnvironment || !(targetEnvironment in uploadUrlsByTargetEnvironment)) {
          console.error(
            `Environment variable ZETTEL_TARGET_ENVIRONMENT must be set to either "${Object.keys(
              uploadUrlsByTargetEnvironment
            ).join('", "')}".`
          )
          process.exit(1)
        }
        if (!developerAccessKey) {
          console.error(
            'Environment variable ZETTEL_DEVELOPER_ACCESS_KEY must be set. Generate one in your Zettel Developer Console.'
          )
          process.exit(1)
        }
        const rootPath = path.join(process.cwd(), args.r || defaultConfig.paths.root)
        const outPath = path.join(rootPath, args.o || defaultConfig.paths.out)
        const { FormData } = await import('formdata-node')
        const { default: fetch } = await import('node-fetch')
        const formData = new FormData()
        formData.set('packed', fs.createReadStream(path.join(outPath, 'packed.zip')))
        const response = await fetch(uploadUrlsByTargetEnvironment[targetEnvironment], {
          method: 'POST',
          body: formData,
          headers: {
            'X-Developer-Access-Key': developerAccessKey,
          },
        })
        if (!response.ok) {
          const message = await response.text()
          throw Error(message)
        }
        console.log(`Extension packed file "packed.zip" is uploaded to "${targetEnvironment}" successfully!`)
      } catch (error) {
        throwError(error)
      }
    }
  )

  .demandCommand(1, 1)
  .strict()
  .help()
  .parse()
