import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '../Input/Input';
import { DurationInput } from '../DurationInput/DurationInput';
import styles from './FormFields.module.css';
export function FormFields({
  rounds,
  handleRoundsChange,
  workInterval,
  setWorkInterval,
  breakInterval,
  setBreakInterval,
}) {
  return (
    <div className={`${styles.formFields}`}>
      <Input
        label={'ROUNDS'}
        type={'number'}
        value={rounds}
        onBlur={handleRoundsChange}
        dataTestId={'rounds-input'}
        min={'1'}
      />
      <DurationInput
        value={workInterval}
        onChange={setWorkInterval}
        dataTestId={'work-interval-input'}
        label={'WORK INTERVAL'}
      />
      <DurationInput
        value={breakInterval}
        onChange={setBreakInterval}
        dataTestId={'break-interval-input'}
        label={'REST INTERVAL'}
      />
    </div>
  );
}
FormFields.propTypes = {
  rounds: PropTypes.number,
  handleRoundsChange: PropTypes.func,
  workInterval: PropTypes.instanceOf(Date),
  setWorkInterval: PropTypes.func,
  breakInterval: PropTypes.instanceOf(Date),
  setBreakInterval: PropTypes.func,
};
