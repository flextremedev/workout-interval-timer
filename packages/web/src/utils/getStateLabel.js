import { timerStates } from '@interval-timer/core';

import { StatusDisplay } from '../model/StatusDisplay';

export const getStateLabel = (state) => {
  if (state === timerStates.PREWORK || state === timerStates.BREAK) {
    return StatusDisplay[state];
  }
  return StatusDisplay.WORK;
};
