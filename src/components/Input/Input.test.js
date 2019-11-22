import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('should trigger onChange when value has changed', () => {
    const handleChange = jest.fn();
    const value = 'Hello';
    const { getByDisplayValue } = render(
      <Input value={value} onChange={handleChange} />
    );
    const input = getByDisplayValue(value);
    fireEvent.change(input, { target: { value: 'Hello!' } });
    expect(handleChange).toHaveBeenCalled();
  });
  it('should have width of value.length times 0.625em and at least 0.625em', () => {
    const value = 'Hello';
    const { getByDisplayValue, rerender } = render(
      <Input value={value} readOnly />
    );
    let input = getByDisplayValue(value);
    expect(input.style.width).toBe('3.125em');
    rerender(<Input value="" readOnly />);
    input = getByDisplayValue('');
    expect(input.style.width).toBe('0.625em');
  });
});
