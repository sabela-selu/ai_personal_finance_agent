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
      budgeting: `Analyze this bank statement and provide a comprehensive budgeting plan:
        1. Apply the 50/30/20 Rule:
           - Calculate exact amounts for needs (50%)
           - Calculate exact amounts for wants (30%)
           - Calculate exact amounts for savings/debt (20%)
        2. Create a Zero-Based Budget:
           - List all income sources
           - Categorize all expenses
           - Show how every dollar should be allocated
        3. Suggest envelope system categories based on spending patterns
        
        Format the response with clear sections and specific dollar amounts.`,
      
      savings: `Analyze this bank statement and create a detailed savings plan:
        1. Pay Yourself First Strategy:
           - Recommend optimal automatic savings amount
           - Suggest timing based on income patterns
        2. Emergency Fund Planning:
           - Calculate recommended fund size
           - Suggest monthly contribution amount
        3. Savings Challenges:
           - Customize a 52-week savings plan
           - Identify potential no-spend categories
        4. High-Yield Savings Opportunities:
           - Calculate potential interest earnings
           - Recommend allocation between accounts
        
        Provide specific numbers and actionable steps.`,
      
      investing: `Create an investment plan based on this bank statement:
        1. Dollar-Cost Averaging Strategy:
           - Calculate recommended monthly investment amount
           - Suggest optimal investment timing
        2. Investment Vehicle Recommendations:
           - Analyze retirement account potential
           - Suggest robo-advisor allocations
        3. Risk Assessment:
           - Evaluate investment capacity
           - Recommend portfolio allocation
        4. Timeline Planning:
           - Short-term investment opportunities
           - Long-term investment strategy
        
        Include specific amounts and practical implementation steps.`,
      
      debt: `Analyze this bank statement for debt management:
        1. Debt Snowball Analysis:
           - List debts from smallest to largest
           - Calculate accelerated payment plan
        2. Debt Avalanche Strategy:
           - Order debts by interest rate
           - Calculate potential interest savings
        3. Consolidation Opportunities:
           - Evaluate consolidation potential
           - Calculate monthly payment impact
        4. Debt-Free Timeline:
           - Project debt-free date
           - Suggest payment optimization
        
        Provide specific numbers and monthly action plans.`
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