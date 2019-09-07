import React from 'react';
import {
  format,
  getSeconds,
  subSeconds,
  addSeconds,
  addMinutes,
} from 'date-fns';

function App() {
  // TODO: refactor to status stopped, prework, work, break
  const [isRunning, setIsRunning] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(new Date(0));
  let interval = React.useRef(null);
  let timeLeftRef = React.useRef(timeLeft);
  timeLeftRef.current = timeLeft;
  const handleWorkIntervalChange = e => {
    const { value } = e.target;
    const [minutes, seconds] = value.split(':');
    setTimeLeft(addSeconds(addMinutes(new Date(0), minutes), seconds));
  };
  const start = () => {
    if (!isRunning) {
      setIsRunning(true);
      interval.current = setInterval(function countDown() {
        if (getSeconds(timeLeftRef.current) > 0) {
          setTimeLeft(previousTimeLeft => subSeconds(previousTimeLeft, 1));
        } else {
          setIsRunning(false);
          clearInterval(interval.current);
        }
      }, 1000);
    } else {
      setIsRunning(false);
      clearInterval(interval.current);
    }
  };
  return (
    <div className="App">
      <label>Rounds</label>
      <input type="text" />
      <label>Work interval</label>
      <input
        type="time"
        value={format(timeLeft, 'mm:ss')}
        onChange={handleWorkIntervalChange}
      />
      <label>Break interval</label>
      <input type="time" />
      <button onClick={start}>{!isRunning ? 'Start' : 'x'}</button>
      {isRunning ? <span>{format(timeLeft, 'mm:ss')}</span> : null}
    </div>
  );
}

export default App;
