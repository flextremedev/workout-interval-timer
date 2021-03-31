let interval = null;
self.addEventListener('message', e => {
  if (e.data === 'START') {
    interval = setInterval(() => {
      self.postMessage('TICK');
    }, 5);
  }
  if (e.data === 'STOP') {
    clearInterval(interval);
  }
});
