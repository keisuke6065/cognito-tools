const {Command, flags} = require('@oclif/command');
const backup = require('../executer/backup');
const cli = require('cli-ux');

class BackupCommand extends Command {
  async run() {
    cli.ux.action.start('starting userPool backup');

    const {flags} = this.parse(BackupCommand);
    const totalUserCount = await backup.main(flags.region, flags.userPoolId,
        flags.output);

    cli.ux.action.stop('done');
    this.log(`total user: ${totalUserCount}`);
    this.log(`target region ${flags.region}`);
    this.log(`target userPoolId ${flags.userPoolId}`);
    this.log(`output file ${flags.output}/${flags.userPoolId}.json`);
  }
}

BackupCommand.description = `
cognito-tools backup -u [USER_POOL_ID] -r [REGION] -o [OUTPUT_TARGET_DIR]

output file example
[{"Username":"","Attributes":[{"Name":"sub","Value":"7f1f8d94-5c2d-430f-97a7-e2d5d0bb14f1"},{"Name":"email_verified","Value":"false"},{"Name":"email","Value":"sample@example.com"}],"UserCreateDate":"2019-01-18T00:48:59.572Z","UserLastModifiedDate":"2019-01-18T00:48:59.572Z","Enabled":true,"UserStatus":"UNCONFIRMED"}]

`;

BackupCommand.flags = {
  region: flags.string(
      {
        char: 'r',
        description: 'region name',
        env: 'REGION',
        default: 'ap-northeast-1',
      },
  ),
  userPoolId: flags.string(
      {
        char: 'u',
        description: 'userPool Id',
        env: 'USER_POOL_ID',
        required: true,
      },
  ),
  output: flags.string(
      {
        char: 'o',
        description: 'output target dir',
        default: './output',
      },
  ),
};

module.exports = BackupCommand;
