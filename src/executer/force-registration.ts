import * as AWS from 'aws-sdk';
import * as csvParse from 'csv-parse';
import * as csv from 'csv-stringify';
import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import Count from '../util/count';
import {forceCreateUser} from '../util/cognito-util';
import {limiter} from '../util/limiter';

const count = new Count();

const parse = csvParse({
  columns: true,
  skip_empty_lines: true,
}, (err, records) => {
  console.error(err);
  return records;
});

/**
 * user name eq email pattern
 *
 * @param region string
 * @param userPoolId string
 * @param clientId string
 * @param filePath string
 * @param outputDir string
 * @param limit number
 * @return Promise
 */
export const main = async (region: string, userPoolId: string, clientId: string, filePath: string, outputDir: string, limit: number) => {
  const cognitoIsp = new AWS.CognitoIdentityServiceProvider({region});
  const userCreation = limiter(limit).wrap(async (param: any) => forceCreateUser(cognitoIsp, param, userPoolId, clientId));
  const readStream = fs.createReadStream(Buffer.from(filePath), 'utf8');
  const writableStream = readStream.pipe(parse);

  const writeStream = fs.createWriteStream(
    `${outputDir}/${path.parse(filePath).name}.csv`,
    'utf8');
  const stringify = csv({header: true});

  stringify.pipe(writeStream);
  writableStream.on('data', data => {
    count.totalCountUp();
    userCreation(data).then(result => {
      stringify.write({userName: result, ...data});
      count.successCountUp();
    }).catch(err => {
      console.error('create user error data: %o StackTrace: %o', JSON.stringify(data), JSON.stringify(util.inspect(err)));
      count.failCountUp();
    });
  });
  await count.waitingCountUp(1000);
  return {totalCount: count.totalCount, successCount: count.successCount, failCount: count.failCount};
};
