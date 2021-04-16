import * as React from 'react';

import { ThemeContext, TThemeContext } from '../context/theme-context';
export const useTheme = (): TThemeContext => {
  return React.useContext(ThemeContext);
};
