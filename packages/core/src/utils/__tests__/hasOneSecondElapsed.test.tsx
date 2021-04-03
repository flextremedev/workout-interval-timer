import { hasOneSecondElapsed } from '../hasOneSecondElapsed';

describe('hasOneSecondElapsed()', () => {
  it('should return true if one second has elapsed', () => {
    const timestamp = 1587494146595;
    const timestampPlusHalfASecond = 1587494147095;
    const timestampPlusOneSecond = 1587494147595;
    expect(hasOneSecondElapsed(timestamp, timestampPlusOneSecond)).toBe(true);
    expect(hasOneSecondElapsed(timestamp, timestampPlusHalfASecond)).toBe(
      false
    );
  });
  it('should use current time by default', () => {
    const timestamp = 1587494146595;
    const currentTimeMock = 1587494147595;
    Date.now = jest.fn().mockReturnValueOnce(currentTimeMock);
    expect(hasOneSecondElapsed(timestamp)).toBe(true);
  });
});
