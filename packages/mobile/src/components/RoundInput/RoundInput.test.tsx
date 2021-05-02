import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';

import { RoundInput } from './RoundInput';

describe('RoundInput', () => {
  it('should work with min', () => {
    let rounds = 1;
    const setRounds = jest.fn((newRounds: string): void => {
      rounds = Number(newRounds);
    });

    const {
      getByTestId,
      getByDisplayValue,
      queryByDisplayValue,
      rerender,
    } = render(
      <RoundInput
        testID="test-round-input"
        setRounds={setRounds}
        rounds={rounds}
      />
    );
    expect(getByDisplayValue('1')).toBeTruthy();

    fireEvent.press(getByTestId(/decrement/));
    rerender(
      <RoundInput
        testID="test-round-input"
        setRounds={setRounds}
        rounds={rounds}
      />
    );
    expect(queryByDisplayValue('0')).toBeFalsy();

    fireEvent.press(getByTestId(/increment/));
    rerender(
      <RoundInput
        testID="test-round-input"
        setRounds={setRounds}
        rounds={rounds}
      />
    );
    expect(getByDisplayValue('2')).toBeTruthy();
  });

  it('should work with max', () => {
    let rounds = 99;
    const setRounds = jest.fn((newRounds: string): void => {
      rounds = Number(newRounds);
    });

    const {
      getByTestId,
      getByDisplayValue,
      queryByDisplayValue,
      rerender,
    } = render(
      <RoundInput
        testID="test-round-input"
        setRounds={setRounds}
        rounds={rounds}
      />
    );

    rerender(
      <RoundInput
        testID="test-round-input"
        setRounds={setRounds}
        rounds={rounds}
      />
    );
    expect(getByDisplayValue('99')).toBeTruthy();

    fireEvent.press(getByTestId(/increment/));
    rerender(
      <RoundInput
        testID="test-round-input"
        setRounds={setRounds}
        rounds={rounds}
      />
    );
    expect(queryByDisplayValue('100')).toBeFalsy();

    fireEvent.press(getByTestId(/decrement/));
    rerender(
      <RoundInput
        testID="test-round-input"
        setRounds={setRounds}
        rounds={rounds}
      />
    );
    expect(getByDisplayValue('98')).toBeTruthy();
  });
});
