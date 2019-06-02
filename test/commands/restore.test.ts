import {expect, test} from '@oclif/test';

import * as sinon from 'sinon';
// mock
import * as restore from '../../src/executer/restore';

const region = 'test region';
const userPoolId = 'test userPoolId';
const filePath = 'test filePath';

const totalCount = 3;
const successCount = 1;
const failCount = 2;

describe('restore command test', () => {
  const stub = sinon.stub(restore, 'main');
  stub.returns(new Promise(resolve => {
    return resolve(
      {totalCount, successCount, failCount},
    );
  }));
  test.stdout().command([
    'restore',
    '--region', region,
    '--userPoolId', userPoolId,
    '--input', filePath,
  ]).it('runs backup parameter test', ctx => {
    expect(ctx.stdout).to.contain(`totalUserCount: ${totalCount}`);
    expect(ctx.stdout).to.contain(`successUserCount: ${successCount}`);
    expect(ctx.stdout).to.contain(`failUserCount: ${failCount}`);
  });
  it('runs restore parameter fail test', () => {
    test.stderr().command(['restore.ts.ts', '--region', region]).exit(2);
  });
});
