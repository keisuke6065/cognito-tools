const AWS = require('aws-sdk');
const fs = require('fs');
const JSONStream = require('JSONStream');
const util = require('util');
const stream = require('stream');
const bottleneck = require('bottleneck');
const Count = require('../util/count');
const {adminCreateUser, createParam} = require('../util/cognito_util');

const count = new Count();
const pipeline = util.promisify(stream.pipeline);
const limiter = new bottleneck({
  maxConcurrent: 10,
  minTime: 100,
});

/**
 * user name eq email pattern
 *
 * @param region
 * @param userPoolId
 * @param filePath
 * @returns {Promise<{totalCount: number, successCount: number, failCount: number}>}
 */
exports.main = async (region, userPoolId, filePath) => {
  const cognitoIsp = new AWS.CognitoIdentityServiceProvider({region});
  const userCreation = limiter.wrap(
      async (param) => adminCreateUser(cognitoIsp, param));

  const readStream = fs.createReadStream(filePath, 'utf8');
  const parse = JSONStream.parse('*');
  const writableStream = readStream.pipe(parse);

  await pipeline(
      writableStream.on('data', (data) => {
        const param = createParam(userPoolId, data);
        count.totalCountUp();

        userCreation(param).then(() => {
          count.successCountUp();
        }).catch((err) => {
          console.error('create user error data: %o StackTrace: %o', data, err);
          count.failCountUp();
        });
      }),
      writableStream.on('close', () => {
      }),
  );
  await count.waitingCountUp(1000);
  return count.state;
};

