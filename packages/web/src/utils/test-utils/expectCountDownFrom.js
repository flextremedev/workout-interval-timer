import { act } from '@testing-library/react';

import { ONE_SECOND_IN_MS } from '../../constants/oneSecondInMs';
import { isLastMinute } from '../isLastMinutes';
import { toTwoDigitString } from '../toTwoDigitString';

export const expectCountDownFrom = ({
  seconds,
  minutes,
  toSeconds = 1,
  toMinutes = 0,
  timeLeftMinutes,
  timeLeftSeconds,
  advanceDateNowBy,
}) => {
  let firstRound = true;

  const shouldDisplayInitialSeconds = (minutesLeft) =>
    minutesLeft >= 1 || (firstRound && minutesLeft <= 0);

  for (let minutesLeft = minutes; minutesLeft >= toMinutes; minutesLeft--) {
    let secondsToCountInMinute = shouldDisplayInitialSeconds(minutesLeft)
      ? seconds
      : 59;

    expect(timeLeftMinutes.value).toBe(toTwoDigitString(minutesLeft));

    for (
      let secondsLeft = secondsToCountInMinute;
      secondsLeft >= (isLastMinute(minutesLeft) ? toSeconds : 0);
      secondsLeft--
    ) {
      expect(timeLeftSeconds.value).toBe(toTwoDigitString(secondsLeft));
      advanceDateNowBy(ONE_SECOND_IN_MS);
      act(() => {
        jest.advanceTimersByTime(ONE_SECOND_IN_MS);
      });
    }
    firstRound = false;
  }
};
