import React from 'react';
import App from './App';
import { render, fireEvent, act, cleanup } from '@testing-library/react';
import { makeAdvanceDateNowBy } from './utils/test-utils/makeAdvanceDateNowBy';
import { MockWorker } from './__mocks__/Worker';

jest.useFakeTimers();
const startDate = 1587574443099;
const play = jest.fn();

HTMLMediaElement.prototype.play = play;
HTMLMediaElement.prototype.pause = jest.fn();

const isLastMinute = minutes => minutes <= 0;

const toTwoDigit = value => (value < 10 ? `0${value}` : String(value));

const ONE_SECOND_IN_MS = 1000;

describe('App', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    window.Worker = undefined;
  });

  beforeEach(() => {
    HTMLMediaElement.prototype.play = play;
    window.Worker = MockWorker;
  });

  it('should run intervals correctly', () => {
    const { getByTestId } = render(<App />);

    const roundInput = getByTestId('rounds-input');
    const workIntervalMinuteInput = getByTestId('work-interval-input-minutes');
    const workIntervalSecondInput = getByTestId('work-interval-input-seconds');
    const breakIntervalMinuteInput = getByTestId(
      'break-interval-input-minutes'
    );
    const breakIntervalSecondInput = getByTestId(
      'break-interval-input-seconds'
    );
    const startButton = getByTestId('start-button');

    expect(workIntervalMinuteInput).toBeTruthy();
    expect(workIntervalSecondInput).toBeTruthy();
    expect(breakIntervalMinuteInput).toBeTruthy();

    const prepTime = 5;

    const workMinutesValue = '1';
    const workSecondsValue = '1';
    const workMinutes = Number(workMinutesValue);
    const workSeconds = Number(workSecondsValue);

    const breakMinutesValue = '1';
    const breakSecondsValue = '1';
    const breakMinutes = Number(breakMinutesValue);
    const breakSeconds = Number(breakSecondsValue);

    const roundsValue = '2';

    fireEvent.change(roundInput, { target: { value: roundsValue } });
    fireEvent.blur(roundInput);

    fireEvent.change(workIntervalMinuteInput, {
      target: { value: workMinutesValue },
    });
    fireEvent.change(workIntervalSecondInput, {
      target: { value: workSecondsValue },
    });

    fireEvent.change(breakIntervalMinuteInput, {
      target: { value: breakMinutesValue },
    });
    fireEvent.change(breakIntervalSecondInput, {
      target: { value: breakSecondsValue },
    });

    const advanceDateNowBy = makeAdvanceDateNowBy(startDate);

    fireEvent.click(startButton);

    const timeLeftMinutes = getByTestId('time-left-minutes');
    const timeLeftSeconds = getByTestId('time-left-seconds');

    const round = getByTestId('round');

    const status = getByTestId('status');

    expect(round.textContent).toBe('0/2');
    expect(status.textContent).toBe('PREP');

    // count down from 00:05
    for (let prepSeconds = prepTime; prepSeconds > 0; prepSeconds--) {
      expect(timeLeftSeconds.value).toBe(toTwoDigit(prepSeconds));
      advanceDateNowBy(ONE_SECOND_IN_MS);
      act(() => {
        jest.advanceTimersByTime(ONE_SECOND_IN_MS);
      });
    }

    expect(round.textContent).toBe('1/2');
    expect(status.textContent).toBe('WORK');

    // count down from 01:01
    for (let minutes = workMinutes; minutes >= 0; minutes--) {
      const secondsToCountInMinute = minutes >= 1 ? workSeconds : 59;
      expect(timeLeftMinutes.value).toBe(toTwoDigit(minutes));

      for (
        let seconds = secondsToCountInMinute;
        seconds >= (isLastMinute(minutes) ? 1 : 0);
        seconds--
      ) {
        expect(timeLeftSeconds.value).toBe(toTwoDigit(seconds));
        advanceDateNowBy(ONE_SECOND_IN_MS);
        act(() => {
          jest.advanceTimersByTime(ONE_SECOND_IN_MS);
        });
      }
    }

    expect(status.textContent).toBe('REST');

    // 01:01
    for (let minutes = breakMinutes; minutes >= 0; minutes--) {
      let secondsToCountInMinute = minutes >= 1 ? breakSeconds : 59;

      expect(timeLeftMinutes.value).toBe(toTwoDigit(minutes));

      for (
        let seconds = secondsToCountInMinute;
        seconds >= (isLastMinute(minutes) ? 1 : 0);
        seconds--
      ) {
        expect(timeLeftSeconds.value).toBe(toTwoDigit(seconds));
        advanceDateNowBy(ONE_SECOND_IN_MS);
        act(() => {
          jest.advanceTimersByTime(ONE_SECOND_IN_MS);
        });
      }
    }

    expect(round.textContent).toBe('2/2');
    expect(status.textContent).toBe('WORK');

    // 01:01
    for (let minutes = workMinutes; minutes >= 0; minutes--) {
      let secondsToCountInMinute = minutes >= 1 ? workSeconds : 59;
      expect(timeLeftMinutes.value).toBe(toTwoDigit(minutes));

      for (
        let seconds = secondsToCountInMinute;
        seconds >= (isLastMinute(minutes) ? 1 : 0);
        seconds--
      ) {
        expect(timeLeftSeconds.value).toBe(toTwoDigit(seconds));
        advanceDateNowBy(ONE_SECOND_IN_MS);
        act(() => {
          jest.advanceTimersByTime(ONE_SECOND_IN_MS);
        });
      }
    }

    expect(play).toHaveBeenCalledTimes(15);
  });

  it('should stop interval when clicking button again', () => {
    const { getByTestId } = render(<App />);
    const roundInput = getByTestId('rounds-input');
    const workIntervalMinuteInput = getByTestId('work-interval-input-minutes');
    const workIntervalSecondInput = getByTestId('work-interval-input-seconds');
    const breakIntervalMinuteInput = getByTestId(
      'break-interval-input-minutes'
    );
    const breakIntervalSecondInput = getByTestId(
      'break-interval-input-seconds'
    );
    const startButton = getByTestId('start-button');

    expect(roundInput).toBeTruthy();
    expect(workIntervalMinuteInput).toBeTruthy();
    expect(workIntervalSecondInput).toBeTruthy();
    expect(breakIntervalMinuteInput).toBeTruthy();
    expect(breakIntervalSecondInput).toBeTruthy();
    expect(startButton).toBeTruthy();

    const prepTime = 5;

    const workMinutesValue = '1';
    const workSecondsValue = '1';

    const breakMinutesValue = '1';
    const breakSecondsValue = '1';

    const roundsValue = '2';

    fireEvent.change(roundInput, { target: { value: roundsValue } });
    fireEvent.blur(roundInput);

    fireEvent.change(workIntervalMinuteInput, {
      target: { value: workMinutesValue },
    });
    fireEvent.change(workIntervalSecondInput, {
      target: { value: workSecondsValue },
    });

    fireEvent.change(breakIntervalMinuteInput, {
      target: { value: breakMinutesValue },
    });
    fireEvent.change(breakIntervalSecondInput, {
      target: { value: breakSecondsValue },
    });

    const advanceDateNowBy = makeAdvanceDateNowBy(startDate);

    fireEvent.click(startButton);
    const timeLeftSeconds = getByTestId('time-left-seconds');
    const round = getByTestId('round');
    const status = getByTestId('status');
    expect(round.textContent).toBe('0/2');
    expect(status.textContent).toBe('PREP');

    // count down from 00:05 and stop after two seconds
    for (let prepSeconds = prepTime; prepSeconds > 2; prepSeconds--) {
      expect(timeLeftSeconds.value).toBe(toTwoDigit(prepSeconds));
      advanceDateNowBy(ONE_SECOND_IN_MS);
      act(() => {
        jest.advanceTimersByTime(ONE_SECOND_IN_MS);
      });
    }

    fireEvent.click(startButton);
    expect(play).toHaveBeenCalledTimes(2);
  });
});
