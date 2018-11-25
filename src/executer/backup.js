const AWS = require('aws-sdk');
const fs = require('fs');
const mkdirp = require('mkdirp');

// let totalUserCount = 0;

module.exports.main = async (region, userPoolId) => {
  const cognitoIsp = new AWS.CognitoIdentityServiceProvider({region});
  const params = {UserPoolId: userPoolId};

  const users = await fetchUsers(cognitoIsp, params);
  mkdirp.sync('./output/');
  const writeStream = fs.createWriteStream('./output/test.json', 'utf8');
  writeStream.write(JSON.stringify(users));
  // totalUserCount += users.Users.length;
  return users;
};

const fetchUsers = (cognitoIsp, params) => {
  return cognitoIsp.listUsers(params).promise().then(value => value).catch();
};
