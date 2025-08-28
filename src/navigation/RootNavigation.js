import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthStack from './AuthStack';
import UserStack from './UserStack';
import AdminStack from './AdminStack';
import { useAuth } from '../context/AuthContext';
import { CategoryProvider } from '../context/CategoryContext';

const Stack = createStackNavigator();

const RootNavigation = () => {
    const { authenticated, isLoading, isGuest, user } = useAuth(); // user ve isGuest objesi alındı
    const isAdmin = user?.role === 'Admin'; // Kullanıcının admin olup olmadığı kontrol edildi
    const isLoggedInOrGuest = authenticated || isGuest; // Yeni kontrol eklendi

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#8B4513" />
            </View>
        );
    }

    return (
        <CategoryProvider> {/* CategoryProvider buraya eklendi */}
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isLoggedInOrGuest ? (
                    isAdmin ? (
                        <Stack.Screen name="AdminStack" component={AdminStack} />
                    ) : (
                        <Stack.Screen 
                            name="UserStack" 
                            component={UserStack} 
                            initialParams={{ isGuest: isGuest }}
                        />
                    )
                ) : (
                    <Stack.Screen name="AuthStack" component={AuthStack} />
                )}
            </Stack.Navigator>
        </CategoryProvider>
    );
};

const styles = StyleSheet.create({
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default RootNavigation;
