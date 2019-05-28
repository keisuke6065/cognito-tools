const AWS = require('aws-sdk');
const csvParse = require('csv-parse');
const csv = require('csv');
const util = require('util');
const fs = require('fs');
const path = require('path');
const Count = require('../util/count');
const {forceCreateUser} = require('../util/cognito_util');
const {limiter} = require('../util/limiter');

const count = new Count();

const parse = csvParse({
  columns: true,
  skip_empty_lines: true,
}, (err, records) => {
  return records;
});

/**
 * user name eq email pattern
 *
 * @param region
 * @param userPoolId
 * @param clientId
 * @param filePath
 * @param outputDir
 * @param limit
 * @returns {Promise<{failCount, successCount, totalCount}|*>}
 */
module.exports.main = async (
    region, userPoolId, clientId, filePath, outputDir, limit) => {
  const cognitoIsp = new AWS.CognitoIdentityServiceProvider({region});
  const userCreation = limiter(limit, 100).wrap(
      async (param) => forceCreateUser(cognitoIsp, param,
          userPoolId, clientId));
  const readStream = fs.createReadStream(Buffer.from(filePath), 'utf8');
  const writableStream = readStream.pipe(parse);

  const writeStream = fs.createWriteStream(
      `${outputDir}/${path.parse(filePath).name}.csv`,
      'utf8');
  const stringify = csv.stringify({header: true});

  stringify.pipe(writeStream);
  writableStream.on('data', (data) => {
    count.totalCountUp();
    userCreation(data).then(result => {
      stringify.write({userName: result, ...data});
      count.successCountUp();
    }).catch((err) => {
      console.error('create user error data: %o StackTrace: %o',
          JSON.stringify(data), JSON.stringify(util.inspect(err)));
      count.failCountUp();
    });
  });
  await count.waitingCountUp(1000);
  return count.state;
};
