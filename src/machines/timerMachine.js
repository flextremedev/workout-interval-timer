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
export const timerMachine = createMachine(
  {
    id: 'timer',
    context: {
      timeLeft: new Date(3000),
      rounds: 2,
      roundsLeft: 0,
      workInterval: new Date(5000),
      breakInterval: new Date(5000),
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
            actions: 'countdown',
            cond: 'shouldCountDown',
          },
          '': {
            target: Status.WORK,
            cond: 'shouldTransition',
          },
        },
        entry: assign({
          timeLeft: () => {
            return new Date(3000);
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
            actions: 'countdown',
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
        entry: assign({
          timeLeft: ctx => {
            return ctx.workInterval;
          },
          roundsLeft: ctx => ctx.roundsLeft - 1,
        }),
        invoke: {
          src: 'ticker',
        },
      },
      [Status.BREAK]: {
        on: {
          [timerEvents.STOP]: Status.STOPPED,
          [timerEvents.TICK]: {
            actions: 'countdown',
            cond: 'shouldCountDown',
          },
          '': {
            target: Status.WORK,
            cond: 'shouldTransition',
          },
        },
        entry: assign({
          timeLeft: ctx => {
            return ctx.breakInterval;
          },
        }),
        invoke: {
          src: 'ticker',
        },
      },
    },
  },
  {
    actions: {
      countdown: assign(ctx => {
        if (hasOneSecondElapsed(ctx.timestamp)) {
          const secondsLeft =
            getMinutes(ctx.timeLeft) * SECONDS_PER_MINUTE +
            getSeconds(ctx.timeLeft);
          return {
            timestamp: Date.now(),
            timeLeft:
              secondsLeft > 0 ? subSeconds(ctx.timeLeft, 1) : ctx.timeLeft,
          };
        }
        return {
          timestamp: ctx.timestamp,
          timeLeft: ctx.timeLeft,
        };
      }),
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
