const AWS = require('aws-sdk');
const fs = require('fs');
const JSONStream = require('JSONStream');
const util = require('util');
const stream = require('stream');

const pipeline = util.promisify(stream.pipeline);
const sleep = (msec) => new Promise(resolve => setTimeout(resolve, msec));

let totalUserCount = 0;
let successUserCount = 0;
let failUserCount = 0;

/**
 * user name eq email pattern
 *
 * @param region
 * @param userPoolId
 * @param filePath
 * @returns {Promise<{totalUserCount: number, successUserCount: number, failUserCount: number}>}
 */
module.exports.main = async (region, userPoolId, filePath) => {
  const cognitoIsp = new AWS.CognitoIdentityServiceProvider({region});

  const readStream = fs.createReadStream(filePath, 'utf8');
  const parse = JSONStream.parse('*');
  const writableStream = readStream.pipe(parse);
  const params = {UserPoolId: userPoolId};
  await pipeline(
      writableStream.on('data', async (data) => {
        const attributes = data.Attributes.filter(a => a.Name !== 'sub');
        const email = data.Attributes.filter(a => a.Name === 'email')[0].Value;
        // Username = email
        const param = Object.assign(params, {
          Username: email,
          UserAttributes: attributes,
          DesiredDeliveryMediums: [], // EMAIL or SMS
          MessageAction: 'SUPPRESS', //or RESEND
          ForceAliasCreation: false,
          // TemporaryPassword: tempPassword,
        });
        totalUserCount += 1;
        cognitoIsp.adminCreateUser(param).promise().then(() => {
          successUserCount += 1;
        }).catch(() => {
          failUserCount += 1;
        });
      }),
      writableStream.on('close', () => {
      }),
  );
  // TODO
  while (totalUserCount !== (failUserCount + successUserCount)) {
    await sleep(1000);
    if (totalUserCount === (failUserCount + successUserCount)) break;
  }
  return {totalUserCount, successUserCount, failUserCount};
};

