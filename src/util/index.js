const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = class Count {
  constructor() {
    this.state = {
      totalCount: 0,
      successCount: 0,
      failCount: 0,
    };
  }

  totalCountUp(number) {
    if (number) {
      this.state.totalCount += number;
      return;
    }
    this.state.totalCount += 1;
  }

  successCountUp() {
    this.state.successCount += 1;
  }

  failCountUp() {
    this.state.failCount += 1;
  }

  isEnd() {
    return this.state.totalCount ===
        (this.state.failCount + this.state.successCount);
  }

  async waitingCountUp(ms) {
    do {
      await sleep(ms);
    } while (!this.isEnd());
  }
};
