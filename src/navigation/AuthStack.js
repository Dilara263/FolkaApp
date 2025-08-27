// src/navigation/AuthStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen, SignUpScreen, ForgotPasswordScreen, VerificationCodeScreen, ResetPasswordScreen } from '../screens';

const Stack = createStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen 
                name="ForgotPassword" 
                component={ForgotPasswordScreen} 
                options={{ headerShown: false }}
            />
            <Stack.Screen 
                name="VerificationCode" 
                component={VerificationCodeScreen} 
                options={{ headerShown: false }}
            />
            <Stack.Screen 
                name="ResetPassword" 
                component={ResetPasswordScreen} 
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default AuthStack;
