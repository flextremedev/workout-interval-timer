import React from 'react';

import { timerMachine, timerStates } from '@interval-timer/core';
import { useMachine } from '@xstate/react';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet';

import styles from './App.module.css';
import { Button } from './components/Button/Button';
import { Counter } from './components/Counter/Counter';
import { FormFields } from './components/FormFields/FormFields';
import { useBeep } from './hooks/useBeep';
import { getStateLabel } from './utils/getStateLabel';

const DEFAULT_DOCUMENT_TITLE = 'Interval timer';
function App() {
  const { beepBreak, beepBreakLong, beepWork, beepWorkLong } = useBeep();
  const [state, send, service] = useMachine(timerMachine, {
    actions: {
      initBreakEffect: () => {
        beepBreakLong.play();
      },
      initWorkEffect: () => {
        beepWorkLong.play();
      },
      countDownLastWorkEffect: () => {
        beepWork.pause();
        beepWork.currentTime = 0;
        beepWork.play();
      },
      countDownLastBreakEffect: () => {
        beepBreak.pause();
        beepBreak.currentTime = 0;
        beepBreak.play();
      },
    },
  });

  React.useEffect(() => {
    const intervalWorker = new Worker('intervalWorker.js');

    intervalWorker.addEventListener('message', () => {
      service.send({ type: 'TICK' });
    });

    service.subscribe((_state, event) => {
      if (event && (event.type === 'START' || event.type === 'STOP')) {
        intervalWorker.postMessage(event.type);
      }
    });
  }, [service]);

  const toggleTimer = () => {
    if (state.value === timerStates.STOPPED) {
      send('START');
    } else {
      send('STOP');
    }
  };

  const setRounds = (rounds) => {
    send({ type: 'SET_ROUNDS', rounds: Number(rounds) });
  };

  const setWorkInterval = (workInterval) => {
    send({
      type: 'SET_WORK_INTERVAL',
      workInterval,
    });
  };

  const setBreakInterval = (breakInterval) => {
    send({
      type: 'SET_BREAK_INTERVAL',
      breakInterval,
    });
  };

  const {
    breakInterval,
    rounds,
    roundsLeft,
    timeLeft,
    workInterval,
  } = state.context;

  return (
    <>
      <Helmet defer={false}>
        <title>
          {!state.matches(timerStates.STOPPED)
            ? format(timeLeft, 'mm:ss')
            : DEFAULT_DOCUMENT_TITLE}
        </title>
      </Helmet>
      <div className={styles.content}>
        <div className={styles.centerArea}>
          {state.value === timerStates.STOPPED ? (
            <FormFields
              rounds={rounds}
              handleRoundsChange={setRounds}
              workInterval={workInterval}
              setWorkInterval={setWorkInterval}
              breakInterval={breakInterval}
              setBreakInterval={setBreakInterval}
            />
          ) : (
            <Counter
              timeLeft={timeLeft}
              text={getStateLabel(state.value)}
              roundsLeft={roundsLeft}
              rounds={rounds}
            />
          )}
        </div>
        <Button onClick={toggleTimer} data-testid={'start-button'}>
          {state.matches(timerStates.STOPPED) ? 'Start' : 'Stop'}
        </Button>
      </div>
    </>
  );
}

export { App };
