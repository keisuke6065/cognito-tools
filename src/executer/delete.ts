import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as JSONStream from 'JSONStream';
import * as util from 'util';
import * as stream from 'stream';
import Count from '../util/count';
import {adminDeleteUser} from '../util/cognito-util';
import {limiter} from '../util/limiter';

const count = new Count();
const pipeline = util.promisify(stream.pipeline);

export const main = async (region: string, userPoolId: string, filePath: string) => {
  const cognitoIsp = new AWS.CognitoIdentityServiceProvider({region});
  const userDeletion = limiter(5).wrap(async (param: any) => adminDeleteUser(cognitoIsp, param));
  const readStream = fs.createReadStream(filePath, 'utf8');
  const parse = JSONStream.parse('*');
  const writableStream = readStream.pipe(parse);

  await pipeline(
    writableStream.on('data', data => {
      count.totalCountUp();
      console.log(data.Username);

      userDeletion({UserPoolId: userPoolId, Username: data.Username}).then(() => {
        count.successCountUp();
      }).catch(err => {
        console.error('delete user error data: %o StackTrace: %o', data, err);
        count.failCountUp();
      });
    }),
    writableStream.on('close', () => {
    }),
  );
  await count.waitingCountUp(1000);
  return {totalCount: count.totalCount, successCount: count.successCount, failCount: count.failCount};
};
