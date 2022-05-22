let queue = [];
export function queueJob(job) {
  console.log("执行队列==", queue);
  if (!queue.includes(job)) {
    queue.push(job);
    queueFlush();
  }
}
let isFlushPending = false;
function queueFlush() {
  if (!isFlushPending) {
    isFlushPending = true;
    Promise.resolve().then(flushJobs);
  }
}
function flushJobs() {
  isFlushPending = false;
  // 清空根据调用顺序
  queue.sort((a, b) => a.id - b.id);
  for (let i = 0; i < queue.length; i++) {
    const job = queue[i];
    job();
  }
  queue.length = 0;
}
