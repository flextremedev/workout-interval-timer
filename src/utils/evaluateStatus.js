import { Status } from '../model/Status';
import { StatusDisplay } from '../model/StatusDisplay';

export const evaluateStatus = status => {
  if (status === Status.PREWORK || status === Status.BREAK) {
    return StatusDisplay[status];
  }
  return StatusDisplay.WORK;
};
