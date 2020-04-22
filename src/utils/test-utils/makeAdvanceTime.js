export function makeAdvanceTime(millisToAdvance, ...advanceTimeCallbacks) {
  return function advanceTime() {
    if (advanceTimeCallbacks.length > 0) {
      advanceTimeCallbacks.forEach(callback => callback(millisToAdvance));
    }
  };
}
