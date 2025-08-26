import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from './AuthContext';
import { Alert } from 'react-native';

const AddressContext = createContext();

export const useAddress = () => {
    return useContext(AddressContext);
};

export const AddressProvider = ({ children }) => {
    const { authenticated, token } = useAuth();
    const [userAddresses, setUserAddresses] = useState([]);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

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

    const apiRequest = async (url, options = {}) => {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    ...(options.headers || {})
                }
            });

            if (!response.ok) {
                const errorMessage = await parseErrorResponse(response);
                throw new Error(errorMessage);
            }

            if (response.status === 204 || response.headers.get('Content-Length') === '0') {
                return {};
            }

            return await response.json();
        } catch (error) {
            console.warn("API isteği hatası:", error);
            Alert.alert("Hata", error.message || "Bir sorun oluştu.");
            throw error;
        }
    };

    const loadAddresses = async () => {
        if (!authenticated) {
            setUserAddresses([]);
            setIsLoadingAddresses(false);
            return;
        }

        setIsLoadingAddresses(true);
        try {
            const data = await apiRequest(API_ENDPOINTS.MY_ADDRESSES);
            setUserAddresses(data || []); 
        } catch (error) {
            console.warn("Adresler yüklenirken uyarı:", error.message);
            setUserAddresses([]);
        } finally {
            setIsLoadingAddresses(false);
        }
    };

    useEffect(() => {
        loadAddresses();
    }, [authenticated, token]);

    const addAddress = async (addressData) => {
        if (!authenticated) {
            Alert.alert("Giriş Gerekli", "Adres eklemek için lütfen giriş yapın.");
            return { success: false, message: "Giriş yapmalısınız." };
        }
        setIsLoadingAddresses(true);
        try {
            const data = await apiRequest(API_ENDPOINTS.ADDRESSES, {
                method: 'POST',
                body: JSON.stringify(addressData)
            });
            setUserAddresses(data || []); 
            Alert.alert("Başarılı", "Adres başarıyla eklendi.");
            return { success: true, message: 'Adres eklendi!' };
        } catch (error) {
            return { success: false, message: error.message || 'Adres eklenirken bir sorun oluştu.' };
        } finally {
            setIsLoadingAddresses(false);
        }
    };

    const updateAddress = async (addressId, addressData) => {
        if (!authenticated) {
            Alert.alert("Giriş Gerekli", "Adres güncellemek için lütfen giriş yapın.");
            return { success: false, message: "Giriş yapmalısınız." };
        }
        setIsLoadingAddresses(true);
        try {
            const data = await apiRequest(`${API_ENDPOINTS.ADDRESSES}/${addressId}`, {
                method: 'PUT',
                body: JSON.stringify(addressData)
            });
            setUserAddresses(data || []); 
            Alert.alert("Başarılı", "Adres başarıyla güncellendi.");
            return { success: true, message: 'Adres güncellendi!' };
        } catch (error) {
            return { success: false, message: error.message || 'Adres güncellenirken bir sorun oluştu.' };
        } finally {
            setIsLoadingAddresses(false);
        }
    };

    const deleteAddress = async (addressId) => {
        if (!authenticated) {
            Alert.alert("Giriş Gerekli", "Adres silmek için lütfen giriş yapın.");
            return { success: false, message: "Giriş yapmalısınız." };
        }
        setIsLoadingAddresses(true);
        try {
            const data = await apiRequest(`${API_ENDPOINTS.ADDRESSES}/${addressId}`, {
                method: 'DELETE'
            });
            setUserAddresses(data || []); 
            Alert.alert("Başarılı", "Adres başarıyla silindi.");
            return { success: true, message: 'Adres silindi!' };
        } catch (error) {
            return { success: false, message: error.message || 'Adres silinirken bir sorun oluştu.' };
        } finally {
            setIsLoadingAddresses(false);
        }
    };

    const value = {
        userAddresses,
        isLoadingAddresses,
        loadAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
    };

    return (
        <AddressContext.Provider value={value}>
            {children}
        </AddressContext.Provider>
    );
};
