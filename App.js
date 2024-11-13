import React from 'react';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import { ServicesProvider } from './src/context/ServicesContext';

const App = () => {
  return (
    <ServicesProvider>
      <BottomTabNavigator />
    </ServicesProvider>
  
  );
};

export default App;