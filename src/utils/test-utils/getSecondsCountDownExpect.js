export function getSecondsCountDownExpect(seconds, timeAdvanceFn) {
  return function* expectCountFrom() {
    if (seconds > 0) {
      for (let i = seconds; i >= 1; i--) {
        const value = i < 10 ? `0${i}` : String(i);
        expect(yield).toBe(value);
        if (timeAdvanceFn) {
          timeAdvanceFn();
        }
      }
    }
  };
}
