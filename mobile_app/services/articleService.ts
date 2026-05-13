import apiClient from './apiClient';

type Article = {
  id: string;
  title: string;
  summary: string;
  content?: string;
};

export const articleService = {
  getAll: async (): Promise<Article[]> => {
    const response = await apiClient.get('/articles');
    return response.data;
  },
  // Additional methods (get by id, create, update) can be added as needed
};