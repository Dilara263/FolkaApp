import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { Alert } from 'react-native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
    return useContext(FavoritesContext);
};

export const FavoritesProvider = ({ children }) => {
    const { authenticated, user, token } = useAuth();
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadFavorites = async () => {
            if (!authenticated) {
                setIsLoading(false);
                setFavoriteIds([]);
                return;
            }

            try {
                const response = await fetch(API_ENDPOINTS.FAVORITES, {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                });

                if (response.status === 204) {
                    setFavoriteIds([]);
                    return;
                }

                if (!response.ok) {
                    throw new Error('API request failed');
                }
                
                const data = await response.json();
                setFavoriteIds(data);

            } catch (error) {
                console.error("Favoriler yüklenirken hata oluştu:", error);
                setFavoriteIds([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadFavorites();
    }, [authenticated, token]);

    const toggleFavorite = async (productId) => {
        if (!authenticated) {
            console.warn("Favorilere eklemek/çıkarmak için giriş yapmalısınız.");
            Alert.alert("Giriş Gerekli", "Favorilere ürün eklemek veya çıkarmak için lütfen giriş yapın.");

            return;
        }

        const isFav = favoriteIds.includes(productId);
        
        const originalFavorites = [...favoriteIds];
        
        const newFavoriteIds = isFav
            ? favoriteIds.filter(id => id !== productId)
            : [...favoriteIds, productId];
        setFavoriteIds(newFavoriteIds);

        try {
            const url = `${API_ENDPOINTS.FAVORITES}/${productId}`;
            const method = isFav ? 'DELETE' : 'POST';

            const response = await fetch(url, { 
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                setFavoriteIds(originalFavorites);
                console.error("Favori durumu güncellenirken API hatası oluştu.");
            }
        } catch (error) {
            setFavoriteIds(originalFavorites);
            console.error("Favori durumu güncellenirken ağ hatası oluştu:", error);
        }
    };

    const isFavorite = (productId) => {
        return favoriteIds.includes(productId);
    };

    const value = {
        favoriteIds,
        toggleFavorite,
        isFavorite,
        isLoadingFavorites: isLoading,
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};
