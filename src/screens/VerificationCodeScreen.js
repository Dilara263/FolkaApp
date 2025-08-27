import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from '../components';
import { useAuth } from '../context/AuthContext';

const VerificationCodeScreen = ({ navigation, route }) => {
    const { email } = route.params; // ForgotPasswordScreen'den gelen e-posta
    const { verifyPasswordResetCode, sendPasswordResetCode, isLoading } = useAuth();

    const [code, setCode] = useState(['', '', '', '', '', '']); // 6 haneli kod için dizi
    const [timer, setTimer] = useState(60); // Geri sayım sayacı (saniye)
    const [canResend, setCanResend] = useState(false); // Kodu yeniden gönderme durumu
    const [isVerifyingCode, setIsVerifyingCode] = useState(false); // Kod doğrulama loading state'i

    const inputRefs = useRef([]); // TextInput'lara referanslar

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else {
            setCanResend(true); // Süre bitince yeniden gönderebilir
        }
        return () => clearInterval(interval);
    }, [timer]);

    // Kod input'ları arasında geçiş
    const handleCodeChange = (text, index) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        // Bir sonraki input'a odaklan
        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleVerifyCode = async () => {
        const fullCode = code.join(''); // Diziyi string'e dönüştür
        if (fullCode.length !== 6) {
            Alert.alert("Hata", "Lütfen 6 haneli kodu eksiksiz girin.");
            return;
        }

        setIsVerifyingCode(true); // Doğrulama işlemi başladı
        const result = await verifyPasswordResetCode(email, fullCode);

        if (result.success) {
            // Kod doğru, şifre sıfırlama ekranına yönlendir
            navigation.navigate('ResetPassword', { email: email, code: fullCode });
        }
        // Hata durumunda Alert zaten AuthContext içinde gösteriliyor
        setIsVerifyingCode(false); // Doğrulama işlemi bitti
    };

    const handleResendCode = async () => {
        if (!canResend) return;

        // Kodu yeniden gönderme API çağrısı
        // sendPasswordResetCode fonksiyonu AuthContext'te zaten var
        // Ancak bu fonksiyon Alert gösterdiği için burada Alert'i kapatıp sonra tekrar açabiliriz
        // veya AuthContext'teki Alert'i kaldırıp burada yönetebiliriz.
        // Şimdilik Alert'i kapatıp tekrar açalım.
        Alert.alert("Bilgi", "Yeni bir kod e-posta adresinize gönderiliyor...");
        setTimer(60); // Sayacı sıfırla
        setCanResend(false); // Yeniden göndermeyi devre dışı bırak
        const result = await sendPasswordResetCode(email);
        if (result.success) {
            Alert.alert("Başarılı", "Yeni kod gönderildi.");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Doğrulama Kodu</Text>
                <View style={{width: 24}} /> {/* Başlığı ortalamak için boşluk */}
            </View>

            <View style={styles.container}>
                <Ionicons name="shield-checkmark-outline" size={80} color="#8B4513" style={styles.icon} />
                <Text style={styles.title}>Doğrulama Kodu</Text>
                <Text style={styles.subtitle}>E-posta adresinize ({email}) bir kod gönderdik.</Text>

                <View style={styles.codeInputContainer}>
                    {code.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={el => inputRefs.current[index] = el}
                            style={styles.codeInput}
                            value={digit}
                            onChangeText={(text) => handleCodeChange(text, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            caretHidden={true} // İmleci gizle
                        />
                    ))}
                </View>

                {timer > 0 ? (
                    <Text style={styles.resendText}>Kodu yeniden gönder: 00.{timer < 10 ? `0${timer}` : timer}</Text>
                ) : (
                    <TouchableOpacity onPress={handleResendCode} disabled={!canResend}>
                        <Text style={[styles.resendLink, !canResend && styles.disabledResendLink]}>Kodu Yeniden Gönder</Text>
                    </TouchableOpacity>
                )}

                <CustomButton
                    title={isVerifyingCode ? "" : "Doğrula"}
                    onPress={handleVerifyCode}
                    style={styles.verifyButton}
                    disabled={isVerifyingCode}
                >
                    {isVerifyingCode && <ActivityIndicator color="#fff" />}
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
    codeInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 30,
    },
    codeInput: {
        width: 45,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        backgroundColor: '#f0f0f0',
    },
    resendText: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 20,
    },
    resendLink: {
        fontSize: 16,
        color: '#8B4513',
        textDecorationLine: 'underline',
        marginBottom: 20,
    },
    disabledResendLink: {
        color: '#ccc',
    },
    verifyButton: {
        backgroundColor: '#8B4513',
        width: '100%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default VerificationCodeScreen;
