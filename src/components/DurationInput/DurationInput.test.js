import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { DurationInput } from './DurationInput';
describe('DurationInput', () => {
  it('should call onChange when minutes changed', () => {
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <DurationInput
        dataTestId="test-input"
        value={new Date(0)}
        onChange={handleChange}
      />
    );
    const minuteInput = getByTestId('test-input-minutes');
    fireEvent.change(minuteInput, { target: { value: '1' } });
    expect(handleChange).toHaveBeenCalledWith(
      new Date('1970-01-01T00:01:00.000Z')
    );
  });
  it('should call onChange when seconds changed', () => {
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <DurationInput
        dataTestId="test-input"
        value={new Date(0)}
        onChange={handleChange}
      />
    );
    const secondsInput = getByTestId('test-input-seconds');
    fireEvent.change(secondsInput, { target: { value: '1' } });
    expect(handleChange).toHaveBeenCalledWith(
      new Date('1970-01-01T00:00:01.000Z')
    );
  });
  it('should not call onChange when value is non numeric', () => {
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <DurationInput
        dataTestId="test-input"
        value={new Date(0)}
        onChange={handleChange}
      />
    );
    const secondsInput = getByTestId('test-input-seconds');
    fireEvent.change(secondsInput, { target: { value: 'e' } });
    expect(handleChange).not.toHaveBeenCalled();
  });
  it('should select text on focus', () => {
    const { getByTestId } = render(
      <DurationInput dataTestId="test-input" value={new Date(0)} />
    );
    const minuteInput = getByTestId('test-input-minutes');
    const secondsInput = getByTestId('test-input-seconds');
    fireEvent.focus(minuteInput);
    expect(secondsInput.selectionStart).toBe(0);
    expect(secondsInput.selectionEnd).toBe(0);
    expect(minuteInput.selectionStart).toBe(0);
    expect(minuteInput.selectionEnd).toBe(2);
    fireEvent.blur(minuteInput);
    fireEvent.focus(secondsInput);
    expect(minuteInput.selectionStart).toBe(0);
    expect(minuteInput.selectionEnd).toBe(0);
    expect(secondsInput.selectionStart).toBe(0);
    expect(secondsInput.selectionEnd).toBe(2);
    fireEvent.blur(secondsInput);
    expect(secondsInput.selectionStart).toBe(0);
    expect(secondsInput.selectionEnd).toBe(0);
  });
  it('should not select text on focus when readOnly', () => {
    const { getByTestId } = render(
      <DurationInput dataTestId="test-input" readOnly value={new Date(0)} />
    );
    const minuteInput = getByTestId('test-input-minutes');
    const secondsInput = getByTestId('test-input-seconds');
    fireEvent.focus(minuteInput);
    expect(secondsInput.selectionStart).toBe(0);
    expect(secondsInput.selectionEnd).toBe(0);
    expect(minuteInput.selectionStart).toBe(0);
    expect(minuteInput.selectionEnd).toBe(0);
    fireEvent.blur(minuteInput);
    fireEvent.focus(secondsInput);
    expect(minuteInput.selectionStart).toBe(0);
    expect(minuteInput.selectionEnd).toBe(0);
    expect(secondsInput.selectionStart).toBe(0);
    expect(secondsInput.selectionEnd).toBe(0);
    fireEvent.blur(secondsInput);
    expect(secondsInput.selectionStart).toBe(0);
    expect(secondsInput.selectionEnd).toBe(0);
  });
});
