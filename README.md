# Finneas - AI-Powered Financial Analysis Mobile App

Finneas is a modern, intelligent financial analysis application that helps users understand and optimize their financial health using bank statement data and AI-powered insights.

## Features

### 1. Smart Budgeting
- Implements the 50/30/20 Rule
- Zero-Based Budgeting analysis
- Envelope System recommendations
- Personalized spending categorization

### 2. Savings Strategy
- Pay Yourself First optimization
- High-Yield Savings recommendations
- Custom savings challenges
- Emergency fund planning

### 3. Investment Planning
- Dollar-Cost Averaging strategies
- Robo-advisor recommendations
- Risk assessment
- Retirement planning insights

### 4. Debt Management
- Debt Snowball analysis
- Debt Avalanche optimization
- Consolidation opportunities
- Debt-free timeline projections

## Technology Stack

- React Native with Expo
- Google Gemini 1.5 Pro API
- React Native Paper (UI Components)
- Expo Linear Gradient
- AsyncStorage for data persistence

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/sabela-selu/ai_personal_finance.git
```

2. Install dependencies:

```bash
cd ai_personal_finance
npm install
# or
yarn install
```

3. Get your Google Gemini API Key:
- Visit the [Google AI Studio](https://makersuite.google.com/app/apikey) to get your API key
- Create a `.env` file in the project root and add your API key:
  ```
  GOOGLE_GEMINI_API_KEY=your_api_key_here
  ```

4. Start the development server:

```bash
npx expo start
```

5. Run on your device:
- Install the Expo Go app on your iOS or Android device
- Scan the QR code shown in the terminal with your device's camera
- The app will open in Expo Go

## Development

- To run on iOS simulator: Press `i` in the terminal
- To run on Android emulator: Press `a` in the terminal
- To reload the app: Press `r` in the terminal
- To open developer menu: Press `m` in the terminal
