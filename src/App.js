import React from 'react';
import { Button } from './components/Button/Button';
import styles from './App.module.css';
import { useWorkoutTimer } from './hooks/useWorkoutTimer';
import { Status } from './model/Status';
import { FormFields } from './components/FormFields/FormFields';
import { Counter } from './components/Counter/Counter';

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
  } = useWorkoutTimer();
  return (
    <div className={styles.content}>
      <div className={styles.centerArea}>
        {/* {status === Status.stopped ? ( */}
        {status === Status.work ? (
          <FormFields
            rounds={rounds}
            handleRoundsChange={handleRoundsChange}
            workInterval={workInterval}
            setWorkInterval={setWorkInterval}
            breakInterval={breakInterval}
            setBreakInterval={setBreakInterval}
          />
        ) : (
          <Counter timeLeft={timeLeft} dataTestId={'time-left'} />
        )}
      </div>
      <Button onClick={start} data-testid={'start-button'}>
        {status === Status.stopped ? 'Start' : 'Stop'}
      </Button>
    </div>
  );
}

export default App;
