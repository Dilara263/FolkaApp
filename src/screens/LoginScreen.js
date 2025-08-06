import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (email && password) {
            navigation.replace('Main');
        } else {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Folka</Text>
            <TextInput
                style={styles.input}
                placeholder="E-posta Adresiniz"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Şifreniz"
                value={password}
                onChangeText={setPassword}
                secureTextEntry = {true}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Hesabın yok mu? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.signUpButtonText}>Kayıt Ol</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#333',
        fontFamily: 'serif'
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#8B4513',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signUpContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    signUpText: {
        fontSize: 16,
        color: 'gray',
    },
    signUpButtonText: {
        fontSize: 16,
        color: '#8B4513',
        fontWeight: 'bold',
    }
});

export default LoginScreen;