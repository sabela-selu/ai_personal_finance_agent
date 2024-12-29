import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme';

const ApiKeysScreen = ({ navigation }) => {
  const [geminiKey, setGeminiKey] = useState('');

  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    try {
      const savedKey = await AsyncStorage.getItem('geminiApiKey');
      if (savedKey) {
        setGeminiKey(savedKey);
      }
    } catch (error) {
      console.error('Error loading API key:', error);
    }
  };

  const saveApiKey = async () => {
    try {
      await AsyncStorage.setItem('geminiApiKey', geminiKey);
      navigation.replace('Home');
    } catch (error) {
      console.error('Error saving API key:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.surface}>
        <Text variant="headlineMedium" style={styles.title}>
          Welcome to Finneas
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Your AI-Powered Financial Companion
        </Text>
        <TextInput
          label="Google Gemini API Key"
          value={geminiKey}
          onChangeText={setGeminiKey}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />
        <Text variant="bodySmall" style={styles.helperText}>
          To get started, please enter your Google Gemini API key. This key is required for 
          AI-powered financial analysis and is stored securely on your device.
        </Text>
        <Button 
          mode="contained" 
          onPress={saveApiKey}
          disabled={!geminiKey}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Continue
        </Button>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
  },
  surface: {
    padding: 24,
    borderRadius: theme.roundness,
    elevation: 4,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: theme.colors.secondary,
  },
  input: {
    marginBottom: 16,
    width: '100%',
  },
  helperText: {
    textAlign: 'center',
    marginBottom: 24,
    color: theme.colors.outline,
    paddingHorizontal: 16,
  },
  button: {
    width: '100%',
  },
  buttonContent: {
    height: 48,
  },
});

export default ApiKeysScreen; 