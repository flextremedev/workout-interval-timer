import React from 'react';
import { Button } from './components/Button/Button';
import styles from './App.module.css';
import { TimerState } from './model/TimerState';
import { FormFields } from './components/FormFields/FormFields';
import { Counter } from './components/Counter/Counter';
import { getStateLabel } from './utils/getStateLabel';
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
  const [state, send, service] = useMachine(timerMachine);

  React.useEffect(() => {
    const intervalWorker = new Worker('intervalWorker.js');

    intervalWorker.addEventListener('message', () => {
      service.send({ type: timerEvents.TICK });
    });

    service.subscribe((_state, event) => {
      if (
        event &&
        (event.type === timerEvents.START || event.type === timerEvents.STOP)
      ) {
        intervalWorker.postMessage(event.type);
      }
    });
  }, [service]);

  const toggleTimer = () => {
    if (state.value === TimerState.STOPPED) {
      send(timerEvents.START);
    } else {
      send(timerEvents.STOP);
    }
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
          {!state.matches(TimerState.STOPPED)
            ? format(timeLeft, 'mm:ss')
            : DEFAULT_DOCUMENT_TITLE}
        </title>
      </Helmet>
      <div className={styles.content}>
        <div className={styles.centerArea}>
          {state.value === TimerState.STOPPED ? (
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
          {state.matches(TimerState.STOPPED) ? 'Start' : 'Stop'}
        </Button>
      </div>
    </>
  );
}

export default App;
