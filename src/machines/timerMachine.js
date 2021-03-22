import { assign, createMachine, send } from 'xstate';
import { hasOneSecondElapsed } from '../utils/hasOneSecondElapsed';
import { TimerState } from '../model/TimerState';
import { getMinutes, getSeconds, subSeconds } from 'date-fns';
import { TimerRunningState } from '../model/TimerRunningState.';
export const timerEvents = {
  START: 'START',
  WORK: 'WORK',
  BREAK: 'BREAK',
  STOP: 'STOP',
  TICK: 'TICK',
  SET_ROUNDS: 'SET_ROUNDS',
  SET_WORK_INTERVAL: 'SET_WORK_INTERVAL',
  SET_BREAK_INTERVAL: 'SET_BREAK_INTERVAL',
};
const SECONDS_PER_MINUTE = 60;

const countDown = ctx => {
  return {
    timestamp: Date.now(),
    timeLeft: subSeconds(ctx.timeLeft, 1),
  };
};
const shouldCountDown = ctx => {
  return getSeconds(ctx.timeLeft) > 0 && hasOneSecondElapsed(ctx.timestamp);
};

export const buildTimerMachine = ({
  beepBreak,
  beepWork,
  beepBreakLong,
  beepWorkLong,
}) =>
  createMachine(
    {
      context: {
        prepareTime: new Date(5000),
        timeLeft: new Date(5000),
        rounds: 2,
        roundsLeft: 0,
        workInterval: new Date(0),
        breakInterval: new Date(0),
        timestamp: Date.now(),
      },
      initial: TimerState.STOPPED,
      states: {
        [TimerState.STOPPED]: {
          on: {
            [timerEvents.START]: {
              target: TimerRunningState.PREWORK,
            },
            [timerEvents.SET_ROUNDS]: {
              actions: 'assignRounds',
            },
            [timerEvents.SET_BREAK_INTERVAL]: {
              actions: 'assignBreakInterval',
            },
            [timerEvents.SET_WORK_INTERVAL]: {
              actions: 'assignWorkInterval',
            },
          },
          entry: send(timerEvents.STOP),
        },
        [TimerRunningState.PREWORK]: {
          on: {
            [timerEvents.STOP]: TimerState.STOPPED,
            [timerEvents.TICK]: [
              {
                actions: 'countDownBreakLast',
                cond: 'shouldCountDownLast',
              },
              {
                actions: 'countDown',
                cond: 'shouldCountDown',
              },
            ],
            '': [
              {
                target: TimerState.STOPPED,
                cond: 'isDone',
              },
              {
                target: TimerRunningState.WORK,
                cond: 'shouldTransition',
              },
            ],
          },
          entry: 'initPrepare',
        },
        [TimerRunningState.WORK]: {
          on: {
            [timerEvents.STOP]: TimerState.STOPPED,
            [timerEvents.TICK]: [
              {
                actions: 'countDownWorkLast',
                cond: 'shouldCountDownLast',
              },
              {
                actions: 'countDown',
                cond: 'shouldCountDown',
              },
            ],
            '': [
              {
                target: TimerState.STOPPED,
                cond: 'isDone',
              },
              {
                target: TimerRunningState.BREAK,
                cond: 'shouldTransition',
              },
            ],
          },
          entry: ['initWork', 'beepWorkLong'],
        },
        [TimerRunningState.BREAK]: {
          on: {
            [timerEvents.STOP]: TimerState.STOPPED,
            [timerEvents.TICK]: [
              {
                actions: 'countDownBreakLast',
                cond: 'shouldCountDownLast',
              },
              {
                actions: 'countDown',
                cond: 'shouldCountDown',
              },
            ],
            '': {
              target: TimerRunningState.WORK,
              cond: 'shouldTransition',
            },
          },
          entry: ['initBreak', 'beepBreakLong'],
        },
      },
    },
    {
      actions: {
        assignBreakInterval: assign({
          breakInterval: (_context, event) => {
            return event.breakInterval;
          },
        }),
        assignRounds: assign({
          rounds: (_context, event) => {
            return event.rounds;
          },
        }),
        assignWorkInterval: assign({
          workInterval: (_context, event) => {
            return event.workInterval;
          },
        }),
        beepWorkLong: () => {
          beepWorkLong.play();
        },
        beepBreakLong: () => {
          beepBreakLong.play();
        },
        countDown: assign(countDown),
        countDownWorkLast: assign(ctx => {
          beepWork.pause();
          beepWork.currentTime = 0;
          beepWork.play();
          return countDown(ctx);
        }),
        countDownBreakLast: assign(ctx => {
          beepBreak.pause();
          beepBreak.currentTime = 0;
          beepBreak.play();
          return countDown(ctx);
        }),
        initBreak: assign({
          timeLeft: ctx => {
            return ctx.breakInterval;
          },
        }),
        initPrepare: assign({
          timestamp: () => {
            return Date.now();
          },
          roundsLeft: ctx => {
            return ctx.rounds;
          },
          timeLeft: ctx => {
            return ctx.prepareTime;
          },
        }),
        initWork: assign({
          timeLeft: ctx => {
            return ctx.workInterval;
          },
          roundsLeft: ctx => {
            return ctx.roundsLeft - 1;
          },
        }),
      },
      guards: {
        shouldCountDownLast: ctx => {
          const secondsLeft =
            getMinutes(ctx.timeLeft) * SECONDS_PER_MINUTE +
            getSeconds(ctx.timeLeft);
          const actualSecondsLeft = secondsLeft - 1;
          return (
            shouldCountDown(ctx) &&
            actualSecondsLeft <= 3 &&
            actualSecondsLeft > 0
          );
        },
        shouldTransition: ctx => {
          return getSeconds(ctx.timeLeft) <= 0 && ctx.roundsLeft > 0;
        },
        shouldCountDown,
        isDone: ctx => {
          return (
            getMinutes(ctx.timeLeft) <= 0 &&
            getSeconds(ctx.timeLeft) <= 0 &&
            (ctx.roundsLeft <= 0 ||
              (getMinutes(ctx.workInterval) === 0 &&
                getSeconds(ctx.workInterval) === 0) ||
              (getMinutes(ctx.breakInterval) === 0 &&
                getSeconds(ctx.breakInterval) === 0))
          );
        },
      },
    }
  );
