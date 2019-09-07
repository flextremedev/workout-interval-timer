import React from 'react';
import { format, getSeconds, subSeconds } from 'date-fns';

function App() {
  // TODO: refactor to status stopped, prework, work, break
  const [isRunning, setIsRunning] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(new Date(10000));
  let interval = React.useRef(null);
  let timeLeftRef = React.useRef(timeLeft);
  timeLeftRef.current = timeLeft;

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
      <input type="time" value={timeLeft.get} />
      <label>Break interval</label>
      <input type="time" />
      <button onClick={start}>{!isRunning ? 'Start' : 'x'}</button>
      <span>{format(timeLeft, 'mm:ss')}</span>
    </div>
  );
}

export default App;
