import React from 'react';
import PropTypes from 'prop-types';
import styles from './Counter.module.css';
import { DurationInput } from '../DurationInput/DurationInput';
import { StatusDisplay } from '../../model/StatusDisplay';

export function Counter({ text, timeLeft, roundsLeft, rounds }) {
  return (
    <div className={styles.container}>
      <div className={styles.round}>
        <span className={styles.label}>ROUND</span>
        <span className={`${styles.text}`} data-testid={'round'}>{`${rounds -
          roundsLeft}/${rounds}`}</span>
      </div>
      <div className={styles.counter}>
        <div className={styles.progress}></div>
        <DurationInput
          value={timeLeft}
          readOnly
          dataTestId={'time-left'}
          style={{ margin: '0px' }}
        />
      </div>
      <div className={styles.statusContainer}>
        <div className={`${styles.progress} ${styles.progressBottom}`}></div>
        <span className={`${styles.status}`} data-testid={'status'}>
          {text}
        </span>
      </div>
    </div>
  );
}
Counter.propTypes = {
  text: PropTypes.oneOf([
    StatusDisplay.BREAK,
    StatusDisplay.PREWORK,
    StatusDisplay.WORK,
  ]),
  timeLeft: PropTypes.instanceOf(Date),
  dataTestId: PropTypes.string,
  roundsLeft: PropTypes.number,
  rounds: PropTypes.number,
};
