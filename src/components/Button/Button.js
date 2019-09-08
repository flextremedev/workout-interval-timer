import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';
export const Button = React.memo(function({ children, ...props }) {
  return (
    <button className={styles.btn} {...props}>
      {children}
    </button>
  );
});
Button.displayName = 'Button';
Button.propTypes = {
  children: PropTypes.node,
};
