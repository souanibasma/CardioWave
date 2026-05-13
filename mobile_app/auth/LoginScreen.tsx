import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Placeholder: integrate with authService later
    if (email && password) {
      Alert.alert('Login', `Logged in as ${email}`);
      // Navigate based on role (mocked as doctor)
      navigation.navigate('Doctor' as never);
    } else {
      Alert.alert('Error', 'Please enter email and password');
    }
  };

  const goToRegister = () => {
    navigation.navigate('Register' as never);
  };

  const goToForgot = () => {
    navigation.navigate('ForgotPassword' as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <View style={styles.links}>
        <Text style={styles.link} onPress={goToForgot}>Forgot Password?</Text>
        <Text style={styles.link} onPress={goToRegister}>Register</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  links: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  link: {
    color: '#007bff',
  },
});