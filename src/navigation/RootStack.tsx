import MainScreen from '../screens/Main';
import HistoryScreen from '../screens/History';
import OnboardingScreen from '../screens/Onboarding';
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Storage } from '../utils/storage';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<
    boolean | null
  >(null);
  const [initialRoute, setInitialRoute] = useState<string>('Onboarding');

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const completed = (await Storage.get(
        'onboardingCompleted',
        false as any,
      )) as boolean;
      setIsOnboardingCompleted(completed);
      setInitialRoute(completed ? 'Main' : 'Onboarding');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setInitialRoute('Onboarding');
    }
  };

  // Don't render until we know the onboarding status
  if (isOnboardingCompleted === null) {
    return null;
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
    </Stack.Navigator>
  );
}
