const chai = require('chai');
const assert = chai.assert;

const Count = require('../../src/util/index');

describe('count test', () => {
  it('countUp', () => {
    const count = new Count();
    const currentTotalCount = count.state.totalCount;
    const currentSuccessCount = count.state.successCount;
    const currentFailCount = count.state.failCount;
    count.totalCountUp();
    count.successCountUp();
    count.failCountUp();
    assert.isOk((currentTotalCount + 1) === count.state.totalCount);
    assert.isOk((currentSuccessCount + 1) === count.state.successCount);
    assert.isOk((currentFailCount + 1) === count.state.failCount);
  });
  it('custom countUp', () => {
    const count = new Count();
    const currentTotalCount = count.state.totalCount;
    count.totalCountUp(10);
    assert.isOk((currentTotalCount +10) === count.state.totalCount)
  });

  it('is end?', () => {
    const count = new Count();
    count.totalCountUp();
    assert.isOk(!count.isEnd());

    count.failCountUp();
    assert.isOk(count.isEnd());
  });
});
