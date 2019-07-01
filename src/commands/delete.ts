import {Command, flags} from '@oclif/command';
import {main} from '../executer/delete';

// noinspection JSUnusedGlobalSymbols
export default class DeleteCommand extends Command {
  // noinspection JSUnusedGlobalSymbols
  static description = `
cognito-tools delete -u [USER_POOL_ID] -r [REGION] -i [INPUT_JSON_FILE]

cognito admin delete user
input json file example
[{"Username":"","Attributes":[{"Name":"sub","Value":"039bf366-7942-4888-a772-41dadacb2ea9"},{"Name":"email","Value":"sample@example.com"}]}]
`;

  // noinspection JSUnusedGlobalSymbols
  static flags = {
    region: flags.string(
      {
        char: 'r',
        description: 'region name',
        env: 'REGION',
        default: 'ap-northeast-1',
        required: true,
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
        description: 'input target path',
        required: true,
      },
    ),
  };

  async run() {
    const {flags} = this.parse(DeleteCommand);
    const {successCount, failCount, totalCount} = await main(flags.region, flags.userPoolId, flags.input);
    this.log(`totalUserCount: ${totalCount}`);
    this.log(`successUserCount: ${successCount}`);
    this.log(`failUserCount: ${failCount}`);
  }
}
