const AWS = require('aws-sdk');
const fs = require('fs');
const mkdirp = require('mkdirp');
const JSONStream = require('JSONStream');
const {limiter} = require('../util/limiter');
const Count = require('../util/count');

const limitCount = 60;
const count = new Count();

module.exports.main = async (region, userPoolId, outputDir) => {
  const cognitoIsp = new AWS.CognitoIdentityServiceProvider({region});
  mkdirp.sync(outputDir);
  const params = {UserPoolId: userPoolId, Limit: limitCount};
  const writeStream = fs.createWriteStream(`${outputDir}/${userPoolId}.json`,
      'utf8');
  const stringify = JSONStream.stringify();
  stringify.pipe(writeStream);
  const fetchUsers = limiter(1, 200).wrap(
      async (params) => await cognitoIsp.listUsers(params).promise());

  const fetch = () => fetchUsers(params).then(data => {
    data.Users.forEach(user => stringify.write(user));
    count.totalCountUp(data.Users.length);
    if (data.PaginationToken !== undefined) {
      params.PaginationToken = data.PaginationToken;
      return fetch();
    }
  }).catch(err => console.error(err));
  return fetch().then(() => {
    stringify.end();
    return count.state.totalCount;
  });
};
