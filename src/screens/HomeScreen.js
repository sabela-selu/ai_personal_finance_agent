import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import { Button, Card, Text, Surface, ActivityIndicator, Portal, Modal, IconButton } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { analyzeBankStatement } from '../services/geminiService';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, styles as themeStyles } from '../theme';

const { width } = Dimensions.get('window');

const FeatureCard = ({ title, description, icon, onPress, loading, result, methods, color }) => (
  <Card style={[styles.card, themeStyles.cardShadow]} mode="elevated">
    <LinearGradient
      colors={[color, color + '99']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.cardGradient}
    >
      <IconButton icon={icon} size={32} iconColor="#fff" />
      <Text variant="titleLarge" style={styles.cardTitle}>{title}</Text>
    </LinearGradient>
    <Card.Content style={styles.cardContent}>
      <Text variant="bodyMedium">{description}</Text>
      {methods && (
        <View style={styles.methodsContainer}>
          {methods.map((method, index) => (
            <Surface key={index} style={[styles.methodChip, { backgroundColor: color + '15' }]}>
              <Text variant="bodySmall" style={{ color: color }}>{method}</Text>
            </Surface>
          ))}
        </View>
      )}
      {result && (
        <Surface style={styles.resultContainer}>
          <Text variant="bodyMedium">{result}</Text>
        </Surface>
      )}
      <Button
        mode="contained"
        onPress={onPress}
        loading={loading}
        disabled={loading}
        style={styles.analyzeButton}
        contentStyle={styles.buttonContent}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </Button>
    </Card.Content>
  </Card>
);

const HomeScreen = () => {
  const [bankStatement, setBankStatement] = useState(null);
  const [loading, setLoading] = useState({
    budgeting: false,
    savings: false,
    investing: false,
    debt: false
  });
  const [results, setResults] = useState({
    budgeting: null,
    savings: null,
    investing: null,
    debt: null
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
          budgeting: null,
          savings: null,
          investing: null,
          debt: null
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
      <LinearGradient
        colors={themeStyles.gradientBackground}
        style={styles.header}
      >
        <Text variant="headlineMedium" style={styles.headerTitle}>
          Your Financial Companion
        </Text>
        <Text variant="bodyLarge" style={styles.headerSubtitle}>
          Upload your bank statement to unlock personalized insights
        </Text>
        <Button
          mode="contained"
          onPress={pickDocument}
          icon="file-upload"
          style={styles.uploadButton}
          contentStyle={styles.buttonContent}
        >
          {bankStatement ? 'Change Statement' : 'Upload Statement'}
        </Button>
        {bankStatement && (
          <Text variant="bodyMedium" style={styles.fileName}>
            Analyzing: {bankStatement.name}
          </Text>
        )}
      </LinearGradient>

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      <View style={styles.cardsContainer}>
        <FeatureCard
          title="Smart Budgeting"
          description="Get personalized budgeting recommendations based on your spending patterns"
          icon="calculator-variant"
          methods={['50/30/20 Rule', 'Zero-Based Budget', 'Envelope System']}
          onPress={() => analyzeFeature('budgeting')}
          loading={loading.budgeting}
          result={results.budgeting}
          color={theme.colors.primary}
        />

        <FeatureCard
          title="Savings Strategy"
          description="Discover optimal saving methods and opportunities"
          icon="piggy-bank"
          methods={['Pay Yourself First', 'High-Yield Savings', 'Savings Challenges']}
          onPress={() => analyzeFeature('savings')}
          loading={loading.savings}
          result={results.savings}
          color={theme.colors.secondary}
        />

        <FeatureCard
          title="Investment Planning"
          description="Get personalized investment recommendations"
          icon="trending-up"
          methods={['Dollar-Cost Averaging', 'Robo-Advisors', 'Retirement Planning']}
          onPress={() => analyzeFeature('investing')}
          loading={loading.investing}
          result={results.investing}
          color={theme.colors.tertiary}
        />

        <FeatureCard
          title="Debt Management"
          description="Optimize your debt repayment strategy"
          icon="credit-card-check"
          methods={['Debt Snowball', 'Debt Avalanche', 'Debt Consolidation']}
          onPress={() => analyzeFeature('debt')}
          loading={loading.debt}
          result={results.debt}
          color={theme.colors.success}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 24,
    paddingTop: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 24,
  },
  uploadButton: {
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  buttonContent: {
    height: 48,
  },
  fileName: {
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  cardsContainer: {
    padding: 16,
    paddingTop: 24,
  },
  card: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    marginLeft: 12,
    fontWeight: '600',
  },
  cardContent: {
    padding: 20,
  },
  methodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    marginBottom: 16,
  },
  methodChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  resultContainer: {
    padding: 16,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 16,
    marginBottom: 16,
  },
  analyzeButton: {
    borderRadius: 12,
  },
  error: {
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 16,
  },
});

export default HomeScreen; 