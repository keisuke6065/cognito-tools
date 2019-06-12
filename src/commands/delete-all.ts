import {Command, flags} from '@oclif/command';
import {main} from '../executer/delete-all';
import cli from 'cli-ux';

// noinspection JSUnusedGlobalSymbols
export default class Delete extends Command {
  // noinspection JSUnusedGlobalSymbols
  static description = `
cognito-tools delete -u [USER_POOL_ID] -r [REGION]

fetch delete command
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
  };

  async run() {
    cli.action.start('starting userPool delete all user');
    const {flags} = this.parse(Delete);
    const {successCount, failCount, totalCount} = await main(flags.region, flags.userPoolId);
    cli.action.stop('done');
    this.log(`totalUserCount: ${totalCount}`);
    this.log(`successUserCount: ${successCount}`);
    this.log(`failUserCount: ${failCount}`);
  }
}
