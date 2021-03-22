import React from 'react';
import App from './App';
import { render, fireEvent, act, cleanup } from '@testing-library/react';
import { getSecondsCountDownExpect } from './utils/test-utils/getSecondsCountDownExpect';
import { makeAdvanceTime } from './utils/test-utils/makeAdvanceTime';
import { makeAdvanceDateNowBy } from './utils/test-utils/makeAdvanceDateNowBy';
import { MockWorker } from './__mocks__/Worker';

jest.useFakeTimers();
const startDate = 1587574443099;
const play = jest.fn();

HTMLMediaElement.prototype.play = play;
HTMLMediaElement.prototype.pause = jest.fn();

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
    const workSecondsValue = '5';
    const breakSecondsValue = '5';
    const roundsValue = '2';
    fireEvent.change(roundInput, { target: { value: roundsValue } });
    fireEvent.blur(roundInput);
    fireEvent.change(workIntervalSecondInput, {
      target: { value: workSecondsValue },
    });
    fireEvent.change(breakIntervalSecondInput, {
      target: { value: breakSecondsValue },
    });
    const advanceDateNowBy = makeAdvanceDateNowBy(startDate);
    const jestAdvanceTimeWithAdditionalCallback = makeAdvanceTime(
      1000,
      advanceDateNowBy,
      millisecondsToAdvance =>
        act(() => jest.advanceTimersByTime(millisecondsToAdvance))
    );
    fireEvent.click(startButton);
    const timeLeft = getByTestId('time-left-seconds');
    const round = getByTestId('round');
    const status = getByTestId('status');
    expect(round.textContent).toBe('0/2');
    expect(status.textContent).toBe('PREP');
    const prepSecondsCountDown = getSecondsCountDownExpect(
      prepTime,
      jestAdvanceTimeWithAdditionalCallback
    )();
    // enter generator function
    prepSecondsCountDown.next();
    for (let i = prepTime; i > 0; i--) {
      // count down to zero seconds
      prepSecondsCountDown.next(timeLeft.value);
    }
    expect(round.textContent).toBe('1/2');
    expect(status.textContent).toBe('WORK');
    let workSecondsCountDown = getSecondsCountDownExpect(
      Number(workSecondsValue),
      jestAdvanceTimeWithAdditionalCallback
    )();
    // enter generator function
    workSecondsCountDown.next();
    for (let i = Number(workSecondsValue); i > 0; i--) {
      // count down to zero seconds
      workSecondsCountDown.next(timeLeft.value);
    }
    expect(status.textContent).toBe('REST');
    const breakSecondsCountDown = getSecondsCountDownExpect(
      Number(breakSecondsValue),
      jestAdvanceTimeWithAdditionalCallback
    )();
    breakSecondsCountDown.next();
    for (let i = Number(breakSecondsValue); i > 0; i--) {
      breakSecondsCountDown.next(timeLeft.value);
    }
    expect(round.textContent).toBe('2/2');
    expect(status.textContent).toBe('WORK');
    workSecondsCountDown = getSecondsCountDownExpect(
      Number(workSecondsValue),
      jestAdvanceTimeWithAdditionalCallback
    )();
    workSecondsCountDown.next();
    for (let i = Number(workSecondsValue); i > 0; i--) {
      workSecondsCountDown.next(timeLeft.value);
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
    const workSecondsValue = '2';
    const breakSecondsValue = '1';
    const roundsValue = '2';
    fireEvent.change(roundInput, { target: { value: roundsValue } });
    fireEvent.blur(roundInput);
    fireEvent.change(workIntervalSecondInput, {
      target: { value: workSecondsValue },
    });
    fireEvent.change(breakIntervalSecondInput, {
      target: { value: breakSecondsValue },
    });
    const advanceDateNowBy = makeAdvanceDateNowBy(startDate);
    const jestAdvanceTimeWithAdditionalCallback = makeAdvanceTime(
      1000,
      advanceDateNowBy,
      millisecondsToAdvance =>
        act(() => jest.advanceTimersByTime(millisecondsToAdvance))
    );
    fireEvent.click(startButton);
    const timeLeft = getByTestId('time-left-seconds');
    const round = getByTestId('round');
    const status = getByTestId('status');
    expect(round.textContent).toBe('0/2');
    expect(status.textContent).toBe('PREP');
    const prepSecondsCountDown = getSecondsCountDownExpect(
      prepTime,
      jestAdvanceTimeWithAdditionalCallback
    )();
    // enter generator function
    prepSecondsCountDown.next();
    for (let i = prepTime; i > 2; i--) {
      // count down to two seconds
      prepSecondsCountDown.next(timeLeft.value);
    }
    fireEvent.click(startButton);
    expect(play).toHaveBeenCalledTimes(2);
  });
});
