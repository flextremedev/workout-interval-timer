import { assign, createMachine, send } from 'xstate';
import { hasOneSecondElapsed } from '../utils/hasOneSecondElapsed';
import { Status } from '../model/Status';
import { getMinutes, getSeconds, subSeconds } from 'date-fns';
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
      id: 'timer',
      context: {
        prepareTime: new Date(5000),
        timeLeft: new Date(5000),
        rounds: 2,
        roundsLeft: 0,
        workInterval: new Date(0),
        breakInterval: new Date(0),
        timestamp: Date.now(),
        interval: 50,
      },
      initial: Status.STOPPED,
      states: {
        [Status.STOPPED]: {
          on: {
            [timerEvents.START]: {
              target: Status.PREWORK,
              actions: assign({
                timestamp: () => {
                  return Date.now();
                },
                roundsLeft: ctx => {
                  return ctx.rounds;
                },
              }),
            },
            [timerEvents.SET_ROUNDS]: {
              actions: assign({
                rounds: (_context, event) => {
                  return event.rounds;
                },
              }),
            },
            [timerEvents.SET_BREAK_INTERVAL]: {
              actions: assign({
                breakInterval: (_context, event) => {
                  return event.breakInterval;
                },
              }),
            },
            [timerEvents.SET_WORK_INTERVAL]: {
              actions: assign({
                workInterval: (_context, event) => {
                  return event.workInterval;
                },
              }),
            },
          },
          entry: send(timerEvents.STOP),
        },
        [Status.PREWORK]: {
          on: {
            [timerEvents.STOP]: Status.STOPPED,
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
                target: Status.STOPPED,
                cond: 'isDone',
              },
              {
                target: Status.WORK,
                cond: 'shouldTransition',
              },
            ],
          },
          entry: 'initPrepare',
        },
        [Status.WORK]: {
          on: {
            [timerEvents.STOP]: Status.STOPPED,
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
                target: Status.STOPPED,
                cond: 'isDone',
              },
              {
                target: Status.BREAK,
                cond: 'shouldTransition',
              },
            ],
          },
          entry: ['initWork', 'beepWorkLong'],
        },
        [Status.BREAK]: {
          on: {
            [timerEvents.STOP]: Status.STOPPED,
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
              target: Status.WORK,
              cond: 'shouldTransition',
            },
          },
          entry: ['initBreak', 'beepBreakLong'],
        },
      },
    },
    {
      actions: {
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
            getSeconds(ctx.timeLeft) <= 0 &&
            (ctx.roundsLeft <= 0 ||
              getSeconds(ctx.workInterval) === 0 ||
              getSeconds(ctx.breakInterval) === 0)
          );
        },
      },
    }
  );
