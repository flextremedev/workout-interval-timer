import * as React from 'react';

import { theme, Theme } from '../theme';

export type TThemeContext = {
  toggle: () => void;
  colors: Theme['colors'];
  fontSizes: Theme['fontSizes'];
  spaces: Theme['spaces'];
  shadows: Theme['shadows'];
};
export const ThemeContext = React.createContext<TThemeContext>({
  toggle: () => {
    console.log('Toggle');
  },
  colors: theme.colors,
  fontSizes: theme.fontSizes,
  spaces: theme.spaces,
  shadows: theme.shadows,
});

export const ThemeContextProvider: React.FC = ({ children }) => {
  //   const [isDark, setIsDark] = React.useState(false);
  const toggle = (): void => {
    // setIsDark((prevSetIsDark) => !prevSetIsDark);
  };

  const colors = theme.colors;
  const fontSizes = theme.fontSizes;
  const spaces = theme.spaces;
  const shadows = theme.shadows;

  return (
    <ThemeContext.Provider
      value={{ colors, fontSizes, toggle, spaces, shadows }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
