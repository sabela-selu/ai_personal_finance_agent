import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, Surface, ActivityIndicator, Portal, Modal } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { analyzePayslipPDF } from '../services/geminiService';

const PayslipAnalysisScreen = () => {
  const [payslips, setPayslips] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        multiple: true,
        copyToCacheDirectory: true
      });

      if (!result.canceled) {
        // Limit to 3 payslips
        const selectedPayslips = result.assets.slice(0, 3);
        setPayslips(selectedPayslips);
      }
    } catch (err) {
      setError('Error picking documents');
      console.error('DocumentPicker Error:', err);
    }
  };

  const handleAnalysis = async () => {
    if (payslips.length === 0) {
      setError('Please upload at least one payslip');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await analyzePayslipPDF(payslips);
      setAnalysis(result);
    } catch (err) {
      setError('Error analyzing payslips');
      console.error('Analysis Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <Text variant="titleLarge" style={styles.title}>
          Payslip Analysis 📊
        </Text>

        <Text variant="bodyMedium" style={styles.instructions}>
          Upload up to 3 months of payslip PDFs for analysis. We'll extract the relevant information
          and provide personalized financial insights.
        </Text>

        <Button
          mode="contained"
          onPress={pickDocument}
          style={styles.uploadButton}
          icon="file-upload"
        >
          Upload Payslips
        </Button>

        {payslips.length > 0 && (
          <Surface style={styles.filesSurface}>
            <Text variant="titleMedium" style={styles.filesTitle}>
              Uploaded Payslips:
            </Text>
            {payslips.map((doc, index) => (
              <Text key={index} variant="bodyMedium" style={styles.fileName}>
                {doc.name}
              </Text>
            ))}
          </Surface>
        )}

        <Button
          mode="contained"
          onPress={handleAnalysis}
          disabled={loading || payslips.length === 0}
          style={styles.analyzeButton}
        >
          Analyze Payslips
        </Button>

        {loading && <ActivityIndicator style={styles.loader} />}

        {error && (
          <Text variant="bodyMedium" style={styles.error}>
            {error}
          </Text>
        )}

        {analysis && (
          <Surface style={styles.analysisSurface}>
            <Text variant="titleMedium" style={styles.analysisTitle}>
              Analysis Results
            </Text>
            <Text variant="bodyMedium">{analysis}</Text>
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
    marginBottom: 16,
  },
  instructions: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#666',
  },
  uploadButton: {
    marginBottom: 16,
  },
  analyzeButton: {
    marginTop: 16,
  },
  filesSurface: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    marginTop: 16,
  },
  filesTitle: {
    marginBottom: 8,
  },
  fileName: {
    color: '#666',
    marginBottom: 4,
  },
  loader: {
    marginTop: 20,
  },
  error: {
    color: '#B00020',
    marginTop: 16,
    textAlign: 'center',
  },
  analysisSurface: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  analysisTitle: {
    marginBottom: 12,
  },
});

export default PayslipAnalysisScreen; 