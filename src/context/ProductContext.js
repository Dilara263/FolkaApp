import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from './AuthContext';
import { Alert } from 'react-native';

const ProductContext = createContext();

export const useProducts = () => {
    return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
    const { authenticated, token, user } = useAuth();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const isAdmin = user?.role === 'Admin';

    const parseErrorResponse = async (response) => {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return data.message || 'Bilinmeyen bir hata oluştu.';
        } else {
            const text = await response.text();
            return text || 'Bilinmeyen bir hata oluştu.';
        }
    };

    const apiRequest = async (url, options = {}) => {
        const defaultHeaders = {
            'Content-Type': 'application/json',
        };
        if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...defaultHeaders,
                    ...(options.headers || {})
                }
            });
            console.log("➡️ Request:", options.method || "GET", url);
            console.log("⬅️ Status:", response.status);

            if (!response.ok) {
                const errorMessage = await parseErrorResponse(response);
                console.log("❌ Backend Error:", errorMessage);
                throw new Error(errorMessage); 
            }

            if (response.status === 204) return null;

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            }
            return await response.text(); 
        } catch (error) {
            console.error("API isteği hatası:", error);
            throw error;
        }
    };


    const fetchProducts = async () => {
        if (!authenticated || !isAdmin) {
            setProducts([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const data = await apiRequest(API_ENDPOINTS.PRODUCTS);
            setProducts(data || []);
        } catch (error) {
            console.warn("Ürünler yüklenirken uyarı:", error.message);
            Alert.alert("Hata", error.message || "Ürünler yüklenirken bir sorun oluştu.");
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (authenticated && isAdmin) {
             fetchProducts();
        }
    }, [authenticated, isAdmin, token]);

    const addProduct = async (productData) => {
        if (!isAdmin) {
            Alert.alert("Erişim Reddedildi", "Bu işlemi yapmak için yönetici olmalısınız.");
            return { success: false };
        }
        try {
            const newProduct = await apiRequest(API_ENDPOINTS.ADMIN_PRODUCTS, {
                method: 'POST',
                body: JSON.stringify(productData)
            });
            setProducts(prev => [...prev, newProduct]);
            Alert.alert("Başarılı", "Ürün başarıyla eklendi.");
            return { success: true };
        } catch (error) {
            Alert.alert("Hata", error.message || "Ürün eklenirken bir sorun oluştu.");
            return { success: false, message: error.message };
        }
    };

    const updateProduct = async (productId, productData) => {
        if (!isAdmin) {
            Alert.alert("Erişim Reddedildi", "Bu işlemi yapmak için yönetici olmalısınız.");
            return { success: false };
        }
        try {
            await apiRequest(`${API_ENDPOINTS.ADMIN_UPDATE_PRODUCT}/${productId}`, {
                method: 'PUT',
                body: JSON.stringify(productData)
            });
            await fetchProducts(); 
            Alert.alert("Başarılı", "Ürün başarıyla güncellendi.");
            return { success: true };
        } catch (error) {
            Alert.alert("Hata", error.message || "Ürün güncellenirken bir sorun oluştu.");
            return { success: false, message: error.message };
        }
    };

    const deleteProduct = async (productId) => {
        if (!isAdmin) {
            Alert.alert("Erişim Reddedildi", "Bu işlemi yapmak için yönetici olmalısınız.");
            return { success: false };
        }
        try {
            const data = await apiRequest(`${API_ENDPOINTS.ADMIN_DELETE_PRODUCT}/${productId}`, {
                method: 'DELETE',
            });
            setProducts(prev => prev.filter(p => p.id !== productId));
            Alert.alert("Başarılı", data.message || "Ürün başarıyla silindi.");
            return { success: true };
        } catch (error) {
            Alert.alert("Hata", error.message || "Ürün silinirken bir sorun oluştu.");
            return { success: false, message: error.message };
        }
    };

    const value = {
        products,
        isLoading,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};
