import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthStack from './AuthStack';
import UserStack from './UserStack';
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();

const RootNavigation = () => {
    // isLoading: AuthContext'in token yükleme veya ilk durumunu belirleme aşamasında olduğunu gösterir.
    // authenticated: Kullanıcının geçerli bir token ile giriş yapmış olup olmadığını gösterir.
    // isGuest: Kullanıcının giriş yapmadan devam etme modunda olup olmadığını gösterir.
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
            {authenticated || isGuest ? (
                <Stack.Screen 
                    name="UserStack" 
                    component={UserStack} 
                    initialParams={{ isGuest: isGuest }} 
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
