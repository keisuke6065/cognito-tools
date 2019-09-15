import Bottleneck from 'bottleneck';

export const limiter = (maxConcurrent: number, minTime: number) => {
  return new Bottleneck({
    maxConcurrent,
    minTime
  });
};
