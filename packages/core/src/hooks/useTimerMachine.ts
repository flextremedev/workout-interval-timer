/* istanbul ignore file */
/* covered by app integration test */
import { useMachine } from '@xstate/react';

import { timerMachine } from '../machine/timerMachine';
import { timerStates } from '../model/timerStates';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useTimerMachine = () => {
  const [state, send, service] = useMachine(timerMachine);

  const toggleTimer = (): void => {
    if (state.value === timerStates.STOPPED) {
      send('START');
    } else {
      send('STOP');
    }
  };

  const setRounds = (rounds: string): void => {
    send({ type: 'SET_ROUNDS', rounds: Number(rounds) });
  };

  const setWorkInterval = (workInterval: Date): void => {
    send({
      type: 'SET_WORK_INTERVAL',
      workInterval,
    });
  };

  const setBreakInterval = (breakInterval: Date): void => {
    send({
      type: 'SET_BREAK_INTERVAL',
      breakInterval,
    });
  };

  return Object.freeze({
    state,
    send,
    service,
    setBreakInterval,
    setRounds,
    setWorkInterval,
    toggleTimer,
  });
};
