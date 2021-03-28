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
  style,
}) {
  const formattedMinutes = format(value, 'mm');
  const formattedSeconds = format(value, 'ss');
  const minutesRef = React.useRef(null);
  const secondsRef = React.useRef(null);

  React.useEffect(() => {
    /* istanbul ignore else */
    if (secondsRef.current) {
      secondsRef.current.setSelectionRange(0, 0);
    }
    /* istanbul ignore else */
    if (minutesRef.current) {
      minutesRef.current.setSelectionRange(0, 0);
    }
  }, []);

  const handleChange = e => {
    e.stopPropagation();
    const { value: targetValue, name } = e.target;
    if (targetValue.match(/^[0-9]*$/)) {
      if (name === 'minutes') {
        const formattedTargetValue = addNumberAtEndShifting(
          formattedMinutes,
          targetValue
        );
        onChange(setMinutes(new Date(value.valueOf()), formattedTargetValue));
      } else {
        const formattedTargetValue = addNumberAtEndShifting(
          formattedSeconds,
          targetValue
        );
        onChange(setSeconds(new Date(value.valueOf()), formattedTargetValue));
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
  /* istanbul ignore next */
  const handlePaste = e => {
    e.preventDefault();
  };
  return (
    <div className={styles.container} style={style}>
      {label ? <label className={`${styles.label}`}>{label}</label> : null}
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
          inputMode="numeric"
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
          inputMode="numeric"
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
  style: PropTypes.shape(),
};
