import React from 'react';
import PropTypes from 'prop-types';
import styles from './Counter.module.css';
import { DurationInput } from '../DurationInput/DurationInput';
import { Status } from '../../model/Status';
const evluateStatus = status => {
  if (status === Status.prework) {
    return 'PREPARE';
  }
  if (status === Status.break) {
    return 'REST';
  }
  return 'WORK';
};
export function Counter({ timeLeft, dataTestId, status, roundsLeft, rounds }) {
  return (
    <div className={styles.container}>
      <div className={styles.round}>
        <span className={styles.label}>ROUND</span>
        <span className={`${styles.text}`}>{`${rounds -
          roundsLeft}/${rounds}`}</span>
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
        <span className={`${styles.status}`}>{evluateStatus(status)}</span>
      </div>
    </div>
  );
}
Counter.propTypes = {
  timeLeft: PropTypes.instanceOf(Date),
  dataTestId: PropTypes.string,
  status: PropTypes.oneOf([Status.work, Status.prework, Status.break]),
  roundsLeft: PropTypes.number,
  rounds: PropTypes.number,
};
