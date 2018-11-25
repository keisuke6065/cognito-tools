cognito-tools
=============

cognito tools

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cognito-tools.svg)](https://npmjs.org/package/cognito-tools)
[![Downloads/week](https://img.shields.io/npm/dw/cognito-tools.svg)](https://npmjs.org/package/cognito-tools)
[![License](https://img.shields.io/npm/l/cognito-tools.svg)](https://github.com/keisuke6065/cognito-tools/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g cognito-tools
$ cognito-tools COMMAND
running command...
$ cognito-tools (-v|--version|version)
cognito-tools/0.0.0 darwin-x64 node-v10.9.0
$ cognito-tools --help [COMMAND]
USAGE
  $ cognito-tools COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cognito-tools backup`](#cognito-tools-backup)
* [`cognito-tools help [COMMAND]`](#cognito-tools-help-command)

## `cognito-tools backup`

Describe the command here

```
USAGE
  $ cognito-tools backup

OPTIONS
  -r, --region=region          [default: ap-northeast-1] region name
  -u, --userPoolId=userPoolId  userPool Id

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/backup.js](https://github.com/keisuke6065/cognito-tools/blob/v0.0.0/src/commands/backup.js)_

## `cognito-tools help [COMMAND]`

display help for cognito-tools

```
USAGE
  $ cognito-tools help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.4/src/commands/help.ts)_
<!-- commandsstop -->
