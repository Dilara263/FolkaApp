    import React, { createContext, useState, useContext, useEffect } from 'react';
    import { API_ENDPOINTS } from '../config/api';
    import { Alert } from 'react-native';

    const CategoryContext = createContext();

    export const useCategories = () => {
        return useContext(CategoryContext);
    };

    export const CategoryProvider = ({ children }) => {
        const [categories, setCategories] = useState([]);
        const [isLoadingCategories, setIsLoadingCategories] = useState(true);
        const [error, setError] = useState(null);

        const fetchCategories = async () => {
            setIsLoadingCategories(true);
            try {
                const response = await fetch(API_ENDPOINTS.CATEGORIES);
                if (!response.ok) {
                    throw new Error("Kategoriler yüklenirken bir hata oluştu.");
                }
                const data = await response.json();
                setCategories(data || []);
            } catch (e) {
                setError(e);
                Alert.alert("Hata", e.message || "Kategoriler yüklenirken bir sorun oluştu.");
                setCategories([]);
            } finally {
                setIsLoadingCategories(false);
            }
        };

        useEffect(() => {
            fetchCategories();
        }, []);

        const value = {
            categories,
            isLoadingCategories,
            fetchCategories,
        };

        return (
            <CategoryContext.Provider value={value}>
                {children}
            </CategoryContext.Provider>
        );
    };
    