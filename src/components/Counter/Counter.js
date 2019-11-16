import React from 'react';
import PropTypes from 'prop-types';
import styles from './Counter.module.css';
import { DurationInput } from '../DurationInput/DurationInput';
export function Counter({ timeLeft, dataTestId }) {
  return (
    <div className={styles.container}>
      <span className={styles.label}>Round</span>
      <span className={`${styles.text}`}>6/7</span>
      {/* <span
        className={`${styles.text} ${styles.timeLeft}`}
        data-testid={dataTestId}
      > */}
      <div className={styles.progress}></div>
      <DurationInput value={timeLeft} readOnly dataTestId={dataTestId} />
      {/* {timeLeft} */}
      {/* </span> */}
      <div className={styles.progress}></div>
      <span className={`${styles.status}`}>WORK</span>
    </div>
  );
}
Counter.propTypes = {
  timeLeft: PropTypes.string,
  dataTestId: PropTypes.string,
};
