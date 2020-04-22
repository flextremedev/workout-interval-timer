import { getSecondsCountDownExpect } from './getSecondsCountDownExpect';

describe('getSecondsCountDownExpect()', () => {
  it('returns a generator which counts down and expects current second to equal yielded double digit value', () => {
    const countDown = getSecondsCountDownExpect(10)();
    countDown.next();
    countDown.next('10');
    countDown.next('09');
    countDown.next('08');
    countDown.next('07');
    countDown.next('06');
    countDown.next('05');
    countDown.next('04');
    countDown.next('03');
    countDown.next('02');
    countDown.next('01');
  });
  it('does not count down further', () => {
    const mockFn = jest.fn();
    const countDown = getSecondsCountDownExpect(3, mockFn)();
    countDown.next();
    countDown.next('03');
    countDown.next('02');
    countDown.next('01');
    countDown.next('00');
    countDown.next('-00');
    expect(mockFn).toHaveBeenCalledTimes(3);
  });
  it('fails on invalid input', () => {
    const countDown = getSecondsCountDownExpect(3)();
    countDown.next();
    expect(() => countDown.next(3)).toThrowError();
  });
  it('doesnt count if seconds less than one', () => {
    const mockFn = jest.fn();
    const countDown = getSecondsCountDownExpect(0, mockFn)();
    countDown.next();
    countDown.next(3);
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});
