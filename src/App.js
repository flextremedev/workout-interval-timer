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

const DEFAULT_DOCUMENT_TITLE = 'HI!';

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
      <Helmet defer={false}>
        <title>
          {status !== Status.STOPPED
            ? format(timeLeft, 'mm:ss')
            : DEFAULT_DOCUMENT_TITLE}
        </title>
      </Helmet>
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
