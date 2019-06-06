import {expect, test} from '@oclif/test';

import * as sinon from 'sinon';
// mock
import * as deleter from '../../src/executer/delete';

const region = 'test region';
const userPoolId = 'test userPoolId';
const filePath = 'test filePath';

const totalCount = 3;
const successCount = 1;
const failCount = 2;

describe('delete command test', () => {
  const stub = sinon.stub(deleter, 'main');
  stub.returns(new Promise(resolve => {
    return resolve(
      {totalCount, successCount, failCount},
    );
  }));
  test.stdout().command([
    'delete',
    '--region', region,
    '--userPoolId', userPoolId,
    '--input', filePath,
  ]).it('runs backup parameter test', ctx => {
    expect(ctx.stdout).to.contain(`totalUserCount: ${totalCount}`);
    expect(ctx.stdout).to.contain(`successUserCount: ${successCount}`);
    expect(ctx.stdout).to.contain(`failUserCount: ${failCount}`);
  });
  it('runs delete parameter fail test', () => {
    test.stderr().command(['delete.ts', '--region', region]).exit(2);
  });
});
