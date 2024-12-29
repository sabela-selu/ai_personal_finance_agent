import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6366F1',
    secondary: '#EC4899',
    tertiary: '#8B5CF6',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceVariant: '#F1F5F9',
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#FFFFFF',
      level3: '#FFFFFF',
      level4: '#FFFFFF',
      level5: '#FFFFFF',
    },
  },
  roundness: 16,
};

export const styles = {
  gradientBackground: ['#6366F1', '#8B5CF6'],
  cardShadow: {
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
}; 