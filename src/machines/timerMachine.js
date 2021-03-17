import { assign, createMachine } from 'xstate';
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

const buildCountDown = ({ onCountEnd, countEndSeconds = 3 }) =>
  assign(ctx => {
    if (hasOneSecondElapsed(ctx.timestamp)) {
      const secondsLeft =
        getMinutes(ctx.timeLeft) * SECONDS_PER_MINUTE +
        getSeconds(ctx.timeLeft);
      const actualSecondsLeft = secondsLeft - 1;
      if (actualSecondsLeft <= countEndSeconds && actualSecondsLeft > 0) {
        onCountEnd();
      }
      return {
        timestamp: Date.now(),
        timeLeft: subSeconds(ctx.timeLeft, 1),
      };
    }
    return {
      timestamp: ctx.timestamp,
      timeLeft: ctx.timeLeft,
    };
  });

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
                roundsLeft: ctx => ctx.rounds,
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
        },
        [Status.PREWORK]: {
          on: {
            [timerEvents.STOP]: Status.STOPPED,
            [timerEvents.TICK]: {
              actions: buildCountDown({
                onCountEnd: () => {
                  beepBreak.pause();
                  beepBreak.currentTime = 0;
                  beepBreak.play();
                },
              }),
              cond: 'shouldCountDown',
            },
            '': {
              target: Status.WORK,
              cond: 'shouldTransition',
            },
          },
          entry: assign({
            timeLeft: ctx => {
              return ctx.prepareTime;
            },
          }),
          invoke: {
            src: 'ticker',
          },
        },
        [Status.WORK]: {
          on: {
            [timerEvents.STOP]: Status.STOPPED,
            [timerEvents.TICK]: {
              actions: buildCountDown({
                onCountEnd: () => {
                  beepWork.pause();
                  beepWork.currentTime = 0;
                  beepWork.play();
                },
              }),
              cond: 'shouldCountDown',
            },
            '': [
              {
                target: Status.BREAK,
                cond: 'shouldTransition',
              },
              {
                target: Status.STOPPED,
                cond: 'isDone',
              },
            ],
          },
          entry: [
            assign({
              timeLeft: ctx => {
                return ctx.workInterval;
              },
              roundsLeft: ctx => ctx.roundsLeft - 1,
            }),
            'beepWorkLong',
          ],
          invoke: {
            src: 'ticker',
          },
        },
        [Status.BREAK]: {
          on: {
            [timerEvents.STOP]: Status.STOPPED,
            [timerEvents.TICK]: {
              actions: buildCountDown({
                onCountEnd: () => {
                  beepBreak.pause();
                  beepBreak.currentTime = 0;
                  beepBreak.play();
                },
              }),
              cond: 'shouldCountDown',
            },
            '': {
              target: Status.WORK,
              cond: 'shouldTransition',
            },
          },
          entry: [
            assign({
              timeLeft: ctx => {
                return ctx.breakInterval;
              },
            }),
            'beepBreakLong',
          ],
          invoke: {
            src: 'ticker',
          },
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
      },
      guards: {
        shouldTransition: ctx => {
          return getSeconds(ctx.timeLeft) <= 0 && ctx.roundsLeft > 0;
        },
        shouldCountDown: ctx => {
          return getSeconds(ctx.timeLeft) > 0;
        },
        isDone: ctx => {
          return getSeconds(ctx.timeLeft) <= 0 && ctx.roundsLeft <= 0;
        },
      },
      services: {
        ticker: ctx => sendBack => {
          const interval = setInterval(() => {
            sendBack(timerEvents.TICK);
          }, ctx.interval);
          return () => {
            clearInterval(interval);
          };
        },
      },
    }
  );
