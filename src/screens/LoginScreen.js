import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, SafeAreaView, Image, ActivityIndicator, Switch } from 'react-native'; // Switch import edildi
import { CustomTextInput, CustomButton } from '../components';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
    const { login, enterGuestMode } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const loadRememberMe = async () => {
            try {
                const storedRememberMe = await AsyncStorage.getItem('rememberMe');
                if (storedRememberMe === 'true') {
                    setRememberMe(true);
                    const storedEmail = await AsyncStorage.getItem('rememberedEmail');
                    if (storedEmail) {
                        setEmail(storedEmail);
                    }
                }
            } catch (e) {
                console.error("Failed to load rememberMe state", e);
            }
        };
        loadRememberMe();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
            return;
        }
        setIsLoading(true);

        try {
            await AsyncStorage.setItem('rememberMe', rememberMe.toString());
            if (rememberMe) {
                await AsyncStorage.setItem('rememberedEmail', email);
            } else {
                await AsyncStorage.removeItem('rememberedEmail');
            }
        } catch (e) {
            console.error("Failed to save rememberMe state", e);
        }

        const result = await login(email, password);

        if (!result.success) {
            Alert.alert('Giriş Başarısız', result.message || 'E-posta veya şifreniz hatalı.');
        } 

        setIsLoading(false);
    };

    const handleSkip = () => {
        enterGuestMode();
    };

    const handleToggleRememberMe = () => {
        setRememberMe(prev => !prev);
    };

    const handleForgotPassword = () => {
        navigation.navigate('ForgotPassword'); // ✨ ForgotPasswordScreen'e yönlendir
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
                    <Text style={styles.tagline}>Folk Art, Halkın Sanatı</Text>
                </View>

                <CustomTextInput
                    //icon={<Ionicons name="mail-outline" size={24} color="gray" />}
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

                <View style={styles.optionsRow}>
                    <View style={styles.rememberMe}>
                        <Switch
                            value={rememberMe}
                            onValueChange={setRememberMe}
                            thumbColor={rememberMe ? "#8B4513" : "#ccc"}
                            trackColor={{ false: "#f0f0f0", true: "#D2B48C" }} // Track rengi eklendi
                        />
                        <Text style={styles.rememberText}>Beni Hatırla</Text>
                    </View>
                    <TouchableOpacity onPress={handleForgotPassword}>
                        <Text style={styles.forgotPassword}>Şifremi Unuttum?</Text>
                    </TouchableOpacity>
                </View>

                <CustomButton
                    title={isLoading ? "" : "Giriş Yap"}
                    onPress={handleLogin}
                    style={styles.mainButton}
                    disabled={isLoading}
                >
                    {isLoading && <ActivityIndicator color="#fff" />}
                </CustomButton>

                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>veya</Text>
                    <View style={styles.divider} />
                </View>

                <View style={styles.socialLoginContainer}>
                    <TouchableOpacity style={styles.socialButton}>
                        <Ionicons name="logo-google" size={18} color="#555" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                    <Text style={styles.skipButtonText}>Giriş yapmadan devam et</Text>
                </TouchableOpacity>

                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>Hesabın yok mu?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.signUpLink}> Kayıt Ol</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: 'white' },
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'white' },
    logoContainer: { flexDirection: 'column', alignItems: 'center', marginBottom: 50 },
    logo: { width: 60, height: 60, resizeMode: 'contain' },
    brandName: { fontSize: 32, fontWeight: 'bold', color: '#333', marginTop: 5, fontFamily: 'serif' },
    tagline: { fontSize: 14, color: 'gray', marginTop: 2, fontStyle: 'italic' },
    mainButton: { backgroundColor: '#8B4513', marginTop: 10 },
    dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
    divider: { flex: 1, height: 1, backgroundColor: '#e0e0e0' },
    dividerText: { marginHorizontal: 15, color: 'gray', fontSize: 14 },
    socialLoginContainer: { flexDirection: 'row', justifyContent: 'center', width: '100%' },
    socialButton: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, padding: 15 },
    skipButton: { marginTop: 25, alignSelf: 'center' },
    skipButtonText: { fontSize: 16, color: '#8B4513', fontWeight: '500' },
    signUpContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    signUpText: { fontSize: 14, color: 'gray' },
    signUpLink: { fontSize: 14, color: '#8B4513', fontWeight: 'bold' },
    optionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 15 },
    rememberMe: { flexDirection: 'row', alignItems: 'center' },
    rememberText: { marginLeft: 5, color: '#333', fontSize: 14 },
    forgotPassword: { color: '#8B4513', fontSize: 14, fontWeight: '500' },
});

export default LoginScreen;
