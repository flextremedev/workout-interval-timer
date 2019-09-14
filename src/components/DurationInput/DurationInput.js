import React from 'react';
import PropTypes from 'prop-types';
import { format, addSeconds, addMinutes } from 'date-fns';
import { formatStringAsDoubleDigit } from './formatStringAsDoubleDigit';

export function DurationInput({ dataTestId, value, onChange }) {
  const handleMinutesChange = e => {
    e.stopPropagation();
    if (e.target.value) {
      const { value } = e.target;
      if (value.match(/^[0-9]*$/)) {
        const formattedValue = formatStringAsDoubleDigit(value);
        onChange(addMinutes(new Date(0), formattedValue));
      }
    }
  };
  const handleSecondsChange = e => {
    e.stopPropagation();
    if (e.target.value) {
      const { value } = e.target;
      if (value.match(/^[0-9]*$/)) {
        const formattedValue = formatStringAsDoubleDigit(value);
        onChange(addSeconds(new Date(0), formattedValue));
      }
    }
  };
  const handlePaste = e => {
    e.preventDefault();
  };
  return (
    <div>
      <input
        type="text"
        value={format(value, 'mm')}
        onChange={handleMinutesChange}
        onPaste={handlePaste}
        data-testid={dataTestId && `${dataTestId}-minutes`}
      />
      :
      <input
        type="text"
        value={format(value, 'ss')}
        onChange={handleSecondsChange}
        onPaste={handlePaste}
        data-testid={dataTestId && `${dataTestId}-seconds`}
      />
      mm:ss
    </div>
  );
}
DurationInput.propTypes = {
  dataTestId: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.instanceOf(Date).isRequired,
};
