import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileScreen, EditProfileScreen } from '../screens';

const Stack = createStackNavigator();

const ProfileStack = ({route}) => {

    const isGuest = route.params?.isGuest ?? false;

    return (
        <Stack.Navigator initialRouteName="ProfileMain">
            <Stack.Screen 
                name="ProfileMain" 
                component={ProfileScreen}
                initialParams={{ isGuest: isGuest }} 
                options={{ headerShown: false }}
            />
            <Stack.Screen 
                name="EditProfile" 
                component={EditProfileScreen} 
                options={{ title: 'Profili Düzenle' }}
            />
        </Stack.Navigator>
    );
};

export default ProfileStack;
