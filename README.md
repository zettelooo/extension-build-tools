# Zettel: Extension build helper tools

Build and helper tools for extension development.

## Installation

```bash
$ npm install --save-dev @zettelyay/extension-build-tools
```

## Usage

This package provides shell command `zettel-ebt` executable binary.
You can use it to speed up a couple of tasks while developing Zettel extensions.

See help:

```bash
$ zettel-ebt help   # / h
```

Upgrade Zettel's official dependencies:

```bash
$ zettel-ebt upgrade
```

Version extension's manifest:

```bash
$ zettel-ebt version patch   # / minor / major
```

Pack and zip extension's files:

```bash
$ zettel-ebt pack
```

See build tools version:

```bash
$ zettel-ebt version   # / v
```

## Configuration

You may provide the following configuration parameters either as the CLI command flags or options in the config file; which is either `.zettelebtrc`, `.zettelebtrc.json`, `.zettelebtrc.js`, `.zettelebtrc.yml`, or `.zettelebtrc.yaml`.

| RC file property path | Command-line flag | Default | Description |
|---|---|---|---|
| `paths.root` | `-r`, `--root-path` | `"."` | Project root relative path, contains `package.json` file
| `paths.public` | `-p`, `--public-path` | `"public"` | Public folder relative path to root, contains `manifest.jsonc` file
| `paths.src` | `-s`, `--src-path` | `"src"` | Source folder relative path to root, contains `extension-function.js` file
| `paths.out` | `-o`, `--out-path` | `"out"` | Dist folder relative path to root, to place the packed content

## Development

Clone the repository locally:

```bash
$ git clone https://github.com/zettelyay/extension-build-tools.git
```

Install the dependencies:

```bash
$ cd extension-build-tools
$ npm install
```

It's recommended to use **VS Code** to develop this project.
You need to have **Prettier** and **ESLint** extensions to be installed on your IDE.
This project uses a modified version of the **Airbnb** style.

> Linting will be called _automatically_ before committing. Any linting error will abort the process. Therefore, you possibly need to lint the staged changes manualy before trying to commit them yourself and fix all the errors and as much as possible of warnings first.

Lint check before commit:

```bash
$ npm run lint-staged   # Alternatively:   $ npm run .l
```

## Publication

Publish a new version of the NPM package:

- Push all the changes. The workspace needs to be cleaned.
- Make sure you're on `master` branch.

```bash
$ npm version patch   # / minor / major / any other valid semantic version
```

## Misc

Check for all the updates available on the dependencies:

```bash
$ npm run updates.check
```

Upgrade all the dependencies to their very latest versions:

```bash
$ npm run updates.install
```

View GIT history visualized:

```bash
$ npm run gource
```

> You probably need to install `gource` locally first.<br/>
See [this link](https://gource.io/).

Summarize the size of the code base in lines of code:

```bash
$ npm run status
```


------------------

Copyright: **Zettel, 2020-23**
