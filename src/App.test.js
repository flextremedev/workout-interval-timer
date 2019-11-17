import React from 'react';
import App from './App';
import { render, fireEvent, act, cleanup } from '@testing-library/react';
jest.useFakeTimers();
const load = jest.fn();
const play = jest.fn();
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
    act(() => {
      fireEvent.change(roundInput, { target: { value: '2' } });
    });
    act(() => {
      fireEvent.change(workIntervalSecondInput, { target: { value: '2' } });
    });
    act(() => {
      fireEvent.change(breakIntervalSecondInput, { target: { value: '1' } });
    });
    act(() => {
      fireEvent.click(startButton);
    });
    const timeLeft = getByTestId('time-left-seconds');
    const round = getByTestId('round');
    const status = getByTestId('status');
    expect(round.textContent).toBe('0/2');
    expect(timeLeft.value).toBe('03');
    expect(status.textContent).toBe('PREPARE');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.value).toBe('02');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.value).toBe('01');
    act(() => jest.advanceTimersByTime(1000));
    expect(round.textContent).toBe('1/2');
    expect(timeLeft.value).toBe('02');
    expect(status.textContent).toBe('WORK');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.value).toBe('01');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.value).toBe('01');
    expect(status.textContent).toBe('REST');
    act(() => jest.advanceTimersByTime(1000));
    expect(round.textContent).toBe('2/2');
    expect(timeLeft.value).toBe('02');
    expect(status.textContent).toBe('WORK');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.value).toBe('01');
    act(() => jest.advanceTimersByTime(1000));
    expect(load).toHaveBeenCalledTimes(8);
    expect(play).toHaveBeenCalledTimes(8);
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
    act(() => {
      fireEvent.change(roundInput, { target: { value: '2' } });
    });
    act(() => {
      fireEvent.change(workIntervalSecondInput, { target: { value: '2' } });
    });
    act(() => {
      fireEvent.change(breakIntervalSecondInput, { target: { value: '1' } });
    });
    act(() => {
      fireEvent.click(startButton);
    });
    const timeLeft = getByTestId('time-left-seconds');
    const round = getByTestId('round');
    const status = getByTestId('status');
    expect(round.textContent).toBe('0/2');
    expect(timeLeft.value).toBe('03');
    expect(status.textContent).toBe('PREPARE');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.value).toBe('02');
    act(() => {
      fireEvent.click(startButton);
    });
    expect(load).toHaveBeenCalledTimes(2);
    expect(play).toHaveBeenCalledTimes(2);
  });
});
