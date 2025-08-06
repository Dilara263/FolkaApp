import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const CustomTextInput = ({ icon, iconPosition = 'left', ...props }) => {
    return (
        <View style={styles.container}>
            {icon && iconPosition === 'left' && icon}
            <TextInput
                style={styles.input}
                placeholderTextColor="#aaa"
                {...props}
            />
            {icon && iconPosition === 'right' && icon}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 50,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#333',
    },
});

export default CustomTextInput;
