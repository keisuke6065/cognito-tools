const AWS = require('aws-sdk');
const bottleneck = require('bottleneck');
const csvParse = require('csv-parse');
const fs = require('fs');
const Count = require('../util/index');

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

const createParam = (clientId, data) => {
  const attributes = Object.keys(data).
      filter((key) => ['email', 'password'].indexOf(key) === -1).
      map(key => ({
            Name: key,
            Value: data[key],
          }
      ));
  return {
    ClientId: clientId,
    Username: data.email,
    UserAttributes: attributes,
    Password: data.password,
  };
};

/**
 * user name eq email pattern
 *
 * @param region
 * @param clientId
 * @param filePath
 * @returns {Promise<{failCount, successCount, totalCount}|*>}
 */
module.exports.main = async (region, clientId, filePath) => {
  const cognitoIsp = new AWS.CognitoIdentityServiceProvider({region});
  const userCreation = limiter.wrap(
      async (param) => await cognitoIsp.signUp(param).promise());
  const buf = Buffer.from(filePath);
  const readStream = fs.createReadStream(buf, 'utf8');

  const writableStream = readStream.pipe(parse);
  writableStream.on('data', async (data) => {
    const param = createParam(clientId, data);
    count.totalCountUp();
    await userCreation(param).then(() => {
      count.successCountUp();
    }).catch(() => {
      count.failCountUp();
    });
  });
  await count.waitingCountUp(1000);
  return count.state;
};
