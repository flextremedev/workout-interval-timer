import React from 'react';
import { useMachine } from '@xstate/react';
import beepBreakFile from '../BeepBreak.mp3';
import beepBreakLongFile from '../BeepBreakLong.mp3';
import beepWorkFile from '../BeepWork.mp3';
import beepWorkLongFile from '../BeepWorkLong.mp3';
import { subSeconds, getSeconds, addSeconds, getMinutes } from 'date-fns';
import { useAudio } from './useAudio';
import { Status } from '../model/Status';
import { hasOneSecondElapsed } from '../utils/hasOneSecondElapsed';
import { Machine } from 'xstate';
const SECONDS_PER_MINUTE = 60;
const PREP_TIME_SECONDS = 5;

const statusEvents = {
  START: 'START',
  WORK: 'WORK',
  BREAK: 'BREAK',
  STOP: 'STOP',
};
const statusMachine = Machine({
  id: 'status',
  initial: Status.STOPPED,
  states: {
    [Status.STOPPED]: {
      on: { [statusEvents.START]: Status.PREWORK },
    },
    [Status.PREWORK]: {
      on: { [statusEvents.WORK]: Status.WORK, STOP: Status.STOPPED },
    },
    [Status.WORK]: {
      on: {
        [statusEvents.STOP]: Status.STOPPED,
        [statusEvents.BREAK]: Status.BREAK,
      },
    },
    [Status.BREAK]: {
      on: {
        [statusEvents.WORK]: Status.WORK,
        [statusEvents.STOP]: Status.STOPPED,
      },
    },
  },
});
export function useWorkoutTimer() {
  const { audio: beepBreak } = useAudio(beepBreakFile);
  const { audio: beepWork } = useAudio(beepWorkFile);
  const { audio: beepBreakLong } = useAudio(beepBreakLongFile);
  const { audio: beepWorkLong } = useAudio(beepWorkLongFile);
  const [status, send] = useMachine(statusMachine);
  const [timeLeft, setTimeLeft] = React.useState(new Date(0));
  const [rounds, setRounds] = React.useState(1);
  const [roundsLeft, setRoundsLeft] = React.useState(rounds);
  const [workInterval, setWorkInterval] = React.useState(new Date(0));
  const [breakInterval, setBreakInterval] = React.useState(new Date(0));
  const timestamp = React.useRef(Date.now());
  let statusRef = React.useRef(status.value);
  statusRef.current = status.value;
  let roundsLeftRef = React.useRef(roundsLeft);
  roundsLeftRef.current = roundsLeft;
  let timeLeftRef = React.useRef(timeLeft);
  timeLeftRef.current = timeLeft;
  const handleRoundsChange = value => {
    setRounds(Number(value));
  };
  const start = React.useCallback(() => {
    const shouldStart = status.value === Status.STOPPED;
    if (shouldStart) {
      timestamp.current = Date.now();
      send({ type: statusEvents.START });
      setTimeLeft(addSeconds(new Date(0), PREP_TIME_SECONDS));
      setRoundsLeft(rounds);
    } else {
      send({ type: statusEvents.STOP });
    }
  }, [rounds, status, send]);
  React.useEffect(() => {
    let interval = null;
    const startWasInitiated =
      status.value !== Status.STOPPED && interval === null;
    if (startWasInitiated) {
      interval = setInterval(function countDown() {
        if (hasOneSecondElapsed(timestamp.current)) {
          timestamp.current = Date.now();
          const secondsLeft =
            getMinutes(timeLeftRef.current) * SECONDS_PER_MINUTE +
            getSeconds(timeLeftRef.current);
          const shouldCountDown = secondsLeft > 1;
          if (shouldCountDown) {
            const shouldBeepFromTwoDown = secondsLeft <= 4;
            if (shouldBeepFromTwoDown) {
              const shouldGetReady =
                status.value === Status.PREWORK ||
                status.value === Status.BREAK;
              if (shouldGetReady) {
                beepBreak.play();
              } else {
                beepWork.play();
              }
            }
            setTimeLeft(previousTimeLeft => subSeconds(previousTimeLeft, 1));
          } else {
            const shouldSwitchToWork =
              (statusRef.current === Status.PREWORK ||
                statusRef.current === Status.BREAK) &&
              roundsLeftRef.current > 0 &&
              workInterval.valueOf() !== 0;
            const shouldSwitchToRest =
              statusRef.current === Status.WORK && roundsLeftRef.current > 0;

            if (shouldSwitchToWork) {
              beepBreakLong.play();
              send({ type: statusEvents.WORK });
              setTimeLeft(workInterval);
              setRoundsLeft(prevRoundsLeft => prevRoundsLeft - 1);
            } else if (shouldSwitchToRest) {
              send({ type: statusEvents.BREAK });
              setTimeLeft(breakInterval);
              beepWorkLong.play();
            } else {
              send({ type: statusEvents.STOP });
              clearInterval(interval);
            }
          }
        }
      }, 5);
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
    send,
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
    status: status.value,
    roundsLeft,
  };
}
