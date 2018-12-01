const {expect, test} = require('@oclif/test');
const sinon = require('sinon');

// mock
const restore = require('../../src/executer/restore');

const region = 'test region';
const userPoolId = 'test userPoolId';

const totalUserCount = 3;
const successUserCount = 1;
const failUserCount = 2;

describe('restore command test', () => {
  const stub = sinon.stub(restore, 'main');
  stub.returns(new Promise(resolve => {
    return resolve(
        {totalUserCount, successUserCount, failUserCount},
    );
  }));

  test.stdout().
      command(['restore', '--region', region, '--userPoolId', userPoolId]).
      it('runs backup parameter test', ctx => {
        expect(ctx.stdout).to.contain(`totalUserCount: ${totalUserCount}`);
        expect(ctx.stdout).to.contain(`successUserCount: ${successUserCount}`);
        expect(ctx.stdout).to.contain(`failUserCount: ${failUserCount}`);
      });
  it('runs restore parameter fail test', () => {
    test.stderr().command(['restore', '--region', region]).exit(2);
  });
});
