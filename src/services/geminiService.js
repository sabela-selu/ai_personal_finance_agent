import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

export const analyzeBankStatement = async (statementFile, feature) => {
  try {
    const apiKey = await AsyncStorage.getItem('geminiApiKey');
    if (!apiKey) {
      throw new Error('API key not found');
    }

    const base64 = await FileSystem.readAsStringAsync(statementFile.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const prompts = {
      spending: `Analyze this bank statement and provide insights about spending patterns:
        1. Top spending categories
        2. Unusual expenses
        3. Recurring payments
        4. Areas for potential savings
        Format as concise bullet points.`,
      
      savings: `Based on this bank statement, provide actionable savings recommendations:
        1. Potential monthly savings amount
        2. Suggested automated saving rules
        3. Specific expenses to reduce
        4. Emergency fund recommendations
        Format as clear action items.`,
      
      investment: `Analyze this bank statement for investment opportunities:
        1. Available amount for investing
        2. Suggested investment vehicles
        3. Risk-appropriate allocations
        4. Timeline recommendations
        Provide practical, actionable advice.`,
      
      budget: `Create a smart budget based on this bank statement:
        1. Income breakdown
        2. Essential expenses
        3. Discretionary spending
        4. Recommended allocations
        Format as percentages and specific amounts.`
    };

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
                text: prompts[feature]
              },
              {
                inlineData: {
                  mimeType: 'application/pdf',
                  data: base64
                }
              }
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
    console.error('Error in analyzeBankStatement:', error);
    throw error;
  }
}; 