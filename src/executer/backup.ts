import * as AWS from 'aws-sdk';
import * as mkdirp from 'mkdirp';
import * as JSONStream from 'JSONStream';
import * as fs from 'fs';
import {limiter} from '../util/limiter';
import Count from '../util/count';
import {ListUsersRequest, ListUsersResponse} from 'aws-sdk/clients/cognitoidentityserviceprovider';

const limitCount = 60;
const count = new Count();

export const main = async ({region, userPoolId, outputDir}: { region: string, userPoolId: string, outputDir: string }) => {
  const cognitoIsp = new AWS.CognitoIdentityServiceProvider({region});
  mkdirp.sync(outputDir);
  const writeStream = fs.createWriteStream(`${outputDir}/${userPoolId}.json`, 'utf8');
  const stringify = JSONStream.stringify();
  stringify.pipe(writeStream);

  const fetchUsers = limiter(1, 200).wrap(async (params: ListUsersRequest) => {
    return cognitoIsp.listUsers(params).promise();
  });

  const params: ListUsersRequest = {UserPoolId: userPoolId, Limit: limitCount};
  const fetch: any = () => fetchUsers(params).then((data: ListUsersResponse) => {
    if (data.Users) {
      data.Users.forEach(user => stringify.write(user as any));
      count.totalCountUp(data.Users.length);
      if (data.PaginationToken) {
        params.PaginationToken = data.PaginationToken;
        return fetch();
      }
    }
  }).catch((err: any) => console.error(err));
  return fetch().then(() => {
    stringify.end();
    return count.totalCount;
  });
};
