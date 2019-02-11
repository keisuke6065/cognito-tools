const {expect, test} = require('@oclif/test');
const sinon = require('sinon');

// mock
const registration = require('../../src/executer/force-registration');

const region = 'test region';
const clientId = 'test clientId';
const filePath = 'test filePath';

const totalCount = 3;
const successCount = 1;
const failCount = 2;

describe('force-registration', () => {
  const stub = sinon.stub(registration, 'main');
  stub.returns(new Promise(resolve => {
    return resolve(
        {totalCount, successCount, failCount},
    );
  }));
  test.stdout().
      command([
        'force-registration',
        '--region', region,
        '--clientId', clientId,
        '--input', filePath,
      ]).
      it('runs registration parameter test', ctx => {
        expect(ctx.stdout).to.contain(`totalUserCount: ${totalCount}`);
        expect(ctx.stdout).to.contain(`successUserCount: ${successCount}`);
        expect(ctx.stdout).to.contain(`failUserCount: ${failCount}`);
      });

  it('runs registration parameter fail test', () => {
    test.stderr().command(['registration', '--region', region]).exit([2]);
  });
});
