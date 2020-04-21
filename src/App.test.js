import React from 'react';
import App from './App';
import { render, fireEvent, act, cleanup } from '@testing-library/react';
jest.useFakeTimers();
const load = jest.fn();
const play = jest.fn();
function getSecondsStepper(seconds) {
  return function* expectCountFrom() {
    if (seconds > 0) {
      for (let i = seconds; i >= 1; i--) {
        const value = i < 10 ? `0${i}` : String(i);
        expect(yield).toBe(value);
        act(() => jest.advanceTimersByTime(1000));
      }
    }
  };
}
HTMLMediaElement.prototype.load = load;
HTMLMediaElement.prototype.play = play;
describe('App', () => {
  let load;
  let play;
  afterEach(() => {
    cleanup();
  });
  beforeEach(() => {
    load = jest.fn();
    play = jest.fn();
    HTMLMediaElement.prototype.load = load;
    HTMLMediaElement.prototype.play = play;
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
    expect(roundInput).toBeTruthy();
    expect(workIntervalMinuteInput).toBeTruthy();
    expect(workIntervalSecondInput).toBeTruthy();
    expect(breakIntervalMinuteInput).toBeTruthy();
    expect(breakIntervalSecondInput).toBeTruthy();
    expect(startButton).toBeTruthy();
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
    fireEvent.click(startButton);
    const timeLeft = getByTestId('time-left-seconds');
    const round = getByTestId('round');
    const status = getByTestId('status');
    expect(round.textContent).toBe('0/2');
    expect(status.textContent).toBe('PREP');
    expect(timeLeft.value).toBe('05');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.value).toBe('04');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.value).toBe('03');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.value).toBe('02');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.value).toBe('01');
    act(() => jest.advanceTimersByTime(1000));
    expect(round.textContent).toBe('1/2');
    expect(status.textContent).toBe('WORK');
    let secondsLeft = getSecondsStepper(Number(workSecondsValue))();
    // enter generator function
    secondsLeft.next();
    for (let i = Number(workSecondsValue); i > 0; i--) {
      // count down to zero seconds
      secondsLeft.next(timeLeft.value);
    }
    expect(status.textContent).toBe('REST');
    secondsLeft = getSecondsStepper(Number(breakSecondsValue))();
    secondsLeft.next();
    for (let i = Number(breakSecondsValue); i > 0; i--) {
      secondsLeft.next(timeLeft.value);
    }
    expect(round.textContent).toBe('2/2');
    expect(status.textContent).toBe('WORK');
    secondsLeft = getSecondsStepper(Number(workSecondsValue))();
    secondsLeft.next();
    for (let i = Number(workSecondsValue); i > 0; i--) {
      secondsLeft.next(timeLeft.value);
    }
    expect(load).toHaveBeenCalledTimes(15);
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
    fireEvent.change(roundInput, { target: { value: '2' } });
    fireEvent.blur(roundInput);
    fireEvent.change(workIntervalSecondInput, { target: { value: '2' } });
    fireEvent.change(breakIntervalSecondInput, { target: { value: '1' } });
    fireEvent.click(startButton);
    const timeLeft = getByTestId('time-left-seconds');
    const round = getByTestId('round');
    const status = getByTestId('status');
    expect(round.textContent).toBe('0/2');
    expect(timeLeft.value).toBe('05');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.value).toBe('04');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.value).toBe('03');
    expect(status.textContent).toBe('PREP');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.value).toBe('02');
    fireEvent.click(startButton);
    expect(load).toHaveBeenCalledTimes(2);
    expect(play).toHaveBeenCalledTimes(2);
  });
});
