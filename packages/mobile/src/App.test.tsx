import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';

import { App } from './App';

describe('App', () => {
  it('should work', () => {
    const { getByDisplayValue, getByTestId } = render(<App />);
    const workMinutesValue = '01';
    const workSecondsValue = '01';
    const workMinutes = Number(workMinutesValue);
    const workSeconds = Number(workSecondsValue);

    const breakMinutesValue = '01';
    const breakSecondsValue = '01';
    const breakMinutes = Number(breakMinutesValue);
    const breakSeconds = Number(breakSecondsValue);

    const roundsValue = '2';
    fireEvent.changeText(getByDisplayValue('1'), roundsValue);
    fireEvent.changeText(
      getByTestId('work-interval-duration-input-minutes'),
      workMinutesValue
    );
    fireEvent.changeText(
      getByTestId('work-interval-duration-input-seconds'),
      workSecondsValue
    );
    fireEvent.changeText(
      getByTestId('break-interval-duration-input-minutes'),
      breakMinutesValue
    );
    fireEvent.changeText(
      getByTestId('break-interval-duration-input-seconds'),
      breakSecondsValue
    );
  });
});
