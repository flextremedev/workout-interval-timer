import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';
export const Button = function({ children, className, ...props }) {
  return (
    <button className={`${styles.btn} ${className}`} {...props}>
      {children}
    </button>
  );
};
Button.displayName = 'Button';
Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
