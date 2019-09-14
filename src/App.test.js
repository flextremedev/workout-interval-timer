import React from 'react';
import App from './App';
import { render, fireEvent, act, cleanup } from '@testing-library/react';
jest.useFakeTimers();
describe('App', () => {
  afterEach(() => {
    cleanup();
  });
  it('should run intervals correctly', () => {
    const { getByTestId, queryByTestId } = render(<App />);
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
    expect(queryByTestId('time-left')).toBeFalsy();
    expect(roundInput).toBeTruthy();
    expect(workIntervalMinuteInput).toBeTruthy();
    expect(workIntervalSecondInput).toBeTruthy();
    expect(breakIntervalMinuteInput).toBeTruthy();
    expect(breakIntervalSecondInput).toBeTruthy();
    expect(startButton).toBeTruthy();
    act(() => {
      fireEvent.change(roundInput, { target: { value: 2 } });
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
    const timeLeft = getByTestId('time-left');
    expect(timeLeft.textContent).toBe('00:03');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.textContent).toBe('00:02');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.textContent).toBe('00:01');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.textContent).toBe('00:00');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.textContent).toBe('00:02');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.textContent).toBe('00:01');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.textContent).toBe('00:00');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.textContent).toBe('00:01');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.textContent).toBe('00:00');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.textContent).toBe('00:02');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.textContent).toBe('00:01');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.textContent).toBe('00:00');
    act(() => jest.advanceTimersByTime(1000));
    expect(queryByTestId('time-left')).toBeFalsy();
  });
  it('should stop interval when clicking button again', () => {
    const { getByTestId, queryByTestId } = render(<App />);
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
    expect(queryByTestId('time-left')).toBeFalsy();
    expect(roundInput).toBeTruthy();
    expect(workIntervalMinuteInput).toBeTruthy();
    expect(workIntervalSecondInput).toBeTruthy();
    expect(breakIntervalMinuteInput).toBeTruthy();
    expect(breakIntervalSecondInput).toBeTruthy();
    expect(startButton).toBeTruthy();
    act(() => {
      fireEvent.change(roundInput, { target: { value: 2 } });
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
    const timeLeft = getByTestId('time-left');
    expect(timeLeft.textContent).toBe('00:03');
    act(() => jest.advanceTimersByTime(1000));
    expect(timeLeft.textContent).toBe('00:02');
    act(() => {
      fireEvent.click(startButton);
    });
    expect(queryByTestId('time-left')).toBeFalsy();
  });
});
