import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigation } from './src/navigation';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { AuthProvider } from './src/context/AuthContext';

const App = () => {
    return (
        <AuthProvider>
            <FavoritesProvider>
                <NavigationContainer>
                    <RootNavigation />
                </NavigationContainer>
            </FavoritesProvider>
        </AuthProvider>
    );
};

export default App;