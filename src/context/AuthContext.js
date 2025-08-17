import React, { createContext, useState, useContext, useEffect } from 'react';
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
                            phoneNumber: parsedStoredUser.phoneNumber || null,
                            address: parsedStoredUser.address || null,
                        },
                        isGuest: false,
                        isLoading: false,
                    });
                } else {
                    setAuthState({ token: null, authenticated: false, user: null, isGuest: false, isLoading: false });
                }
            } catch (e) {
                console.error("Token yüklenirken hata oluştu:", e);
                setAuthState({ token: null, authenticated: false, user: null, isGuest: false, isLoading: false });
            }
        };
        loadToken();
    }, []);

    const register = async (name, email, password) => {
        try {
            const response = await fetch(API_ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            return response;
        } catch (e) {
            console.error("Register error", e);
            return { ok: false, json: () => Promise.resolve({ message: "Ağ hatası oluştu." }) };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Giriş başarısız oldu.' }));
                return { success: false, message: errorData.message || 'Giriş başarısız oldu.' };
            }

            const data = await response.json();
            const token = data.token;
            const userFromServer = data.user;

            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('user', JSON.stringify(userFromServer));

            const decodedToken = jwtDecode(token);
            
            setAuthState({
                token: token,
                authenticated: true,
                user: userFromServer || {
                    id: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
                    name: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
                    email: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
                },
                isGuest: false,
                isLoading: false,
            });
            return { success: true, message: 'Giriş başarılı.' };
        } catch (e) {
            console.error("Login error", e);
            return { success: false, message: "Ağ hatası veya sunucuya ulaşılamadı." };
        }
    };

    const updateProfile = async (name, email, phoneNumber, address) => {
        setAuthState(prevState => ({ ...prevState, isLoading: true }));
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                return { success: false, message: "Kullanıcı yetkilendirilemedi." };
            }

            const response = await fetch(API_ENDPOINTS.UPDATE_PROFILE, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, email, phoneNumber, address }),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setAuthState(prevState => ({
                    ...prevState,
                    user: updatedUser,
                }));
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
                return { success: true, message: 'Profil başarıyla güncellendi.' };
            } else {
                const rawErrorText = await response.text();
                console.log("API'den gelen ham hata yanıtı:", rawErrorText);

                let errorData;
                try {
                    errorData = JSON.parse(rawErrorText);
                } catch (parseError) {
                    errorData = { message: rawErrorText || 'Bilinmeyen bir hata oluştu.' };
                }
                
                return { success: false, message: errorData.message || 'Profil güncellenirken bir hata oluştu.' };
            }
        } catch (e) {
            console.error("Profil güncelleme hatası:", e);
            return { success: false, message: 'Ağ hatası veya sunucuya ulaşılamadı.' };
        } finally {
            setAuthState(prevState => ({ ...prevState, isLoading: false }));
        }
    };

    const enterGuestMode = () => {
        setAuthState(prevState => ({ ...prevState, isGuest: true }));
    };

    const logout = async () => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('user');
        setAuthState({
            token: null,
            authenticated: false,
            user: null,
            isGuest: false,
            isLoading: false,
        });
    };

    const value = {
        ...authState,
        register,
        login,
        logout,
        enterGuestMode,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
