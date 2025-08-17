import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthStack from './AuthStack';
import UserStack from './UserStack';
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();

const RootNavigation = () => {
    const { authenticated, isLoading, isGuest } = useAuth();

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#8B4513" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {(authenticated || isGuest) ? (
                <Stack.Screen 
                    name="UserStack" 
                    component={UserStack} 
                    initialParams={{ isGuest: !authenticated }}
                />
            ) : (
                <Stack.Screen name="AuthStack" component={AuthStack} />
            )}
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default RootNavigation;
