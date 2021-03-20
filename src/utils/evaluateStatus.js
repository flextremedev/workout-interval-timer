import { TimerState } from '../model/TimerState';
import { StatusDisplay } from '../model/StatusDisplay';

export const evaluateStatus = status => {
  if (status === TimerState.PREWORK || status === TimerState.BREAK) {
    return StatusDisplay[status];
  }
  return StatusDisplay.WORK;
};
