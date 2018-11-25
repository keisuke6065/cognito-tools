const {expect, test} = require('@oclif/test');
const sinon = require('sinon');

// mock
const backup = require('../../src/executer/backup');

describe('backup', () => {
  // stub
  const stub = sinon.stub(backup, 'main');
  stub.returns(new Promise(resolve => resolve()));

  test.stdout().command(['backup']).it('runs backup', ctx => {
    expect(ctx.stdout).to.contain(`target region`);
    expect(ctx.stdout).to.contain(`target userPoolId`);
  });

  const region = 'test region';
  const userPoolId = 'test userPoolId';
  test.stdout().
    command(['backup', '--region', region, '--userPoolId', userPoolId]).
    it('runs backup parameter test', ctx => {
      expect(ctx.stdout).to.contain(`target region ${region}`);
      expect(ctx.stdout).to.contain(`target userPoolId ${userPoolId}`);
    });
});
