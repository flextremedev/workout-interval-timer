import React from 'react';
import { format } from 'date-fns';
import { Button } from './components/Button/Button';
import { DurationInput } from './components/DurationInput/DurationInput';
import styles from './App.module.css';
import { Input } from './components/Input/Input';
import { useWorkoutTimer } from './hooks/useWorkoutTimer';
import { Status } from './model/Status';
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
      <div />

      <div className={styles.centerArea}>
        {status !== Status.stopped ? (
          <Counter
            timeLeft={format(timeLeft, 'mm : ss')}
            dataTestId={'time-left'}
          />
        ) : (
          <>
            <Input
              label={'Rounds'}
              type={'number'}
              value={rounds}
              onChange={handleRoundsChange}
              dataTestId={'rounds-input'}
              min={'1'}
            />
            <DurationInput
              value={workInterval}
              onChange={setWorkInterval}
              dataTestId={'work-interval-input'}
              label={'Work interval'}
            />
            <DurationInput
              value={breakInterval}
              onChange={setBreakInterval}
              dataTestId={'break-interval-input'}
              label={'Break interval'}
            />
          </>
        )}
      </div>
      <Button
        className={status !== Status.stopped ? styles.counting : undefined}
        onClick={start}
        data-testid={'start-button'}
      >
        {status === Status.stopped ? 'Start' : 'Stop'}
      </Button>
    </div>
  );
}

export default App;
