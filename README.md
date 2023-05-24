# Zettel: Extension build helper tools

Build and helper tools for extension development.

## Installation

```bash
$ npm install --save-dev @zettelooo/extension-build-tools
```

## Usage

This package provides shell command `zettel-ebt` executable binary.
You can use it to speed up a couple of tasks while developing Zettel extensions.

See help:

```bash
$ zettel-ebt --help   # / -h
```

Version extension's manifest:

```bash
$ zettel-ebt version patch   # / minor / major
```

Pack and zip extension's files:

```bash
$ zettel-ebt pack
```

Upload the extension's zipped file:

```bash
$ ZETTEL_TARGET_ENVIRONMENT=live ZETTEL_DEVELOPER_ACCESS_KEY=??? zettel-ebt upload
```

## Configuration

You may provide the following configuration parameters either as the CLI command flags or options in the config file; which is either `.zettelebtrc`, `.zettelebtrc.json`, `.zettelebtrc.js`, `.zettelebtrc.yml`, or `.zettelebtrc.yaml`.

| RC file property path | Command-line flag | Default | Description |
|---|---|---|---|
| `paths.root` | `-r`, `--root-path` | `"."` | Project root relative path, contains `package.json` file
| `paths.public` | `-p`, `--public-path` | `"public"` | Public folder relative path to root, contains `manifest.jsonc` file
| `paths.src` | `-s`, `--src-path` | `"src"` | Source folder relative path to root, contains `starter.js` file
| `paths.out` | `-o`, `--out-path` | `"out"` | Dist folder relative path to root, to place the packed content

## Development

Clone the repository locally:

```bash
$ git clone git@github.com:zettelooo/extension-build-tools.git
```

Install the dependencies:

```bash
$ cd extension-build-tools
$ npm install
```

It's recommended to use **VS Code** to develop this project.
You need to have **Prettier** extension to be installed on your IDE.

## Publication

Publish a new version of the NPM package:

- Push all the changes. The workspace needs to be cleaned.
- Make sure you're on `master` branch.

```bash
$ npm version patch   # / minor / major / any other valid semantic version
```

## Misc

You can use the following NPM script to access [Zettel Build Tools](https://github.com/zettelooo/build-tools#usage):

```bash
$ npm run bt -- <command>   # e.g.: npm run bt - update
```

------------------

Copyright: **Zettel, 2020-23**
