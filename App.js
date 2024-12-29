import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './src/theme';
import HomeScreen from './src/screens/HomeScreen';
import ApiKeysScreen from './src/screens/ApiKeysScreen';
import PayslipAnalysisScreen from './src/screens/PayslipAnalysisScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="ApiKeys" 
            component={ApiKeysScreen}
            options={{ title: 'API Setup' }}
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'AI Finance Planner' }}
          />
          <Stack.Screen 
            name="PayslipAnalysis" 
            component={PayslipAnalysisScreen}
            options={{ title: 'Payslip Analysis' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
} 