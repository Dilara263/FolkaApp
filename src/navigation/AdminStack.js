    import React from 'react';
    import { createStackNavigator } from '@react-navigation/stack';
    import { AdminDashboardScreen, ProductManagementScreen } from '../screens';
    import { ProductProvider } from '../context/ProductContext'; // ProductProvider import edildi

    const Stack = createStackNavigator();

    const AdminStack = () => {
        return (
            <ProductProvider>
                <Stack.Navigator>
                    <Stack.Screen 
                        name="AdminDashboard" 
                        component={AdminDashboardScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ProductManagement" 
                        component={ProductManagementScreen}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </ProductProvider>
        );
    };

    export default AdminStack;
    