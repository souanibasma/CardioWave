import apiClient from './apiClient';

type ChatRequest = {
  message: string;
  aiResult: any; // Replace with proper type
  doctorNotes?: string;
  patient?: any;
  history?: Array<{ role: string; content: string }>;
};

type ChatResponse = {
  reply: string;
};

export const chatbotService = {
  chat: async (payload: ChatRequest): Promise<ChatResponse> => {
    const response = await apiClient.post('/chat', payload);
    return response.data;
  },
};