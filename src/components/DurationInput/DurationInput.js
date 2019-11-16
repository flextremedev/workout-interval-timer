import React from 'react';
import PropTypes from 'prop-types';
import { format, setSeconds, setMinutes } from 'date-fns';
import styles from './DurationInput.module.css';
import { addNumberAtEndShifting } from './addNumberAtEndShifting';
export function DurationInput({
  dataTestId,
  value,
  onChange,
  label,
  readOnly,
}) {
  const formattedMinutes = format(value, 'mm');
  const formattedSeconds = format(value, 'ss');
  const minutesRef = React.useRef(null);
  const secondsRef = React.useRef(null);
  const handleChange = e => {
    e.stopPropagation();
    if (e.target.value && e.target.name) {
      const { value: targetValue, name } = e.target;
      if (targetValue.match(/^[0-9]*$/)) {
        if (name === 'minutes') {
          const formattedTargetValue = addNumberAtEndShifting(
            formattedMinutes,
            targetValue
          );
          onChange(setMinutes(new Date(value.valueOf()), formattedTargetValue));
        } else if (name === 'seconds') {
          const formattedTargetValue = addNumberAtEndShifting(
            formattedSeconds,
            targetValue
          );
          onChange(setSeconds(new Date(value.valueOf()), formattedTargetValue));
        }
      }
    }
  };
  const handleMinutesSelect = e => {
    e.preventDefault();
    if (!readOnly) {
      minutesRef.current.select();
    }
  };
  const handleMinutesBlur = () => {
    minutesRef.current.selectionEnd = minutesRef.current.selectionStart;
  };
  const handleSecondsSelect = e => {
    e.preventDefault();
    if (!readOnly) {
      secondsRef.current.select();
    }
  };
  const handleSecondsBlur = () => {
    secondsRef.current.selectionEnd = secondsRef.current.selectionStart;
  };
  const handlePaste = e => {
    e.preventDefault();
  };
  return (
    <div className={styles.container}>
      {label ? <label className={styles.label}>{label}</label> : null}
      <div className={styles.input}>
        <input
          type="text"
          name="minutes"
          value={formattedMinutes}
          onChange={handleChange}
          onPaste={handlePaste}
          onMouseDown={handleMinutesSelect}
          onBlur={handleMinutesBlur}
          onFocus={handleMinutesSelect}
          onSelect={handleMinutesSelect}
          data-testid={dataTestId && `${dataTestId}-minutes`}
          className={styles.textInput}
          ref={minutesRef}
          readOnly={readOnly}
        />
        :
        <input
          type="text"
          name="seconds"
          value={formattedSeconds}
          onChange={handleChange}
          onPaste={handlePaste}
          onMouseDown={handleSecondsSelect}
          onBlur={handleSecondsBlur}
          onFocus={handleSecondsSelect}
          onSelect={handleSecondsSelect}
          data-testid={dataTestId && `${dataTestId}-seconds`}
          className={styles.textInput}
          ref={secondsRef}
          readOnly={readOnly}
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
  readOnly: PropTypes.bool,
};
