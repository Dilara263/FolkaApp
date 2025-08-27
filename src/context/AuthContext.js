import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../config/api';
import { jwtDecode } from 'jwt-decode';
import 'core-js/stable/atob';

const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: null,
        authenticated: false,
        user: null,
        isGuest: false,
        isLoading: true,
    });

    // Yardımcı fonksiyon: API yanıtındaki hatayı ayrıştır
    const parseErrorResponse = async (response) => {
        let errorData;
        try {
            errorData = await response.json();
        } catch (jsonError) {
            const rawText = await response.text();
            errorData = { message: rawText || 'Bilinmeyen bir hata oluştu.' };
        }
        return errorData.message || 'Bilinmeyen bir hata oluştu.';
    };

    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const storedUser = await AsyncStorage.getItem('user');
                    const parsedStoredUser = storedUser ? JSON.parse(storedUser) : {};

                    setAuthState({
                        token: token,
                        authenticated: true,
                        user: {
                            id: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
                            name: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
                            email: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
                            phoneNumber: parsedStoredUser.phoneNumber, // AsyncStorage'den çek
                            address: parsedStoredUser.address // AsyncStorage'den çek
                        },
                        isGuest: false,
                        isLoading: false,
                    });
                } else {
                    setAuthState(prevState => ({ ...prevState, isLoading: false, isGuest: false })); // isGuest'i de false yap
                }
            } catch (e) {
                console.error("Failed to load token or user", e);
                setAuthState(prevState => ({ ...prevState, isLoading: false, isGuest: false }));
            }
        };
        loadToken();
    }, []);

    const register = async (name, email, password) => {
        setAuthState(prevState => ({ ...prevState, isLoading: true }));
        try {
            const response = await fetch(API_ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                const errorMessage = await parseErrorResponse(response);
                throw new Error(errorMessage);
            }
            Alert.alert("Kayıt Başarılı", "Hesabınız başarıyla oluşturuldu!");
            return { success: true, message: "Kayıt başarılı." };
        } catch (e) {
            console.error("Kayıt hatası:", e);
            return { success: false, message: e.message || "Kayıt olurken bir hata oluştu." };
        } finally {
            setAuthState(prevState => ({ ...prevState, isLoading: false }));
        }
    };

    const login = async (email, password) => {
        setAuthState(prevState => ({ ...prevState, isLoading: true }));
        try {
            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorMessage = await parseErrorResponse(response);
                throw new Error(errorMessage);
            }

            const data = await response.json();
            await AsyncStorage.setItem('userToken', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user)); // user objesini de kaydet

            setAuthState({
                token: data.token,
                authenticated: true,
                user: data.user,
                isGuest: false,
                isLoading: false,
            });
            return { success: true, message: "Giriş başarılı." };
        } catch (e) {
            console.error("Giriş hatası:", e);
            return { success: false, message: e.message || "Giriş yaparken bir hata oluştu." };
        } finally {
            setAuthState(prevState => ({ ...prevState, isLoading: false }));
        }
    };

    const updateProfile = async (name, email, phoneNumber, address) => {
        setAuthState(prevState => ({ ...prevState, isLoading: true }));
        try {
            const response = await fetch(API_ENDPOINTS.UPDATE_PROFILE, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authState.token}`
                },
                body: JSON.stringify({ name, email, phoneNumber, address }),
            });

            if (!response.ok) {
                const errorMessage = await parseErrorResponse(response);
                throw new Error(errorMessage);
            }

            const data = await response.json();
            await AsyncStorage.setItem('user', JSON.stringify(data)); // Güncel user objesini kaydet

            setAuthState(prevState => ({
                ...prevState,
                user: data,
                isLoading: false,
            }));
            return { success: true, message: "Profil başarıyla güncellendi." };
        } catch (e) {
            console.error("Profil güncelleme hatası:", e);
            return { success: false, message: e.message || 'Profil güncellenirken bir hata oluştu.' };
        } finally {
            setAuthState(prevState => ({ ...prevState, isLoading: false }));
        }
    };

    const enterGuestMode = () => {
        setAuthState(prevState => ({ ...prevState, isGuest: true, authenticated: false }));
    };

    const logout = async () => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('user');
        // "Beni Hatırla" durumu True ise e-postayı silme
        const rememberMeState = await AsyncStorage.getItem('rememberMe');
        if (rememberMeState !== 'true') {
            await AsyncStorage.removeItem('rememberedEmail');
        }
        setAuthState({
            token: null,
            authenticated: false,
            user: null,
            isGuest: false,
            isLoading: false,
        });
    };

    const sendPasswordResetCode = async (email) => {
        setAuthState(prevState => ({ ...prevState, isLoading: true }));
        try {
            const response = await fetch(API_ENDPOINTS.FORGOT_PASSWORD, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const errorMessage = await parseErrorResponse(response);
                Alert.alert("Hata", errorMessage);
                return { success: false, message: errorMessage };
            }
            
            // Başarılı durumda
            const data = await response.json();
          //  Alert.alert("Başarılı", data.message || "Şifre sıfırlama kodu e-posta adresinize gönderildi.");
            return { success: true, message: data.message || "Kod gönderildi." };

        } catch (e) {
            console.error("Şifre sıfırlama kodu gönderme hatası:", e);
            Alert.alert("Hata", e.message || "Şifre sıfırlama kodu gönderilirken bir sorun oluştu.");
            return { success: false, message: e.message || "Kod gönderilemedi." };
        } finally {
            setAuthState(prevState => ({ ...prevState, isLoading: false }));
        }
    };

    const verifyPasswordResetCode = async (email, code) => {
        setAuthState(prevState => ({ ...prevState, isLoading: true }));
        try {
            const response = await fetch(API_ENDPOINTS.VERIFY_CODE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });

            if (!response.ok) {
                const errorMessage = await parseErrorResponse(response);
                Alert.alert("Hata", errorMessage);
                return { success: false, message: errorMessage };
            }

            const data = await response.json();
            Alert.alert("Başarılı", data.message || "Doğrulama kodu geçerli.");
            return { success: true, message: data.message || "Kod doğrulandı." };
        } catch (e) {
            console.error("Doğrulama kodu hatası:", e);
            Alert.alert("Hata", e.message || "Doğrulama kodu geçersiz.");
            return { success: false, message: e.message || "Kod doğrulanamadı." };
        } finally {
            setAuthState(prevState => ({ ...prevState, isLoading: false }));
        }
    };

    const resetUserPassword = async (email, code, newPassword) => {
        setAuthState(prevState => ({ ...prevState, isLoading: true }));
        try {
            const response = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, newPassword }),
            });

            if (!response.ok) {
                const errorMessage = await parseErrorResponse(response);
                Alert.alert("Hata", errorMessage);
                return { success: false, message: errorMessage };
            }

            const data = await response.json();
            console.log("sendPasswordResetCode response:", data);
            Alert.alert("Başarılı", data.message || "Şifreniz başarıyla güncellendi.");
            return { success: true, message: data.message || "Şifre güncellendi." };
        } catch (e) {
            console.error("Şifre sıfırlama hatası:", e);
            Alert.alert("Hata", e.message || "Şifre sıfırlanırken bir sorun oluştu.");
            return { success: false, message: e.message || "Şifre sıfırlanamadı." };
        } finally {
            setAuthState(prevState => ({ ...prevState, isLoading: false }));
        }
    };


    const value = {
        ...authState,
        register,
        login,
        logout,
        enterGuestMode,
        updateProfile,
        sendPasswordResetCode, // Yeni fonksiyon
        verifyPasswordResetCode, // Yeni fonksiyon
        resetUserPassword, // Yeni fonksiyon
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
