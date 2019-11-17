import React from 'react';
import PropTypes from 'prop-types';
import styles from './Counter.module.css';
import { DurationInput } from '../DurationInput/DurationInput';
export function Counter({ timeLeft, dataTestId }) {
  return (
    <div className={styles.container}>
      <div className={styles.round}>
        <span className={styles.label}>ROUND</span>
        <span className={`${styles.text}`}>6/7</span>
      </div>
      <div className={styles.counter}>
        <div className={styles.progress}></div>
        <DurationInput
          value={timeLeft}
          readOnly
          dataTestId={dataTestId}
          style={{ margin: '0px' }}
        />
      </div>
      <div className={styles.statusContainer}>
        <div className={`${styles.progress} ${styles.progressBottom}`}></div>
        <span className={`${styles.status}`}>WORK</span>
      </div>
    </div>
  );
}
Counter.propTypes = {
  timeLeft: PropTypes.string,
  dataTestId: PropTypes.string,
};
