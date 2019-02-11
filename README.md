cognito-tools
=============

cognito tools

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cognito-tools.svg)](https://npmjs.org/package/cognito-tools)
[![Downloads/week](https://img.shields.io/npm/dw/cognito-tools.svg)](https://npmjs.org/package/cognito-tools)
[![License](https://img.shields.io/npm/l/cognito-tools.svg)](https://github.com/keisuke6065/cognito-tools/blob/master/package.json)
[![codecov](https://codecov.io/gh/keisuke6065/cognito-tools/branch/master/graph/badge.svg)](https://codecov.io/gh/keisuke6065/cognito-tools)
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
cognito-tools/0.0.4 darwin-x64 node-v10.15.1
$ cognito-tools --help [COMMAND]
USAGE
  $ cognito-tools COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cognito-tools backup`](#cognito-tools-backup)
* [`cognito-tools force-registration`](#cognito-tools-force-registration)
* [`cognito-tools help [COMMAND]`](#cognito-tools-help-command)
* [`cognito-tools restore`](#cognito-tools-restore)

## `cognito-tools backup`

cognito-tools -u [USER_POOL_ID] -r [REGION] -o .

```
USAGE
  $ cognito-tools backup

OPTIONS
  -o, --output=output          [default: ./output] output target dir
  -r, --region=region          [default: ap-northeast-1] region name
  -u, --userPoolId=userPoolId  (required) userPool Id

DESCRIPTION
  cognito-tools -u [USER_POOL_ID] -r [REGION] -o .
```

_See code: [src/commands/backup.js](https://github.com/keisuke6065/cognito-tools/blob/v0.0.4/src/commands/backup.js)_

## `cognito-tools force-registration`

Describe the command here

```
USAGE
  $ cognito-tools force-registration

OPTIONS
  -c, --clientId=clientId  (required) client Id
  -i, --input=input        (required) input target csv file
  -r, --region=region      [default: ap-northeast-1] region name

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/force-registration.js](https://github.com/keisuke6065/cognito-tools/blob/v0.0.4/src/commands/force-registration.js)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_

## `cognito-tools restore`

Describe the command here

```
USAGE
  $ cognito-tools restore

OPTIONS
  -i, --input=input            (required) input target file
  -r, --region=region          [default: ap-northeast-1] region name
  -u, --userPoolId=userPoolId  (required) userPool Id

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/restore.js](https://github.com/keisuke6065/cognito-tools/blob/v0.0.4/src/commands/restore.js)_
<!-- commandsstop -->
