import React from 'react';
import {
  format,
  getSeconds,
  subSeconds,
  addSeconds,
  addMinutes,
} from 'date-fns';

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
  let interval = React.useRef(null);
  let statusRef = React.useRef(status);
  statusRef.current = status;
  let roundsLeftRef = React.useRef(roundsLeft);
  roundsLeftRef.current = roundsLeft;
  let timeLeftRef = React.useRef(timeLeft);
  timeLeftRef.current = timeLeft;
  const countDown = React.useCallback(() => {
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
        clearInterval(interval.current);
      }
    }
  }, [roundsLeftRef, workInterval, breakInterval]);
  const handleRoundsChange = e => {
    setRounds(e.target.value);
    setRoundsLeft(e.target.value);
  };
  const handleWorkIntervalChange = e => {
    const { value } = e.target;
    const [minutes, seconds] = value.split(':');
    setWorkInterval(addSeconds(addMinutes(new Date(0), minutes), seconds));
  };
  const handleBreakIntervalChange = e => {
    const { value } = e.target;
    const [minutes, seconds] = value.split(':');
    setBreakInterval(addSeconds(addMinutes(new Date(0), minutes), seconds));
  };
  const start = React.useCallback(() => {
    if (status === Status.stopped) {
      setStatus(Status.prework);
      setTimeLeft(addSeconds(new Date(0), 3));
      interval.current = setInterval(countDown, 1000);
    } else {
      setStatus(Status.stopped);
      clearInterval(interval.current);
    }
  }, [countDown, status]);
  return (
    <div className="App">
      <label>Rounds</label>
      <input
        type="number"
        value={rounds}
        onChange={handleRoundsChange}
        min={1}
      />
      <label>Work interval</label>
      <input
        type="time"
        value={format(workInterval, 'mm:ss')}
        onChange={handleWorkIntervalChange}
      />
      <label>Break interval</label>
      <input
        type="time"
        value={format(breakInterval, 'mm:ss')}
        onChange={handleBreakIntervalChange}
      />
      <button onClick={start}>
        {status === Status.stopped ? 'Start' : 'x'}
      </button>
      {status !== Status.stopped ? (
        <span>{format(timeLeft, 'mm:ss')}</span>
      ) : null}
    </div>
  );
}

export default App;
