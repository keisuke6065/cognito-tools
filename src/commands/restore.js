const {Command, flags} = require('@oclif/command');
const restore = require('../executer/restore');

class RestoreCommand extends Command {
  async run() {
    const {flags} = this.parse(RestoreCommand);
    const {totalCount, successCount, failCount} =
        await restore.main(
            flags.region, flags.userPoolId, flags.input);
    this.log(`totalUserCount: ${totalCount}`);
    this.log(`successUserCount: ${successCount}`);
    this.log(`failUserCount: ${failCount}`);
  }
}

RestoreCommand.description = `Describe the command here
...
Extra documentation goes here
`;

RestoreCommand.flags = {
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
  input: flags.string(
      {
        char: 'i',
        description: 'input target file',
        required: true,
      },
  ),
};

module.exports = RestoreCommand;
