import React from 'react';
import PropTypes from 'prop-types';
import { format, setSeconds, setMinutes } from 'date-fns';
import { formatStringAsDoubleDigit } from './formatStringAsDoubleDigit';
import styles from './DurationInput.module.css';
export function DurationInput({ dataTestId, value, onChange, label }) {
  const minutesRef = React.useRef(null);
  const secondsRef = React.useRef(null);
  const handleMinutesChange = e => {
    e.stopPropagation();
    if (e.target.value) {
      const { value: targetValue } = e.target;
      if (targetValue.match(/^[0-9]*$/)) {
        const formattedValue = formatStringAsDoubleDigit(targetValue);
        onChange(setMinutes(new Date(value.valueOf()), formattedValue));
      }
    }
  };
  const handleSecondsChange = e => {
    secondsRef.current.select();
    e.stopPropagation();
    if (e.target.value) {
      const { value: targetValue } = e.target;
      if (targetValue.match(/^[0-9]*$/)) {
        const formattedValue = formatStringAsDoubleDigit(targetValue);
        onChange(setSeconds(new Date(value.valueOf()), formattedValue));
      }
    }
  };
  const handleMinutesFocus = () => {
    minutesRef.current.select();
  };
  const handleSecondsFocus = () => {
    secondsRef.current.select();
  };
  const handlePaste = e => {
    e.preventDefault();
  };
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <div className={styles.input}>
        <input
          type="text"
          value={format(value, 'mm')}
          onChange={handleMinutesChange}
          onPaste={handlePaste}
          data-testid={dataTestId && `${dataTestId}-minutes`}
          className={styles.textInput}
          ref={minutesRef}
          onFocus={handleMinutesFocus}
        />
        :
        <input
          type="text"
          value={format(value, 'ss')}
          onChange={handleSecondsChange}
          onPaste={handlePaste}
          data-testid={dataTestId && `${dataTestId}-seconds`}
          className={styles.textInput}
          ref={secondsRef}
          onFocus={handleSecondsFocus}
        />
      </div>
    </div>
  );
}
DurationInput.propTypes = {
  dataTestId: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.instanceOf(Date).isRequired,
};
