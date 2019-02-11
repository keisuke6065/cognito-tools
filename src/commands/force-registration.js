const {Command, flags} = require('@oclif/command');
const registration = require('../executer/force-registration');
const cli = require('cli-ux');

class ForceRegistrationCommand extends Command {
  async run() {
    cli.ux.action.start('starting userPool force registration.');

    const {flags} = this.parse(ForceRegistrationCommand);
    const {totalCount, successCount, failCount} = await registration.main(flags.region, flags.clientId,
        flags.input);

    cli.ux.action.stop('done');
    this.log(`totalUserCount: ${totalCount}`);
    this.log(`successUserCount: ${successCount}`);
    this.log(`failUserCount: ${failCount}`);
  }
}

ForceRegistrationCommand.description = `Describe the command here
...
Extra documentation goes here
`;

ForceRegistrationCommand.flags = {
  region: flags.string(
      {
        char: 'r',
        description: 'region name',
        env: 'REGION',
        default: 'ap-northeast-1',
      },
  ),
  clientId: flags.string(
      {
        char: 'c',
        description: 'client Id',
        env: 'CLIENT_ID',
        required: true,
      },
  ),
  input: flags.string(
      {
        char: 'i',
        description: 'input target csv file',
        required: true,
      },
  ),
};

module.exports = ForceRegistrationCommand;
