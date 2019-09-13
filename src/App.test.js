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
    const workIntervalInput = getByTestId('work-interval-input');
    const breakIntervalInput = getByTestId('break-interval-input');
    const startButton = getByTestId('start-button');
    expect(queryByTestId('time-left')).toBeFalsy();
    expect(roundInput).toBeTruthy();
    expect(workIntervalInput).toBeTruthy();
    expect(breakIntervalInput).toBeTruthy();
    expect(startButton).toBeTruthy();
    act(() => {
      fireEvent.change(roundInput, { target: { value: 2 } });
    });
    act(() => {
      fireEvent.change(workIntervalInput, { target: { value: '00:02' } });
    });
    act(() => {
      fireEvent.change(breakIntervalInput, { target: { value: '00:01' } });
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
    const workIntervalInput = getByTestId('work-interval-input');
    const breakIntervalInput = getByTestId('break-interval-input');
    const startButton = getByTestId('start-button');
    expect(queryByTestId('time-left')).toBeFalsy();
    expect(roundInput).toBeTruthy();
    expect(workIntervalInput).toBeTruthy();
    expect(breakIntervalInput).toBeTruthy();
    expect(startButton).toBeTruthy();
    act(() => {
      fireEvent.change(roundInput, { target: { value: 2 } });
    });
    act(() => {
      fireEvent.change(workIntervalInput, { target: { value: '00:02' } });
    });
    act(() => {
      fireEvent.change(breakIntervalInput, { target: { value: '00:01' } });
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
