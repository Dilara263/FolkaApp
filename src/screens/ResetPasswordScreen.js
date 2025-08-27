import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from '../components';
import { useAuth } from '../context/AuthContext';

const ResetPasswordScreen = ({ navigation, route }) => {
    const { email, code } = route.params; // VerificationCodeScreen'den gelen e-posta ve kod
    const { resetUserPassword, isLoading } = useAuth();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false); // Şifre sıfırlama loading state'i

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert("Hata", "Lütfen yeni şifrenizi ve onayını girin.");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Hata", "Şifreler eşleşmiyor.");
            return;
        }
        if (newPassword.length < 6) {
            Alert.alert("Hata", "Şifre en az 6 karakter olmalıdır.");
            return;
        }

        setIsResettingPassword(true); // Şifre sıfırlama işlemi başladı
        const result = await resetUserPassword(email, code, newPassword); // AuthContext'teki fonksiyonu çağır

        if (result.success) {
            // Şifre başarıyla sıfırlandı, giriş ekranına yönlendir
            navigation.navigate('Login');
        }
        // Hata durumunda Alert zaten AuthContext içinde gösteriliyor
        setIsResettingPassword(false); // Şifre sıfırlama işlemi bitti
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Şifreyi Sıfırla</Text>
                <View style={{width: 24}} /> {/* Başlığı ortalamak için boşluk */}
            </View>

            <View style={styles.container}>
                <Ionicons name="lock-closed-outline" size={80} color="#8B4513" style={styles.icon} />
                <Text style={styles.title}>Yeni Şifrenizi Belirleyin</Text>
                <Text style={styles.subtitle}>Lütfen hesabınız için yeni bir şifre girin.</Text>

                <TextInput
                    style={styles.textInput}
                    placeholder="Yeni Şifre"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.passwordVisibilityToggle}>
                    <Ionicons name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={24} color="gray" />
                </TouchableOpacity>

                <TextInput
                    style={styles.textInput}
                    placeholder="Şifreyi Onayla"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!isConfirmPasswordVisible}
                />
                <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} style={styles.passwordVisibilityToggle}>
                    <Ionicons name={isConfirmPasswordVisible ? "eye-off-outline" : "eye-outline"} size={24} color="gray" />
                </TouchableOpacity>

                <CustomButton
                    title={isResettingPassword ? "" : "Şifreyi Sıfırla"}
                    onPress={handleResetPassword}
                    style={styles.resetButton}
                    disabled={isResettingPassword}
                >
                    {isResettingPassword && <ActivityIndicator color="#fff" />}
                </CustomButton>
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
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
    },
    passwordVisibilityToggle: {
        position: 'absolute',
        right: 30,
        top: '50%', // TextInput'un ortasına hizala
        marginTop: -12, // İkonun yarısı kadar yukarı kaydır
        zIndex: 1,
    },
    resetButton: {
        backgroundColor: '#8B4513',
        width: '100%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
});

export default ResetPasswordScreen;
