import Bottleneck from 'bottleneck';

export const limiter = (maxConcurrent: number) => {
  return new Bottleneck({
    maxConcurrent,
  });
};
