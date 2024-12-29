import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Surface, ActivityIndicator } from 'react-native-paper';
import { generateFinancialPlan } from '../services/geminiService';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [financialGoals, setFinancialGoals] = useState('');
  const [currentSituation, setCurrentSituation] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const plan = await generateFinancialPlan(financialGoals, currentSituation);
      setResponse(plan);
    } catch (error) {
      console.error('Error generating plan:', error);
      setResponse('Error generating financial plan. Please try again.');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <Text variant="titleLarge" style={styles.title}>
          AI Personal Finance Planner 💰
        </Text>
        
        <Button 
          mode="outlined"
          onPress={() => navigation.navigate('PayslipAnalysis')}
          style={styles.analysisButton}
        >
          Analyze Payslips
        </Button>

        <TextInput
          label="What are your financial goals?"
          value={financialGoals}
          onChangeText={setFinancialGoals}
          mode="outlined"
          multiline
          style={styles.input}
        />

        <TextInput
          label="Describe your current financial situation"
          value={currentSituation}
          onChangeText={setCurrentSituation}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleGeneratePlan}
          disabled={loading || !financialGoals || !currentSituation}
          style={styles.button}
        >
          Generate Financial Plan
        </Button>

        {loading && (
          <ActivityIndicator style={styles.loader} />
        )}

        {response && (
          <Surface style={styles.responseSurface}>
            <Text variant="bodyLarge">{response}</Text>
          </Surface>
        )}
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  surface: {
    margin: 16,
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
  loader: {
    marginTop: 20,
  },
  responseSurface: {
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    elevation: 2,
  },
  analysisButton: {
    marginBottom: 16,
  },
});

export default HomeScreen; 