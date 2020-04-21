import React from 'react';
import beepBreakFile from '../BeepBreak.mp3';
import beepBreakLongFile from '../BeepBreakLong.mp3';
import beepWorkFile from '../BeepWork.mp3';
import beepWorkLongFile from '../BeepWorkLong.mp3';
import { subSeconds, getSeconds, addSeconds, getMinutes } from 'date-fns';
import { useAudio } from './useAudio';
const SECONDS_PER_MINUTE = 60;
const PREP_TIME_SECONDS = 5;
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
  const handleRoundsChange = value => {
    setRounds(Number(value));
  };
  const start = React.useCallback(() => {
    const shouldStart = status === Status.stopped;
    if (shouldStart) {
      setStatus(Status.prework);
      setTimeLeft(addSeconds(new Date(0), PREP_TIME_SECONDS));
      setRoundsLeft(rounds);
    } else {
      setStatus(Status.stopped);
    }
  }, [rounds, status]);
  React.useEffect(() => {
    let interval = null;
    const startWasInitiated = status !== Status.stopped && interval === null;
    if (startWasInitiated) {
      interval = setInterval(function countDown() {
        const secondsLeft =
          getMinutes(timeLeftRef.current) * SECONDS_PER_MINUTE +
          getSeconds(timeLeftRef.current);
        const shouldCountDown = secondsLeft > 1;
        if (shouldCountDown) {
          const shouldBeepFromTwoDown = secondsLeft <= 4;
          if (shouldBeepFromTwoDown) {
            const shouldGetReady =
              status === Status.prework || status === Status.break;
            if (shouldGetReady) {
              beepBreak.load();
              beepBreak.play();
            } else {
              beepWork.load();
              beepWork.play();
            }
          }
          setTimeLeft(previousTimeLeft => subSeconds(previousTimeLeft, 1));
        } else {
          const shouldSwitchToWork =
            (statusRef.current === Status.prework ||
              statusRef.current === Status.break) &&
            roundsLeftRef.current > 0 &&
            workInterval.valueOf() !== 0;
          const shouldSwitchToRest =
            statusRef.current === Status.work && roundsLeftRef.current > 0;

          if (shouldSwitchToWork) {
            beepBreakLong.load();
            beepBreakLong.play();
            setStatus(Status.work);
            setTimeLeft(workInterval);
            setRoundsLeft(prevRoundsLeft => prevRoundsLeft - 1);
          } else if (shouldSwitchToRest) {
            setStatus(Status.break);
            setTimeLeft(breakInterval);
            beepWorkLong.load();
            beepWorkLong.play();
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
