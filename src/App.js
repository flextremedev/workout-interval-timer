import React from 'react';
import { format, getSeconds, subSeconds, addSeconds } from 'date-fns';
import { Button } from './components/Button/Button';
import { DurationInput } from './components/DurationInput/DurationInput';
import styles from './App.module.css';
const Status = {
  stopped: 'stopped',
  prework: 'prework',
  work: 'work',
  break: 'break',
};

function App() {
  const [status, setStatus] = React.useState(Status.stopped);
  const [timeLeft, setTimeLeft] = React.useState(new Date(0));
  const [rounds, setRounds] = React.useState(1);
  const [roundsLeft, setRoundsLeft] = React.useState(rounds);
  const [workInterval, setWorkInterval] = React.useState(new Date(0));
  const [breakInterval, setBreakInterval] = React.useState(new Date(0));
  let statusRef = React.useRef(status);
  statusRef.current = status;
  let roundsLeftRef = React.useRef(roundsLeft);
  roundsLeftRef.current = roundsLeft;
  let timeLeftRef = React.useRef(timeLeft);
  timeLeftRef.current = timeLeft;
  const handleRoundsChange = e => {
    setRounds(e.target.value);
  };
  const start = React.useCallback(() => {
    if (status === Status.stopped) {
      setStatus(Status.prework);
      setTimeLeft(addSeconds(new Date(0), 3));
      setRoundsLeft(rounds);
    } else {
      setStatus(Status.stopped);
    }
  }, [rounds, status]);
  React.useEffect(() => {
    let interval = null;
    if (status !== Status.stopped && interval === null) {
      interval = setInterval(function countDown() {
        if (getSeconds(timeLeftRef.current) > 0) {
          setTimeLeft(previousTimeLeft => subSeconds(previousTimeLeft, 1));
        } else {
          if (
            (statusRef.current === Status.prework ||
              statusRef.current === Status.break) &&
            roundsLeftRef.current > 0
          ) {
            setStatus(Status.work);
            setTimeLeft(workInterval);
            if (roundsLeftRef.current === 1) {
              setRoundsLeft(prevRoundsLeft => prevRoundsLeft - 1);
            }
          } else if (
            statusRef.current === Status.work &&
            roundsLeftRef.current > 0
          ) {
            setStatus(Status.break);
            setTimeLeft(breakInterval);
            setRoundsLeft(prevRoundsLeft => prevRoundsLeft - 1);
          } else {
            setStatus(Status.stopped);
            clearInterval(interval);
          }
        }
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [breakInterval, rounds, status, workInterval]);
  return (
    <div className={styles.background}>
      <label>Rounds</label>
      <input
        data-testid={'rounds-input'}
        type="number"
        value={rounds}
        onChange={handleRoundsChange}
        min={1}
      />
      <label>Work interval</label>
      <DurationInput
        value={workInterval}
        onChange={setWorkInterval}
        dataTestId={'work-interval-input'}
      />
      <label>Break interval</label>
      <DurationInput
        value={breakInterval}
        onChange={setBreakInterval}
        dataTestId={'break-interval-input'}
      />
      <Button onClick={start} data-testid={'start-button'}>
        {status === Status.stopped ? 'Start' : 'x'}
      </Button>
      {status !== Status.stopped ? (
        <span data-testid={'time-left'}>{format(timeLeft, 'mm:ss')}</span>
      ) : null}
    </div>
  );
}

export default App;
