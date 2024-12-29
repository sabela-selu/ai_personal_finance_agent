import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import { Button, Card, Text, Surface, ActivityIndicator, Portal, Modal, IconButton } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { analyzeBankStatement } from '../services/geminiService';

const { width } = Dimensions.get('window');

const FeatureCard = ({ title, description, icon, onPress, loading, result }) => (
  <Card style={styles.card} mode="elevated">
    <Card.Title
      title={title}
      left={(props) => <IconButton {...props} icon={icon} />}
    />
    <Card.Content>
      <Text variant="bodyMedium">{description}</Text>
      {result && (
        <Surface style={styles.resultContainer}>
          <Text variant="bodyMedium">{result}</Text>
        </Surface>
      )}
    </Card.Content>
    <Card.Actions>
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Button onPress={onPress}>Analyze</Button>
      )}
    </Card.Actions>
  </Card>
);

const HomeScreen = () => {
  const [bankStatement, setBankStatement] = useState(null);
  const [loading, setLoading] = useState({
    spending: false,
    savings: false,
    investment: false,
    budget: false
  });
  const [results, setResults] = useState({
    spending: null,
    savings: null,
    investment: null,
    budget: null
  });
  const [error, setError] = useState(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true
      });

      if (!result.canceled) {
        setBankStatement(result.assets[0]);
        setResults({
          spending: null,
          savings: null,
          investment: null,
          budget: null
        });
      }
    } catch (err) {
      setError('Error picking document');
      console.error('DocumentPicker Error:', err);
    }
  };

  const analyzeFeature = async (feature) => {
    if (!bankStatement) {
      setError('Please upload a bank statement first');
      return;
    }

    setLoading(prev => ({ ...prev, [feature]: true }));
    try {
      const result = await analyzeBankStatement(bankStatement, feature);
      setResults(prev => ({ ...prev, [feature]: result }));
    } catch (err) {
      setError(`Error analyzing ${feature}`);
      console.error('Analysis Error:', err);
    }
    setLoading(prev => ({ ...prev, [feature]: false }));
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          AI-Powered Financial Analysis
        </Text>
        <Text variant="bodyMedium" style={styles.headerSubtitle}>
          Upload your bank statement to get personalized financial insights
        </Text>
        <Button
          mode="contained"
          onPress={pickDocument}
          icon="file-upload"
          style={styles.uploadButton}
        >
          {bankStatement ? 'Change Statement' : 'Upload Statement'}
        </Button>
        {bankStatement && (
          <Text variant="bodySmall" style={styles.fileName}>
            Analyzing: {bankStatement.name}
          </Text>
        )}
      </Surface>

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      <View style={styles.cardsContainer}>
        <FeatureCard
          title="Spending Patterns"
          description="Analyze your spending habits and identify areas for optimization"
          icon="chart-line"
          onPress={() => analyzeFeature('spending')}
          loading={loading.spending}
          result={results.spending}
        />

        <FeatureCard
          title="Savings Opportunities"
          description="Discover potential savings and automated saving strategies"
          icon="piggy-bank"
          onPress={() => analyzeFeature('savings')}
          loading={loading.savings}
          result={results.savings}
        />

        <FeatureCard
          title="Investment Insights"
          description="Get personalized investment recommendations based on your cash flow"
          icon="trending-up"
          onPress={() => analyzeFeature('investment')}
          loading={loading.investment}
          result={results.investment}
        />

        <FeatureCard
          title="Smart Budget"
          description="Generate an AI-powered budget based on your spending history"
          icon="calculator"
          onPress={() => analyzeFeature('budget')}
          loading={loading.budget}
          result={results.budget}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
  },
  headerTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
  },
  uploadButton: {
    marginBottom: 8,
  },
  fileName: {
    textAlign: 'center',
    color: '#666',
  },
  cardsContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  resultContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  error: {
    color: '#B00020',
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 16,
  },
});

export default HomeScreen; 