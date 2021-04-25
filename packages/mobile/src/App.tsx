import * as React from 'react';

import { ThemeContextProvider } from './context/theme-context';
import { Home } from './pages/Home';

// eslint-disable-next-line import/no-default-export
export function App(): JSX.Element {
  return (
    <ThemeContextProvider>
      <Home />
    </ThemeContextProvider>
  );
}
