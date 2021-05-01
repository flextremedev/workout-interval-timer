import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';

import { DoubleDigitInput } from './DoubleDigitInput';

describe('DoubleDigitInput', () => {
  it('should handle input', () => {
    let value = '00';
    const handleChange = (text: string): void => {
      value = text;
    };
    const { getByDisplayValue, rerender } = render(
      <DoubleDigitInput onChangeText={handleChange} value={value} />
    );

    expect(getByDisplayValue('00')).toBeTruthy();

    fireEvent.changeText(getByDisplayValue('00'), '1');
    rerender(<DoubleDigitInput onChangeText={handleChange} value={value} />);
    fireEvent.changeText(getByDisplayValue('1'), '12');
    rerender(<DoubleDigitInput onChangeText={handleChange} value={value} />);

    expect(getByDisplayValue('12')).toBeTruthy();
  });

  it('should be readonly', () => {
    const handleChange = jest.fn();
    const { getByDisplayValue } = render(
      <DoubleDigitInput
        onChangeText={handleChange}
        value="00"
        editable={false}
      />
    );
    fireEvent.changeText(getByDisplayValue('00'), '1');
    expect(handleChange).toHaveBeenCalledTimes(0);
  });

  it('should handle invalid input', () => {
    let value = '00';
    const handleChange = (text: string): void => {
      value = text;
    };
    const { getByDisplayValue, queryByDisplayValue } = render(
      <DoubleDigitInput onChangeText={handleChange} value={value} />
    );

    expect(getByDisplayValue('00')).toBeTruthy();

    fireEvent.changeText(getByDisplayValue('00'), 'e');

    expect(queryByDisplayValue('e')).toBeFalsy();
  });
});
