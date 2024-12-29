import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const generateFinancialPlan = async (goals, situation) => {
  try {
    const apiKey = await AsyncStorage.getItem('geminiApiKey');
    if (!apiKey) {
      throw new Error('API key not found');
    }

    const prompt = `As a senior financial planner, create a personalized financial plan based on the following:
    
    Financial Goals: ${goals}
    Current Situation: ${situation}
    
    Please provide a detailed plan that includes:
    1. Budget recommendations
    2. Investment strategies
    3. Savings goals
    4. Action steps
    
    Make the plan specific, actionable, and based on the provided information.`;

    const response = await fetch(
      `${GEMINI_API_ENDPOINT}?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    );

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response from Gemini API');
    }
  } catch (error) {
    console.error('Error in generateFinancialPlan:', error);
    throw error;
  }
};

export const analyzePayslipPDF = async (payslipFiles) => {
  try {
    const apiKey = await AsyncStorage.getItem('geminiApiKey');
    if (!apiKey) {
      throw new Error('API key not found');
    }

    // Extract text content from PDFs
    const payslipContents = await Promise.all(
      payslipFiles.map(async (file) => {
        // Here you would typically use a PDF parsing service or API
        // For this example, we'll send the raw PDF data
        const base64 = await FileSystem.readAsStringAsync(file.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        return {
          name: file.name,
          content: base64,
        };
      })
    );

    const prompt = `As a financial analyst, analyze these payslip PDFs:
    ${payslipContents.map(slip => `Payslip: ${slip.name}`).join('\n')}
    
    Please extract and analyze the following information:
    1. Gross Income
    2. Net Income
    3. Tax Deductions
    4. Other Deductions
    5. Allowances and Benefits
    
    Then provide:
    1. Income Pattern Analysis
    2. Tax Optimization Opportunities
    3. Potential Deduction Insights
    4. Retirement Contribution Recommendations
    5. Custom Budget Categories based on income structure
    
    Format the response as structured recommendations.`;

    const response = await fetch(
      `${GEMINI_API_ENDPOINT}?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: prompt
              },
              ...payslipContents.map(slip => ({
                inlineData: {
                  mimeType: 'application/pdf',
                  data: slip.content
                }
              }))
            ]
          }]
        })
      }
    );

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response from Gemini API');
    }
  } catch (error) {
    console.error('Error in analyzePayslipPDF:', error);
    throw error;
  }
}; 