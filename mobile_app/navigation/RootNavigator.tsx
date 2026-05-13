import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import screens (placeholders for now)
import SplashScreen from '../dashboard/SplashScreen';
import WelcomeScreen from '../dashboard/WelcomeScreen';
import LoginScreen from '../auth/LoginScreen';
import RegisterScreen from '../auth/RegisterScreen';
import ForgotPasswordScreen from '../auth/ForgotPasswordScreen';
import DoctorDashboard from '../dashboard/DoctorDashboard';
import PatientDashboard from '../dashboard/PatientDashboard';
import ECGScreen from '../ecg/ECGScreen';
import ChatbotScreen from '../chatbot/ChatbotScreen';
import ArticlesScreen from '../articles/ArticlesScreen';
import NotificationsScreen from '../notifications/NotificationsScreen';

// Stack types
type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Auth: undefined;
  Doctor: undefined;
  Patient: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator();
const DoctorStack = createNativeStackNavigator();
const PatientStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

function DoctorStackScreen() {
  return (
    <DoctorStack.Navigator>
      <DoctorStack.Screen name="DoctorDashboard" component={DoctorDashboard} />
      <DoctorStack.Screen name="ECG" component={ECGScreen} />
      <DoctorStack.Screen name="Chatbot" component={ChatbotScreen} />
      <DoctorStack.Screen name="Articles" component={ArticlesScreen} />
      <DoctorStack.Screen name="Notifications" component={NotificationsScreen} />
    </DoctorStack.Navigator>
  );
}

function PatientStackScreen() {
  return (
    <PatientStack.Navigator>
      <PatientStack.Screen name="PatientDashboard" component={PatientDashboard} />
      <PatientStack.Screen name="ECG" component={ECGScreen} />
      <PatientStack.Screen name="Chatbot" component={ChatbotScreen} />
      <PatientStack.Screen name="Articles" component={ArticlesScreen} />
      <PatientStack.Screen name="Notifications" component={NotificationsScreen} />
    </PatientStack.Navigator>
  );
}

function BottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DoctorStackScreen} />
      <Tab.Screen name="ECG" component={ECGScreen} />
      <Tab.Screen name="Chatbot" component={ChatbotScreen} />
      <Tab.Screen name="Articles" component={ArticlesScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen name="Welcome" component={WelcomeScreen} />
        <RootStack.Screen name="Auth" component={AuthStackScreen} />
        <RootStack.Screen name="Doctor" component={BottomTabs} />
        <RootStack.Screen name="Patient" component={BottomTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}