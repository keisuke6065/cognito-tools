const sleep = (ms: number) => {
  // tslint:disable-next-line no-string-based-set-timeout
  return new Promise(resolve => setTimeout(resolve, ms));
};

export default class Count {
  totalCount: number;
  successCount: number;
  failCount: number;

  constructor() {
    this.totalCount = 0;
    this.successCount = 0;
    this.failCount = 0;
  }

  totalCountUp(number?: number) {
    if (number) {
      this.totalCount += number;
      return;
    }
    this.totalCount++;
  }

  successCountUp() {
    this.successCount++;
  }

  failCountUp() {
    this.failCount++;
  }

  isEnd() {
    return this.totalCount ===
      (this.failCount + this.successCount);
  }

  async waitingCountUp(ms: number) {
    do {
      await sleep(ms);
    } while (!this.isEnd());
  }
}
