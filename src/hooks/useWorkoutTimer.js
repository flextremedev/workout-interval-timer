import React from 'react';
import { subSeconds, getSeconds, addSeconds, getMinutes } from 'date-fns';
import { useAudio } from './useAudio';
const SECONDS_PER_MINUTE = 60;
const Status = {
  stopped: 'stopped',
  prework: 'prework',
  work: 'work',
  break: 'break',
};
export function useWorkoutTimer() {
  const { audio: beepBreak } = useAudio('./BeepBreak.mp3');
  const { audio: beepWork } = useAudio('./BeepWork.mp3');
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
      beepBreak.load();
      beepBreak.play();
    } else {
      setStatus(Status.stopped);
    }
  }, [rounds, status, beepBreak]);
  React.useEffect(() => {
    let interval = null;
    if (status !== Status.stopped && interval === null) {
      interval = setInterval(function countDown() {
        const secondsLeft =
          getMinutes(timeLeftRef.current) * SECONDS_PER_MINUTE +
          getSeconds(timeLeftRef.current);
        if (secondsLeft > 1) {
          if (secondsLeft <= 4 && secondsLeft > 0) {
            if (status === Status.prework || status === Status.break) {
              beepBreak.load();
              beepBreak.play();
            } else {
              beepWork.load();
              beepWork.play();
            }
          }
          setTimeLeft(previousTimeLeft => subSeconds(previousTimeLeft, 1));
        } else {
          // work start
          if (
            (statusRef.current === Status.prework ||
              statusRef.current === Status.break) &&
            roundsLeftRef.current > 0 &&
            workInterval.valueOf() !== 0
          ) {
            setStatus(Status.work);
            setTimeLeft(workInterval);
            // final round
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
            if (secondsLeft <= 4 && secondsLeft > 0) {
              beepBreak.load();
              beepBreak.play();
            }
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
  }, [breakInterval, rounds, status, workInterval, beepWork, beepBreak]);
  return {
    rounds,
    handleRoundsChange,
    workInterval,
    setWorkInterval,
    breakInterval,
    setBreakInterval,
    start,
    timeLeft,
    status,
  };
}
