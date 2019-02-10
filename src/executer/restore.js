const AWS = require('aws-sdk');
const fs = require('fs');
const JSONStream = require('JSONStream');
const util = require('util');
const stream = require('stream');
const bottleneck = require('bottleneck');
const {sleep} = require('../util/index');

const pipeline = util.promisify(stream.pipeline);
const limiter = new bottleneck({
  minTime: 100,
  maxConcurrent: 1,
});

function createParam(userPoolId, data) {
  const attributes = data.Attributes.filter(a => a.Name !== 'sub');
  const email = data.Attributes.filter(
      a => a.Name === 'email')[0].Value;
  // Username = email
  return {
    UserPoolId: userPoolId,
    Username: email,
    UserAttributes: attributes,
    DesiredDeliveryMediums: [], // EMAIL or SMS
    MessageAction: 'SUPPRESS', //or RESEND
    ForceAliasCreation: false,
    // TemporaryPassword: tempPassword,
  };
}

const count = {
  totalUserCount: 0,
  successUserCount: 0,
  failUserCount: 0,
};

async function waitingCountUp() {
  while (count.totalUserCount !==
  (count.failUserCount + count.successUserCount)) {
    await sleep(1000);
    if (count.totalUserCount ===
        (count.failUserCount + count.successUserCount)) break;
  }
}

/**
 * user name eq email pattern
 *
 * @param region
 * @param userPoolId
 * @param filePath
 * @returns {Promise<{totalUserCount: number, successUserCount: number, failUserCount: number}>}
 */
exports.main = async (region, userPoolId, filePath) => {
  const cognitoIsp = new AWS.CognitoIdentityServiceProvider({region});
  const userCreation = limiter.wrap(
      async (param) => cognitoIsp.adminCreateUser(param).promise());

  const readStream = fs.createReadStream(filePath, 'utf8');
  const parse = JSONStream.parse('*');
  const writableStream = readStream.pipe(parse);

  await pipeline(
      writableStream.on('data', async (data) => {
        const param = createParam(userPoolId, data);
        count.totalUserCount += 1;

        await userCreation(param).then(() => {
          count.successUserCount += 1;
        }).catch(() => {
          count.failUserCount += 1;
        });
      }),
      writableStream.on('close', () => {
      }),
  );
  await waitingCountUp();
  return count;
};

