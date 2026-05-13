import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function DoctorDashboard() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doctor Dashboard</Text>
      <Button title="View Patients" onPress={() => navigation.navigate('Patients' as never)} />
      <Button title="ECG Analysis" onPress={() => navigation.navigate('ECG' as never)} />
      <Button title="Chatbot" onPress={() => navigation.navigate('Chatbot' as never)} />
      <Button title="Articles" onPress={() => navigation.navigate('Articles' as never)} />
      <Button title="Notifications" onPress={() => navigation.navigate('Notifications' as never)} />
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
    fontSize: 26,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 24,
    textAlign: 'center',
  },
});