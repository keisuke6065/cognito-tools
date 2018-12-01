const {Command, flags} = require('@oclif/command');
const backup = require('../executer/backup');
const cli = require('cli-ux');

class BackupCommand extends Command {
  async run() {
    cli.ux.action.start('starting userPool backup');

    const {flags} = this.parse(BackupCommand);
    const totalUserCount = await backup.main(flags.region, flags.userPoolId,
        flags.output).
        then(totalUserCount => totalUserCount).
        catch(error => {
          this.error(error);
          this.exit(1);
        });

    cli.ux.action.stop('done');
    this.log(`total user: ${totalUserCount}`);
    this.log(`target region ${flags.region}`);
    this.log(`target userPoolId ${flags.userPoolId}`);
    this.log(`output file ${flags.output}/${flags.userPoolId}.json`);
  }
}

BackupCommand.description = `
cognito-tools -u [USER_POOL_ID] -r [REGION] -o .
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
