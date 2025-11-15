import { NavigationContainer } from '@react-navigation/native';
import MainScreen from './src/screens/Main';
import HistoryScreen from './src/screens/History';
import OnboardingScreen from './src/screens/Onboarding';
import React, { useEffect, useState } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Storage } from './src/utils/storage';

const Stack = createNativeStackNavigator();

function RootStack() {
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

const App = () => {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
};

export default App;
