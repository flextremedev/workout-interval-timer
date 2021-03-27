import * as React from 'react';
import { render } from '@testing-library/react';
import App from '../../App';

export const renderApp = () => {
  const { getByTestId } = render(<App />);

  const roundInput = getByTestId('rounds-input');
  const workIntervalMinuteInput = getByTestId('work-interval-input-minutes');
  const workIntervalSecondInput = getByTestId('work-interval-input-seconds');
  const breakIntervalMinuteInput = getByTestId('break-interval-input-minutes');
  const breakIntervalSecondInput = getByTestId('break-interval-input-seconds');
  const startButton = getByTestId('start-button');
  const prepTime = 5;

  return {
    roundInput,
    workIntervalMinuteInput,
    workIntervalSecondInput,
    breakIntervalMinuteInput,
    breakIntervalSecondInput,
    startButton,
    prepTime,
    getByTestId,
  };
};
