import React from 'react';
import PropTypes from 'prop-types';
import styles from './Input.module.css';
export function Input({
  label,
  type,
  value: valueFromProps,
  onChange,
  onBlur,
  min,
  max,
  dataTestId,
  readOnly,
}) {
  const [value, setValue] = React.useState(valueFromProps);
  const [inputDone, setInputDone] = React.useState(true);
  const inputRef = React.useRef(null);
  if (valueFromProps !== value && inputDone) {
    setValue(valueFromProps);
  }
  const handleChange = e => {
    setInputDone(false);
    setValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };
  const handleFocus = () => {
    if (inputRef) {
      inputRef.current.select();
    }
  };
  const handleBlur = () => {
    setInputDone(true);
    onBlur(value);
  };

  const evaluateValue = () => {
    return inputDone && type === 'number' ? Number(value) : value;
  };
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <input
        className={styles.input}
        type={type}
        style={{ width: `${(String(value).length || 1) * 0.625}em` }}
        value={evaluateValue()}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        min={min}
        max={max}
        data-testid={dataTestId}
        readOnly={readOnly}
        ref={inputRef}
      ></input>
    </div>
  );
}
Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  min: PropTypes.string,
  max: PropTypes.string,
  dataTestId: PropTypes.string,
  readOnly: PropTypes.bool,
};
