const AWS = require('aws-sdk');
const bottleneck = require('bottleneck');
const csvParse = require('csv-parse');
const csv = require('csv');
const fs = require('fs');
const Count = require('../util/count');
const {forceCreateUser} = require('../util/cognito_util');

const count = new Count();
const limiter = new bottleneck({
  maxConcurrent: 10,
  minTime: 100,
});
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
 * @returns {Promise<{failCount, successCount, totalCount}|*>}
 */
module.exports.main = async (
    region, userPoolId, clientId, filePath, outputDir) => {
  const cognitoIsp = new AWS.CognitoIdentityServiceProvider({region});
  const userCreation = limiter.wrap(
      async (param) => forceCreateUser(cognitoIsp, param,
          userPoolId, clientId));
  const buf = Buffer.from(filePath);
  const readStream = fs.createReadStream(buf, 'utf8');
  const writableStream = readStream.pipe(parse);

  const writeStream = fs.createWriteStream(`${outputDir}/${userPoolId}.csv`,
      'utf8');
  const stringify = csv.stringify({header: true});

  stringify.pipe(writeStream);
  writableStream.on('data', (data) => {
    count.totalCountUp();
    userCreation(data).then(result => {
      stringify.write({userName: result, ...data});
      count.successCountUp();
    }).catch((err) => {
      console.error('create user error data: %o StackTrace: %o', data, err);
      count.failCountUp();
    });
  });
  await count.waitingCountUp(1000);
  return count.state;
};
