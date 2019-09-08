import React from 'react';
import {
  format,
  getSeconds,
  subSeconds,
  addSeconds,
  addMinutes,
} from 'date-fns';
import { Button } from './components/Button/Button';

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
      }
    }
  }, [roundsLeftRef, workInterval, breakInterval]);
  const handleRoundsChange = e => {
    setRounds(e.target.value);
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
      setRoundsLeft(rounds);
    } else {
      setStatus(Status.stopped);
    }
  }, [status, rounds]);
  React.useEffect(() => {
    if (status !== Status.stopped) {
      interval.current = setInterval(countDown, 1000);
    } else {
      clearInterval(interval.current);
    }
    return () => clearInterval(interval.current);
  }, [status, countDown]);
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
      <Button onClick={start}>
        {status === Status.stopped ? 'Start' : 'x'}
      </Button>
      {status !== Status.stopped ? (
        <span>{format(timeLeft, 'mm:ss')}</span>
      ) : null}
    </div>
  );
}

// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       status: Status.stopped,
//       timeLeft: new Date(0),
//       rounds: 1,
//       roundsLeft: 1,
//       workInterval: new Date(0),
//       breakInterval: new Date(0),
//     };
//   }
//   interval = null;
//   countDown = () => {
//     if (getSeconds(this.state.timeLeft) > 0) {
//       this.setState(prevState => ({
//         timeLeft: subSeconds(prevState.timeLeft, 1),
//       }));
//     } else {
//       if (
//         (this.state.status === Status.prework ||
//           this.state.status === Status.break) &&
//         this.state.roundsLeft > 0
//       ) {
//         this.setState({
//           status: Status.work,
//           timeLeft: this.state.workInterval,
//         });
//         if (this.state.roundsLeft === 1) {
//           this.setState(prevState => ({
//             roundsLeft: prevState.roundsLeft - 1,
//           }));
//         }
//       } else if (
//         this.state.status === Status.work &&
//         this.state.roundsLeft > 0
//       ) {
//         this.setState(prevState => ({
//           status: Status.break,
//           timeLeft: this.state.breakInterval,
//           roundsLeft: prevState.roundsLeft - 1,
//         }));
//       } else {
//         this.setState({ status: Status.stopped });
//         clearInterval(this.interval);
//       }
//     }
//   };
//   handleRoundsChange = e => {
//     const { value } = e.target;
//     this.setState({ rounds: value, roundsLeft: value });
//   };
//   handleWorkIntervalChange = e => {
//     const { value } = e.target;
//     const [minutes, seconds] = value.split(':');
//     this.setState({
//       workInterval: addSeconds(addMinutes(new Date(0), minutes), seconds),
//     });
//   };
//   handleBreakIntervalChange = e => {
//     const { value } = e.target;
//     const [minutes, seconds] = value.split(':');
//     this.setState({
//       breakInterval: addSeconds(addMinutes(new Date(0), minutes), seconds),
//     });
//   };
//   start = () => {
//     if (this.state.status === Status.stopped) {
//       this.setState({
//         status: Status.prework,
//         timeLeft: addSeconds(new Date(0), 3),
//       });
//       this.interval = setInterval(this.countDown, 1000);
//     } else {
//       this.setState({ status: Status.stopped });
//       clearInterval(this.interval);
//     }
//   };
//   render() {
//     const {
//       rounds,
//       workInterval,
//       breakInterval,
//       status,
//       timeLeft,
//     } = this.state;
//     const {
//       handleRoundsChange,
//       handleWorkIntervalChange,
//       handleBreakIntervalChange,
//       start,
//     } = this;
//     return (
//       <div className="App">
//         <label>Rounds</label>
//         <input
//           type="number"
//           value={rounds}
//           onChange={handleRoundsChange}
//           min={1}
//         />
//         <label>Work interval</label>
//         <input
//           type="time"
//           value={format(workInterval, 'mm:ss')}
//           onChange={handleWorkIntervalChange}
//         />
//         <label>Break interval</label>
//         <input
//           type="time"
//           value={format(breakInterval, 'mm:ss')}
//           onChange={handleBreakIntervalChange}
//         />
//         <Button onClick={start}>
//           {status === Status.stopped ? 'Start' : 'x'}
//         </Button>
//         {status !== Status.stopped ? (
//           <span>{format(timeLeft, 'mm:ss')}</span>
//         ) : null}
//       </div>
//     );
//   }
// }

export default App;
