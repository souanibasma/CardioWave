import axios from 'axios';
import Constants from 'expo-constants';

// Use the environment variable defined in .env (Expo automatically prefixes with EXPO_PUBLIC_)
const API_BASE_URL = Constants.manifest?.extra?.API_BASE_URL || process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;