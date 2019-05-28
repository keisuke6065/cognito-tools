const bottleneck = require('bottleneck');


exports.limiter = (maxConcurrent,minTime) => {
  return new bottleneck({
    maxConcurrent: maxConcurrent,
    minTime: minTime,
  });
};
