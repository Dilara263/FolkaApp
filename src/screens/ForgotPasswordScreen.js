//DÜZELTT:  onPress: () => navigation.navigate('VerificationCode', { email: email }) çalışmıyor.

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native'; // ✨ Alert buraya eklendi
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from '../components';
import { useAuth } from '../context/AuthContext';

const ForgotPasswordScreen = ({ navigation }) => {
    const { sendPasswordResetCode, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [isSendingCode, setIsSendingCode] = useState(false);

    const handleSendCode = async () => {
        if (!email) {
            Alert.alert("Hata", "Lütfen e-posta adresinizi girin.");
            return;
        }

        setIsSendingCode(true);
        const result = await sendPasswordResetCode(email);
        console.log("ForgotPassword result:", result);

        if (result.success) {
            // Başarılı durumda Alert'i göster ve ardından navigasyon yap
            Alert.alert("Başarılı", result.message || "Şifre sıfırlama kodu e-posta adresinize gönderildi.", [
                {
                    text: "Tamam",
                    onPress: () => navigation.navigate('VerificationCode', { email: email })
                }
            ]);
        } else {
            // Hata durumunda da Alert göster (eğer context'ten gelmiyorsa)
            // Bizim context'imiz Alert'i zaten gösterdiği için burada ek Alert'e gerek yok.
        }
        setIsSendingCode(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Şifremi Unuttum</Text>
                <View style={{width: 24}} />
            </View>

            <View style={styles.container}>
                <Ionicons name="mail-open-outline" size={80} color="#8B4513" style={styles.icon} />
                <Text style={styles.title}>Şifreni Kurtar</Text>
                <Text style={styles.subtitle}>Şifrenizi sıfırlamak için e-posta adresinizi girin.</Text>

                <TextInput
                    style={styles.textInput}
                    placeholder="E-posta adresinizi girin"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <CustomButton
                    title={isSendingCode ? "" : "Kod Gönder"}
                    onPress={handleSendCode}
                    style={styles.sendButton}
                    disabled={isSendingCode}
                >
                    {isSendingCode && <ActivityIndicator color="#fff" />}
                </CustomButton>

                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backToLoginButton}>
                    <Text style={styles.backToLoginText}>Giriş ekranına geri dön</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },
    backButton: { 
        padding: 5,
        marginRight: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    icon: {
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    textInput: {
        width: '100%',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        fontSize: 16,
        color: '#333',
    },
    sendButton: {
        backgroundColor: '#8B4513',
        width: '100%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backToLoginButton: {
        marginTop: 20,
    },
    backToLoginText: {
        fontSize: 16,
        color: '#8B4513',
    },
});

export default ForgotPasswordScreen;
