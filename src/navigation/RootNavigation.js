import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthStack from './AuthStack';
import UserStack from './UserStack';

const Stack = createStackNavigator();

const RootNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AuthStack" component={AuthStack} />
            <Stack.Screen name="UserStack" component={UserStack} />
        </Stack.Navigator>
    );
};

export default RootNavigation;