import { makeAdvanceTime } from './makeAdvanceTime';

describe('makeAdvanceTime()', () => {
  it('creates an advance time function which calls all provided functions with given time', () => {
    const timeToAdvance = 1000;
    const advanceDate = jest.fn();
    const performSideEffect = jest.fn();
    const advanceTime = makeAdvanceTime(
      timeToAdvance,
      advanceDate,
      performSideEffect
    );
    advanceTime();
    expect(advanceDate).toHaveBeenCalledWith(timeToAdvance);
    expect(performSideEffect).toHaveBeenCalledWith(timeToAdvance);
  });
  it("doesn't crash when no callback provided", () => {
    expect(makeAdvanceTime(1000)()).toBeFalsy();
  });
});
