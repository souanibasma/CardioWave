import React from 'react';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import QueryProvider from './providers/QueryProvider';
import { ThemeProvider } from './shared_components/theme';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
      <StatusBar style="auto" />
    </QueryProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
