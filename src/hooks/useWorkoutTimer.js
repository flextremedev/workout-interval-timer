import React from 'react';
import beepBreakFile from '../BeepBreak.mp3';
import beepBreakLongFile from '../BeepBreakLong.mp3';
import beepWorkFile from '../BeepWork.mp3';
import beepWorkLongFile from '../BeepWorkLong.mp3';
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
  const { audio: beepBreak } = useAudio(beepBreakFile);
  const { audio: beepWork } = useAudio(beepWorkFile);
  const { audio: beepBreakLong } = useAudio(beepBreakLongFile);
  const { audio: beepWorkLong } = useAudio(beepWorkLongFile);
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
    setRounds(Number(e.target.value));
  };
  const start = React.useCallback(() => {
    if (status === Status.stopped) {
      beepBreak.load();
      beepBreak.play();
      setStatus(Status.prework);
      setTimeLeft(addSeconds(new Date(0), 3));
      setRoundsLeft(rounds);
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
          if (secondsLeft <= 4) {
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
            beepBreakLong.load();
            beepBreakLong.play();
            setStatus(Status.work);
            setTimeLeft(workInterval);
            setRoundsLeft(prevRoundsLeft => prevRoundsLeft - 1);
            // rest
          } else if (
            statusRef.current === Status.work &&
            roundsLeftRef.current > 0
          ) {
            setStatus(Status.break);
            setTimeLeft(breakInterval);
            if (secondsLeft <= 4 && secondsLeft > 0) {
              beepWorkLong.load();
              beepWorkLong.play();
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
  }, [
    breakInterval,
    rounds,
    status,
    workInterval,
    beepWork,
    beepBreak,
    beepBreakLong,
    beepWorkLong,
  ]);
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
    roundsLeft,
  };
}
