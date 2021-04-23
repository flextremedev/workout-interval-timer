import * as React from 'react';

import { theme, Theme } from '../theme';

export type TThemeContext = {
  toggle: () => void;
  colors: Theme['colors'];
  fontSizes: Theme['fontSizes'];
  spaces: Theme['spaces'];
  isDark: boolean;
};
export const ThemeContext = React.createContext<TThemeContext>({
  toggle: () => {
    // do nothing
  },
  colors: theme.colors,
  fontSizes: theme.fontSizes,
  spaces: theme.spaces,
  isDark: false,
});

export const ThemeContextProvider: React.FC = ({ children }) => {
  const [isDark, setIsDark] = React.useState(false);
  const toggle = (): void => {
    setIsDark((prevIsDark) => !prevIsDark);
  };

  const colors = isDark ? theme.darkMode : theme.colors;
  const fontSizes = theme.fontSizes;
  const spaces = theme.spaces;

  return (
    <ThemeContext.Provider
      value={{ colors, fontSizes, toggle, spaces, isDark }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
