import * as chai from "chai";
import {createParam} from "../../src/util/cognito-util";

const assert = chai.assert;


describe('Restore test', () => {
  const userPoolId = 'hoge';
  const data = {
    'Username': '0416cdc1-b426-4d66-8f0b-c26896f39c4a',
    'Attributes': [
      {
        'Name': 'sub',
        'Value': '0416cdc1-b426-4d66-8f0b-c26896f39c4a',
      },
      {'Name': 'custom:testId', 'Value': '92'},
      {'Name': 'email_verified', 'Value': 'false'},
      {'Name': 'nickname', 'Value': 'test92'},
      {
        'Name': 'email',
        'Value': '286769e2-2dca-11e9-a61d-4773f52589b1@exmaple.com',
      }],
    'UserCreateDate': '2019-02-11T06:57:48.304Z',
    'UserLastModifiedDate': '2019-02-11T06:57:48.304Z',
    'Enabled': true,
    'UserStatus': 'UNCONFIRMED',
  };
  const param = createParam(userPoolId, data);
  it('eq createParam', () => {
    assert.deepEqual(param.UserPoolId, userPoolId);
    assert.deepEqual(param.Username, data.Attributes[4].Value);
    assert.notDeepInclude(param.UserAttributes, { // this attribute will be filtered
      'Name': 'sub',
      'Value': '0416cdc1-b426-4d66-8f0b-c26896f39c4a',
    });
  });
});
