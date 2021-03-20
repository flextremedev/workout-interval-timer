import { StatusDisplay } from '../model/StatusDisplay';
import { TimerRunningState } from '../model/TimerRunningState.';

export const getStateLabel = state => {
  if (
    state === TimerRunningState.PREWORK ||
    state === TimerRunningState.BREAK
  ) {
    return StatusDisplay[state];
  }
  return StatusDisplay.WORK;
};
