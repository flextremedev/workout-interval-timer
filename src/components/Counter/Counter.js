import React from 'react';
import PropTypes from 'prop-types';
import styles from './Counter.module.css';
export function Counter({ timeLeft, dataTestId }) {
  return (
    <div className={styles.container}>
      <span className={styles.time} data-testid={dataTestId}>
        {timeLeft}
      </span>
    </div>
  );
}
Counter.propTypes = {
  timeLeft: PropTypes.string,
  dataTestId: PropTypes.string,
};
