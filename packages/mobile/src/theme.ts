export const theme = {
  colors: {
    text: '#14223D',
    primary: '#2C5CED',
    background: '#F7F9FD',
    surface: '#F7F9FD',
    muted: '#CDD9EE',
    button: '#F7F9FD',
  },
  darkMode: {
    text: '#F7F9FD',
    primary: '#2C5CED',
    background: '#14223D',
    surface: '#14223D',
    muted: '#203660',
    button: '#F7F9FD',
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
