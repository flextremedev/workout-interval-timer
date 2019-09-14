import { formatStringAsDoubleDigit } from './formatStringAsDoubleDigit';

describe('formatStringAsDoubleDigit()', () => {
  it('formats strings to double digit < 60', () => {
    expect(formatStringAsDoubleDigit('')).toBe('00');
    expect(formatStringAsDoubleDigit('000')).toBe('00');
    expect(formatStringAsDoubleDigit('012')).toBe('12');
    expect(formatStringAsDoubleDigit('599')).toBe('09');
  });
});
