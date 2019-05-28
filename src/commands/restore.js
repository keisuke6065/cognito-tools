const {Command, flags} = require('@oclif/command');
const restore = require('../executer/restore');

class RestoreCommand extends Command {
  async run() {
    const {flags} = this.parse(RestoreCommand);
    const {totalCount, successCount, failCount} =
        await restore.main(flags.region, flags.userPoolId, flags.input,
            flags.limit);
    this.log(`totalUserCount: ${totalCount}`);
    this.log(`successUserCount: ${successCount}`);
    this.log(`failUserCount: ${failCount}`);
  }
}

RestoreCommand.description = `
cognito-tools restore -u [USER_POOL_ID] -r [REGION] -i [INPUT_JSON_FILE]

cognito admin create user
input json file example
[{"Username":"","Attributes":[{"Name":"sub","Value":"039bf366-7942-4888-a772-41dadacb2ea9"},{"Name":"email","Value":"sample@example.com"}]}]

admin create use options
Username = email
MessageAction = SUPPRESS
DesiredDeliveryMediums = none
ForceAliasCreation = false
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
  limit: flags.string(
      {
        char: 'l',
        description: 'request limit (AdminCreateUser)',
        default: 5,
      },
  ),
};

module.exports = RestoreCommand;
