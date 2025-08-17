import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

const FavoritesContext = createContext();

export const useFavorites = () => {
    return useContext(FavoritesContext);
};

export const FavoritesProvider = ({ children }) => {
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.FAVORITES);

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
    }, []);

    const toggleFavorite = async (productId) => {
        const isFav = favoriteIds.includes(productId);
        
        const originalFavorites = [...favoriteIds];
        
        const newFavoriteIds = isFav
            ? favoriteIds.filter(id => id !== productId)
            : [...favoriteIds, productId];
        setFavoriteIds(newFavoriteIds);

        try {
            const url = `${API_ENDPOINTS.FAVORITES}/${productId}`;
            const method = isFav ? 'DELETE' : 'POST';

            const response = await fetch(url, { method });

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
