import apiClient from './apiClient';
import * as DocumentPicker from 'expo-document-picker';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

type ECGResult = any; // Replace with proper type based on backend response

export const ecgService = {
  uploadNpy: async (fileUri: string): Promise<ECGResult> => {
    const formData = new FormData();
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    const fileName = fileUri.split('/').pop() || 'ecg.npy';
    const fileType = 'application/octet-stream';

    // @ts-ignore – FormData in React Native expects a specific shape
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: fileType,
    });

    const response = await apiClient.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Optional: fetch previous ECG results for a patient
  getResults: async (patientId: string) => {
    const response = await apiClient.get(`/patients/${patientId}/ecg`);
    return response.data;
  },
};