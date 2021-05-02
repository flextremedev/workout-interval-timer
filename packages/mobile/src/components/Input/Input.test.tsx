import { render, fireEvent } from '@testing-library/react-native';
import * as React from 'react';

import { Input } from './Input';

describe('Input', () => {
  it('should trigger onChange when value has changed', () => {
    const handleChange = jest.fn();
    const value = 'Hello';
    const { getByDisplayValue } = render(
      <Input label="Test" value={value} onChange={handleChange} />
    );
    const input = getByDisplayValue(value);
    fireEvent.changeText(input, 'Hello!');
    expect(handleChange).toHaveBeenCalled();
  });

  it('should work with number', () => {
    const handleChange = jest.fn();
    const { getByDisplayValue } = render(
      <Input label="Test" value={'2'} onChange={handleChange} type="number" />
    );
    fireEvent.changeText(getByDisplayValue('2'), 'e');
    expect(handleChange).toHaveBeenCalledTimes(0);

    fireEvent.changeText(getByDisplayValue('2'), '1');
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('1');
  });

  it('should work with max and min', () => {
    const handleChange = jest.fn();
    const { getByDisplayValue } = render(
      <Input
        label="Test"
        value={'2'}
        onChange={handleChange}
        type="number"
        max={3}
        min={1}
      />
    );
    fireEvent.changeText(getByDisplayValue('2'), '4');
    expect(handleChange).toHaveBeenCalledTimes(0);

    fireEvent.changeText(getByDisplayValue('2'), '0');
    expect(handleChange).toHaveBeenCalledTimes(0);

    fireEvent.changeText(getByDisplayValue('2'), '1');
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('1');
  });
});
