export const theme = {
  colors: {
    text: '#14223D',
    primary: '#0066FF',
    background: '#F7F9FD',
    surface: '#F7F9FD',
    muted: '#CDD9EE',
  },
  spaces: {
    xs: 4,
    s: 8,
    m: 16,
    l: 32,
    xl: 64,
    xxl: 80,
  },
  shadows: {
    foreground: {
      shadowColor: '#CDD9EE',
      shadowRadius: 15,
      shadowOffset: { height: 15, width: 0 },
      shadowOpacity: 1,
      elevation: 15,
    },
  },
  fontSizes: {
    label: 18,
    heading: 29,
    input: 60,
  },
};

export type Theme = typeof theme;
