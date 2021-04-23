import * as React from 'react';

import { ThemeContextProvider } from './src/context/theme-context';
import { Home } from './src/pages/Home';

// eslint-disable-next-line import/no-default-export
export default function App(): JSX.Element {
  return (
    <ThemeContextProvider>
      <Home />
    </ThemeContextProvider>
  );
}
