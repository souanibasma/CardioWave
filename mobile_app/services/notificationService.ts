import apiClient from './apiClient';

type Notification = {
  id: string;
  title: string;
  body: string;
  receivedAt: string;
};

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const response = await apiClient.get('/notifications');
    return response.data;
  },
  // Additional methods (mark as read, delete) can be added as needed
};