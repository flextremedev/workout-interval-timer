import React from 'react';
import { Button } from './components/Button/Button';
import styles from './App.module.css';
import { useWorkoutTimer } from './hooks/useWorkoutTimer';
import { Status } from './model/Status';
import { FormFields } from './components/FormFields/FormFields';
import { Counter } from './components/Counter/Counter';
import { evaluateStatus } from './utils/evaluateStatus';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet';

function App() {
  const {
    rounds,
    handleRoundsChange,
    workInterval,
    setWorkInterval,
    breakInterval,
    setBreakInterval,
    start,
    timeLeft,
    status,
    roundsLeft,
  } = useWorkoutTimer();
  return (
    <>
      {status !== Status.STOPPED ? (
        <Helmet defer={false}>
          <title>{format(timeLeft, 'mm:ss')}</title>
        </Helmet>
      ) : null}

      <div className={styles.content}>
        <div className={styles.centerArea}>
          {status === Status.STOPPED ? (
            <FormFields
              rounds={rounds}
              handleRoundsChange={handleRoundsChange}
              workInterval={workInterval}
              setWorkInterval={setWorkInterval}
              breakInterval={breakInterval}
              setBreakInterval={setBreakInterval}
            />
          ) : (
            <Counter
              timeLeft={timeLeft}
              text={evaluateStatus(status)}
              roundsLeft={roundsLeft}
              rounds={rounds}
            />
          )}
        </div>
        <Button onClick={start} data-testid={'start-button'}>
          {status === Status.STOPPED ? 'Start' : 'Stop'}
        </Button>
      </div>
    </>
  );
}

export default App;
