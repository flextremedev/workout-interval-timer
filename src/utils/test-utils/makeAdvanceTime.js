export function makeAdvanceTime(millisToAdvance, ...advanceTimeCallbacks) {
  return function makeJestAdvanceTimeWithAdditionalCallback() {
    if (advanceTimeCallbacks) {
      advanceTimeCallbacks.forEach(callback => callback(millisToAdvance));
    }
  };
}
