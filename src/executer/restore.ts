import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as JSONStream from 'JSONStream';
import * as util from 'util';
import * as stream from 'stream';
import {limiter} from '../util/limiter';
import Count from '../util/count';
import {adminCreateUser, createParam} from '../util/cognito-util';

const count = new Count();
const pipeline = util.promisify(stream.pipeline);

/**
 * user name eq email pattern
 *
 * @param region string
 * @param userPoolId string
 * @param filePath string
 * @param limit number
 * @returns Promise<{totalCount: number, successCount: number, failCount: number}>
 */
export const main = async (region: string, userPoolId: string, filePath: string, limit: number) => {
  const cognitoIsp = new AWS.CognitoIdentityServiceProvider({region});
  const userCreation = limiter(limit, 100).wrap(async (param: any) => adminCreateUser(cognitoIsp, param));

  const readStream = fs.createReadStream(filePath, 'utf8');
  const parse = JSONStream.parse('*');
  const writableStream = readStream.pipe(parse);

  await pipeline(
    writableStream.on('data', data => {
      const param = createParam(userPoolId, data);
      count.totalCountUp();

      userCreation(param).then(() => {
        count.successCountUp();
      }).catch(err => {
        console.error('create user error data: %o StackTrace: %o', data, err);
        count.failCountUp();
      });
    }),
    writableStream.on('close', () => {
    }),
  );
  await count.waitingCountUp(1000);
  return {totalCount: count.totalCount, successCount: count.successCount, failCount: count.failCount};
};
