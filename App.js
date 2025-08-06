import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigation } from './src/navigation';

const App = () => {
    return (
        <NavigationContainer>
            <RootNavigation />
        </NavigationContainer>
    );
};

export default App;