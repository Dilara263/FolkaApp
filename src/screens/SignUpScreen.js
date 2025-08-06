import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';

const SignUpScreen = ({ navigation }) => {
    // State'lerimizi oluşturuyoruz
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Kayıt ol butonuna basıldığında çalışacak fonksiyon
    const handleSignUp = () => {
        // Şimdilik sadece tüm alanların dolu olup olmadığını kontrol ediyoruz
        if (name && email && password) {
            // Başarılı kayıt sonrası kullanıcıyı direkt ana ekrana yönlendiriyoruz.
            // 'replace' kullanıyoruz ki, ana ekrandan geri tuşuyla kayıt ekranına dönmesin.
            navigation.replace('Main');
        } else {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Hesap Oluştur</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Adınız Soyadınız"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
            />
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
                secureTextEntry
            />
            
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Kayıt Ol</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#333',
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
    }
});

export default SignUpScreen;
