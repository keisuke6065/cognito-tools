import {expect, test} from '@oclif/test';
import * as sinon from 'sinon';
// mock
import * as backup from '../../src/executer/backup';

const region = 'test region';
const userPoolId = 'test userPoolId';

describe('backup command test', () => {
  // stub
  const stub = sinon.stub(backup, 'main');
  stub.returns(new Promise(resolve => resolve()));

  test.stdout().command(['backup', '--region', region, '--userPoolId', userPoolId]).it('runs backup parameter test', ctx => {
    expect(ctx.stdout).to.contain(`target region ${region}`);
    expect(ctx.stdout).to.contain(`target userPoolId ${userPoolId}`);
  });
  it('runs backup parameter fail test', () => {
    test.stderr().command(['backup', '--region', region]).exit(2);
  });
});
