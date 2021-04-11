import { render, fireEvent } from '@testing-library/react-native';
import * as React from 'react';

import { Input } from './Input';

describe('Input', () => {
  it('should trigger onChange when value has changed', () => {
    const handleChange = jest.fn();
    const value = 'Hello';
    const { getByDisplayValue } = render(
      <Input value={value} onChange={handleChange} />
    );
    const input = getByDisplayValue(value);
    fireEvent.changeText(input, 'Hello!');
    expect(handleChange).toHaveBeenCalled();
  });
});
