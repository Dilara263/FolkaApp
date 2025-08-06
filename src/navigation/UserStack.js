import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { CartScreen, FavoritesScreen } from '../screens';
import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

const UserStack = ({ route }) => {
    const isGuest = route.params?.isGuest ?? false;

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Favorilerim') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === 'Sepetim') {
                        iconName = focused ? 'cart' : 'cart-outline';
                    } else if (route.name === 'Profil') {
                        iconName = focused ? 'person-circle' : 'person-circle-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#8B4513',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeStack} options={{ title: "Anasayfa" }} />
            <Tab.Screen name="Favorilerim" component={FavoritesScreen} />
            <Tab.Screen name="Sepetim" component={CartScreen} />
            <Tab.Screen 
                name="Profil" 
                component={ProfileStack} 
                initialParams={{ isGuest: isGuest }} 
            />
        </Tab.Navigator>
    );
};

export default UserStack;
