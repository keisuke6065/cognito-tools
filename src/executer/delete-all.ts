import Count from '../util/count';
import Cognito from '../util/cognito-util';
import {limiter} from '../util/limiter';
import {
  AdminDeleteUserRequest,
  ListUsersRequest,
  ListUsersResponse
} from 'aws-sdk/clients/cognitoidentityserviceprovider';

const limitCount = 60;
const count = new Count();

export const main = async (region: string, userPoolId: string) => {
  const cognito = new Cognito(region);
  const fetchUsers = limiter(1).wrap(async (params: ListUsersRequest) => {
    return cognito.fetchUsers(params);
  });
  const adminDeleteUser = limiter(5).wrap(async (params: AdminDeleteUserRequest) => {
    return cognito.adminDeleteUser(params);
  });
  const params: ListUsersRequest = {UserPoolId: userPoolId, Limit: limitCount};

  const executor: any = () => fetchUsers(params).then((data: ListUsersResponse) => {
    if (data.Users) {
      count.totalCountUp(data.Users.length);
      data.Users.forEach(user => {
        if (user.Username) {
          adminDeleteUser({UserPoolId: userPoolId, Username: user.Username})
            .then(() => count.successCountUp())
            .catch(error => {
              count.failCountUp();
              console.error(error);
            });
        }
      });
      if (data.PaginationToken) {
        params.PaginationToken = data.PaginationToken;
        return executor();
      }
    }
  }).catch((err: any) => console.error(err));
  executor();
  await count.waitingCountUp(1000);
  return {totalCount: count.totalCount, successCount: count.successCount, failCount: count.failCount};
};
