const AWS = require('aws-sdk');
const fs = require('fs');
const mkdirp = require('mkdirp');
const JSONStream = require('JSONStream');

const limitCount = 60;
let totalUserCount = 0;

module.exports.main = async (region, userPoolId, outputDir) => {
  const cognitoIsp = new AWS.CognitoIdentityServiceProvider({region});
  mkdirp.sync(outputDir);
  const params = {UserPoolId: userPoolId, Limit: limitCount};
  const writeStream = fs.createWriteStream(`${outputDir}/${userPoolId}.json`,
    'utf8');
  const stringify = JSONStream.stringify();
  stringify.pipe(writeStream);
  const fetch = () => {
    return fetchUsers(cognitoIsp, params).then(data => {
      data.Users.forEach(user => stringify.write(user));
      countUp(data.Users.length);
      if (data.PaginationToken !== undefined) {
        params.PaginationToken = data.PaginationToken;
        return fetch();
      }
    }).catch();
  };
  return fetch().then(() => {
    stringify.end();
    return totalUserCount;
  });
};

const fetchUsers = (cognitoIsp, params) => {
  return cognitoIsp.listUsers(params).promise();
};

const countUp = (length) => {
  return totalUserCount += length;
};
