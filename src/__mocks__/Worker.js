export class MockWorker {
  interval = null;
  addEventListener = jest.fn((event, callback) => {
    this.interval = setInterval(callback, 50);
  });
  terminate = jest.fn(() => {
    clearInterval(this.interval);
  });
}
