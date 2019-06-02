import {Command, flags} from '@oclif/command';
import cli from 'cli-ux';
import {main} from '../executer/force-registration';

// noinspection JSUnusedGlobalSymbols
export default class ForceRegistrationCommand extends Command {
  // noinspection JSUnusedGlobalSymbols
  static description = `
cognito-tools force-registration -u [USER_POOL_ID] -c [CLIENT_ID] -r [REGION] -i [INPUT_CSV_FILE] -o [OUTPUT_TARGET_DIR]

force create user

input file example
email,password,custom:customAttributeName,facebookId
6059028c-2d13-11e9-8d87-4f75dd5bbbcf@exmaple.com,,1,00000000000
605986da-2d13-11e9-a4e7-ef206b70e234@exmaple.com,password,2,00000000001
605a07ea-2d13-11e9-97b7-13fb3194c166@exmaple.com,password,3,

password none      -> admin create user
password exists    -> sign up user
facebook id exists -> admin create user or sign up user and link provider

output file example
userName,email,password,custom:customAttributeName,facebookId
66ef45ad-86a1-4377-aa86-2d3356933b36,6059028c-2d13-11e9-8d87-4f75dd5bbbcf@exmaple.com,,1,00000000000
b9225937-9578-4b31-9efe-3a00bebc4ccd,605986da-2d13-11e9-a4e7-ef206b70e234@exmaple.com,password,2,00000000001
ffb029f0-2b2c-4b1d-a927-1845990707fd,605a07ea-2d13-11e9-97b7-13fb3194c166@exmaple.com,password,3,
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
    output: flags.string(
      {
        char: 'o',
        description: 'output target dir',
        default: './output',
      },
    ),
    limit: flags.integer(
      {
        char: 'l',
        description: 'request limit (AdminCreateUser or signUp or linkFacebookProvider)',
        default: 5,
      },
    ),
  };

  async run() {
    cli.action.start('starting userPool force registration.');

    const {flags} = this.parse(ForceRegistrationCommand);
    const {totalCount, successCount, failCount} = await main(
      flags.region as string, flags.userPoolId, flags.clientId,
      flags.input, flags.output as string, flags.limit as number);

    cli.action.stop('done');
    this.log(`totalUserCount: ${totalCount}`);
    this.log(`successUserCount: ${successCount}`);
    this.log(`failUserCount: ${failCount}`);
  }
}
