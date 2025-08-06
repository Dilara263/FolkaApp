import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen, ProductDetailScreen } from '../screens';

const Stack = createStackNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="HomeMain" 
                component={HomeScreen} 
            />
            <Stack.Screen 
                name="ProductDetail" 
                component={ProductDetailScreen} 
                options={{ title: 'Ürün Detayı' }}
            />
        </Stack.Navigator>
    );
};

export default HomeStack;
