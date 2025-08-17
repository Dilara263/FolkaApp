import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { CustomTextInput, CustomButton } from '../components';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const SignUpScreen = ({ navigation }) => {
    const { register, login, enterGuestMode } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleSignUp = async () => {
        if (!name || !email || !password) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
            return;
        }
        setIsLoading(true);
        const response = await register(name, email, password);
        
        if (response && response.ok) {
            await login(email, password);
        } else {
            try {
                const errorData = await response.json();
                Alert.alert('Kayıt Başarısız', errorData.message || 'Bir hata oluştu.');
            } catch (e) {
                Alert.alert('Kayıt Başarısız', 'Bir hata oluştu.');
            }
        }
        setIsLoading(false);
    };

    const handleSkip = () => {
        enterGuestMode();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                    <Text style={styles.skipButtonText}>Atla</Text>
                </TouchableOpacity>

                <View style={styles.logoContainer}>
                    <Image 
                        source={require('../../assets/images/logo.jpg')} 
                        style={styles.logo} 
                    />
                    <Text style={styles.brandName}>Folka</Text>
                </View>

                <View style={styles.header}>
                    <Text style={styles.title}>Hesap Oluştur</Text>
                    <Text style={styles.subtitle}>Özgün tasarımları keşfet.</Text>
                </View>

                <CustomTextInput
                    placeholder="Ad Soyad"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                />
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
                    title={isLoading ? "Kayıt Olunuyor..." : "Kayıt Ol"}
                    onPress={handleSignUp}
                    style={styles.mainButton} 
                    disabled={isLoading}
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

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Zaten bir hesabın var mı? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.footerLink}>Giriş Yap</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: 'white' },
    container: { flex: 1, padding: 20, backgroundColor: 'white' },
    skipButton: { alignSelf: 'flex-end', padding: 10 },
    skipButtonText: { fontSize: 16, color: '#8B4513', fontWeight: '500' },
    
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    logo: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    brandName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
        fontFamily: 'serif',
    },

    header: { width: '100%', marginBottom: 30 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#333' },
    subtitle: { fontSize: 16, color: 'gray', marginTop: 8 },
    mainButton: { backgroundColor: '#8B4513', marginTop: 20 },
    dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
    divider: { flex: 1, height: 1, backgroundColor: '#e0e0e0' },
    dividerText: { marginHorizontal: 15, color: 'gray', fontSize: 14 },
    socialLoginContainer: { flexDirection: 'row', justifyContent: 'center', width: '100%' },
    socialButton: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 10,
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

export default SignUpScreen;
