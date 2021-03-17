import React from 'react';
import { Button } from './components/Button/Button';
import styles from './App.module.css';
import { Status } from './model/Status';
import { FormFields } from './components/FormFields/FormFields';
import { Counter } from './components/Counter/Counter';
import { evaluateStatus } from './utils/evaluateStatus';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet';
import { useMachine } from '@xstate/react';
import { timerEvents, buildTimerMachine } from './machines/timerMachine';
import { useBeep } from './hooks/useBeep';

const DEFAULT_DOCUMENT_TITLE = 'Interval timer';
function App() {
  const { beepBreak, beepBreakLong, beepWork, beepWorkLong } = useBeep();
  const timerMachine = buildTimerMachine({
    beepBreak,
    beepBreakLong,
    beepWork,
    beepWorkLong,
  });
  const [state, send] = useMachine(timerMachine);

  const startTimer = () => {
    state.value === Status.STOPPED
      ? send(timerEvents.START)
      : send(timerEvents.STOP);
  };

  const setRounds = rounds => {
    send({ type: timerEvents.SET_ROUNDS, rounds: Number(rounds) });
  };

  const setWorkInterval = workInterval => {
    send({
      type: timerEvents.SET_WORK_INTERVAL,
      workInterval,
    });
  };

  const setBreakInterval = breakInterval => {
    send({
      type: timerEvents.SET_BREAK_INTERVAL,
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
          {state.value !== Status.STOPPED
            ? format(state.context.timeLeft, 'mm:ss')
            : DEFAULT_DOCUMENT_TITLE}
        </title>
      </Helmet>
      <div className={styles.content}>
        <div className={styles.centerArea}>
          {state.value === Status.STOPPED ? (
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
              text={evaluateStatus(state.value)}
              roundsLeft={roundsLeft}
              rounds={rounds}
            />
          )}
        </div>
        <Button onClick={startTimer} data-testid={'start-button'}>
          {state.value === Status.STOPPED ? 'Start' : 'Stop'}
        </Button>
      </div>
    </>
  );
}

export default App;
