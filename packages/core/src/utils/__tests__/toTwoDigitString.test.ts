import { toTwoDigitString } from '../toTwoDigitString';

describe('toTwoDigitString()', () => {
  it('should return two digit string', () => {
    expect(toTwoDigitString(3)).toBe('03');
    expect(toTwoDigitString(30)).toBe('30');
  });
});
