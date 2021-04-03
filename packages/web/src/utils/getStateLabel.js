import { TimerStates } from '@interval-timer/core';

import { StatusDisplay } from '../model/StatusDisplay';

export const getStateLabel = (state) => {
  if (state === TimerStates.PREWORK || state === TimerStates.BREAK) {
    return StatusDisplay[state];
  }
  return StatusDisplay.WORK;
};
