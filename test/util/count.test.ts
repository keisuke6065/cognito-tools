import * as chai from 'chai';
import Count from '../../src/util/count';

const assert = chai.assert;
describe('count test', () => {
  it('countUp', () => {
    const count = new Count();
    const currentTotalCount = count.totalCount;
    const currentSuccessCount = count.successCount;
    const currentFailCount = count.failCount;
    count.totalCountUp();
    count.successCountUp();
    count.failCountUp();
    assert.isOk((currentTotalCount + 1) === count.totalCount);
    assert.isOk((currentSuccessCount + 1) === count.successCount);
    assert.isOk((currentFailCount + 1) === count.failCount);
  });
  it('custom countUp', () => {
    const count = new Count();
    const currentTotalCount = count.totalCount;
    count.totalCountUp(10);
    assert.isOk((currentTotalCount + 10) === count.totalCount);
  });

  it('is end?', () => {
    const count = new Count();
    count.totalCountUp();
    assert.isOk(!count.isEnd());

    count.failCountUp();
    assert.isOk(count.isEnd());
  });
});
