import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { CustomTextInput, CustomButton } from '../components';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleLogin = () => {
        if (email && password) {
            navigation.replace('UserStack');
        } else {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
        }
    };

    const handleSkip = () => {
        navigation.replace('UserStack', { isGuest: true });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image 
                        source={require('../../assets/images/logo.jpg')} 
                        style={styles.logo} 
                    />
                    <Text style={styles.brandName}>Folka</Text>
                    {/* --- YENİ EKLENEN SLOGAN --- */}
                    <Text style={styles.tagline}>Folk Art, Halkın Sanatı</Text>
                </View>

                <CustomTextInput
                    placeholder="E-posta"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <CustomTextInput
                    placeholder="Şifre"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                    iconPosition="right"
                    icon={
                        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                            <Ionicons 
                                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                                size={24} 
                                color="gray" 
                            />
                        </TouchableOpacity>
                    }
                />
                
                <CustomButton
                    title="Giriş Yap"
                    onPress={handleLogin}
                    style={styles.mainButton}
                />

                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>veya</Text>
                    <View style={styles.divider} />
                </View>

                <View style={styles.socialLoginContainer}>
                    <TouchableOpacity style={styles.socialButton}>
                        <Ionicons name="logo-google" size={24} color="#555" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                    <Text style={styles.skipButtonText}>Giriş yapmadan devam et</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Hesabın yok mu? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.footerLink}>Kayıt Ol</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: 'white' },
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'white' },
    
    logoContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 50,
    },
    logo: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
    brandName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 5,
        fontFamily: 'serif',
    },
    // --- YENİ EKLENEN SLOGAN STİLİ ---
    tagline: {
        fontSize: 14,
        color: 'gray',
        marginTop: 2,
        fontStyle: 'italic',
    },
    mainButton: { backgroundColor: '#8B4513', marginTop: 10 },
    dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
    divider: { flex: 1, height: 1, backgroundColor: '#e0e0e0' },
    dividerText: { marginHorizontal: 15, color: 'gray', fontSize: 14 },
    socialLoginContainer: { flexDirection: 'row', justifyContent: 'center', width: '100%' },
    socialButton: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        padding: 15,
    },
    skipButton: {
        marginTop: 25,
        alignSelf: 'center',
    },
    // --- GÜNCELLENEN BUTON YAZISI STİLİ ---
    skipButtonText: {
        fontSize: 16,
        color: '#8B4513',
        fontWeight: '500',
        // textDecorationLine: 'underline', // Bu satır kaldırıldı
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: { fontSize: 16, color: 'gray' },
    footerLink: { fontSize: 16, color: '#8B4513', fontWeight: 'bold' }
});

export default LoginScreen;
