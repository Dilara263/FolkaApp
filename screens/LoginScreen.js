import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';

// LoginScreen adında bir component (bileşen) oluşturuyoruz.
// { navigation } parametresi, ekranlar arası geçiş yapmamızı sağlayacak özel bir proptur.
const LoginScreen = ({ navigation }) => {
    // Input alanlarındaki yazıları hafızada tutmak için "state" kullanıyoruz.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // "Login" butonuna basıldığında çalışacak olan fonksiyon.
    const handleLogin = () => {
        // Şimdilik sadece inputların dolu olup olmadığını kontrol ediyoruz.
        // İleride burada gerçek kullanıcı adı/şifre kontrolü yapılacak.
        if (email && password) {
            // Eğer alanlar doluysa, kullanıcıyı 'Home' adlı ekrana yönlendir.
            // 'replace' kullanıyoruz çünkü giriş yaptıktan sonra kullanıcı geri tuşuyla bu ekrana dönmemeli.
            navigation.replace('Home');
        } else {
            // Alanlar boşsa bir uyarı göster.
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
        }
    };

    // Bu kısım, ekranın nasıl görüneceğini belirleyen JSX kodudur.
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
                secureTextEntry // Şifrenin "..." şeklinde görünmesini sağlar.
            />
            {/* Standart Button yerine TouchableOpacity kullanarak daha esnek butonlar yapabiliriz. */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>
        </View>
    );
};

// Ekranın stil (görünüm) ayarlarını burada yapıyoruz.
// StyleSheet.create kullanmak, performansı artırır ve kodu düzenli tutar.
const styles = StyleSheet.create({
    container: {
        flex: 1, // Ekranı tamamen kapla
        justifyContent: 'center', // İçerikleri dikeyde ortala
        alignItems: 'center', // İçerikleri yatayda ortala
        padding: 20,
        backgroundColor: '#f5f5f5' // Arka plan rengi
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#333',
        fontFamily: 'serif' // 'Folka' ismi için daha sanatsal bir font
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
        backgroundColor: '#8B4513', // Marka kimliğine uygun bir kahverengi tonu
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

// Bu component'i projenin başka yerlerinde kullanabilmek için dışarıya açıyoruz.
export default LoginScreen;