export class MockWorker {
  interval = null;
  callback = () => {};
  addEventListener = (_event, callback) => {
    this.callback = callback;
  };

  postMessage = (e) => {
    if (e === 'START') {
      this.interval = setInterval(() => {
        this.callback({ data: 'TICK' });
      }, 1000);
    }
    if (e === 'STOP') {
      clearInterval(this.interval);
    }
  };
}
