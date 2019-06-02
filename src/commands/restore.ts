import {Command, flags} from '@oclif/command';
import {main} from '../executer/restore';

// noinspection JSUnusedGlobalSymbols
export default class RestoreCommand extends Command {
  // noinspection JSUnusedGlobalSymbols
  static description = `
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
  // noinspection JSUnusedGlobalSymbols
  static flags = {
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
    limit: flags.integer(
      {
        char: 'l',
        description: 'request limit (AdminCreateUser)',
        default: 5,
      },
    ),
  };

  async run() {
    const {flags} = this.parse(RestoreCommand);
    const {totalCount, successCount, failCount} =
      await main(flags.region as string, flags.userPoolId, flags.input,
        flags.limit as number);
    this.log(`totalUserCount: ${totalCount}`);
    this.log(`successUserCount: ${successCount}`);
    this.log(`failUserCount: ${failCount}`);
  }
}
