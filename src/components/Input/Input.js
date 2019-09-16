import React from 'react';
import PropTypes from 'prop-types';
import styles from './Input.module.css';
export function Input({ label, type, value, onChange, min, max, dataTestId }) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <input
        className={styles.input}
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        data-testid={dataTestId}
      ></input>
    </div>
  );
}
Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  min: PropTypes.string,
  max: PropTypes.string,
  dataTestId: PropTypes.string,
};
