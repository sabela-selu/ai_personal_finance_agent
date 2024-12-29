import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './src/theme';
import HomeScreen from './src/screens/HomeScreen';
import ApiKeysScreen from './src/screens/ApiKeysScreen';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '700',
            },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen 
            name="ApiKeys" 
            component={ApiKeysScreen}
            options={{ 
              title: 'Welcome to Finneas',
              headerLargeTitle: true,
            }}
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ 
              title: 'Finneas',
              headerLargeTitle: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
} 