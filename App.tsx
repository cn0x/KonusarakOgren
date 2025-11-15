import { NavigationContainer } from '@react-navigation/native';
import MainScreen from './src/screens/Main';
import HistoryScreen from './src/screens/History';
import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Main">
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
