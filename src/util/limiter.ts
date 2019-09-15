import Bottleneck from 'bottleneck';

export const limiter = (maxConcurrent: number, minTime?: number) => {
  if (minTime === undefined) {
    minTime = 1000 / maxConcurrent;
  }
  return new Bottleneck({
    maxConcurrent,
    minTime
  });
};
