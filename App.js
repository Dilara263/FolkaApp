import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigation } from './src/navigation';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';

const App = () => {
    return (
        <AuthProvider>
            <FavoritesProvider>
                <CartProvider>
                    <NavigationContainer>
                        <RootNavigation />
                    </NavigationContainer>
                </CartProvider>
            </FavoritesProvider>
        </AuthProvider>
    );
};

export default App;