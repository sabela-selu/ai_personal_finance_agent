import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
          Welcome to AI Finance Planner
        </Text>
        <TextInput
          label="Google Gemini API Key"
          value={geminiKey}
          onChangeText={setGeminiKey}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />
        <Button 
          mode="contained" 
          onPress={saveApiKey}
          disabled={!geminiKey}
          style={styles.button}
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
    backgroundColor: '#F5F5F5',
  },
  surface: {
    padding: 16,
    borderRadius: 10,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

export default ApiKeysScreen; 