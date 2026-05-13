import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function ECGScreen() {
  const handleUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/octet-stream',
      copyToCacheDirectory: true,
    });

    if (result.type === 'success') {
      // Placeholder: integrate with ecgService later
      Alert.alert('ECG Upload', `Selected file: ${result.name}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ECG Analysis</Text>
      <Button title="Upload .npy File" onPress={handleUpload} />
      {/* Result display would be added after integration */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 24,
    textAlign: 'center',
  },
});