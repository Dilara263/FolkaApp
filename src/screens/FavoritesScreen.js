import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoritesContext';
import { API_ENDPOINTS } from '../config/api';
import { ProductCard } from '../components';
import { useAuth } from '../context/AuthContext';
import { CustomButton } from '../components';

const FavoritesScreen = ({ navigation }) => {
    const { favoriteIds } = useFavorites();
    const { authenticated, logout } = useAuth();
    const [allProducts, setAllProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!authenticated) {
                setIsLoading(false);
                return;
            }
            try {
                const response = await fetch(API_ENDPOINTS.PRODUCTS);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAllProducts(data);
            } catch (e) {
                console.error("Failed to fetch products for favorites screen", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [authenticated]);

    const favoriteProducts = allProducts.filter(product => favoriteIds.includes(product.id));

    const handleLoginRedirect = () => {
        logout();
    };

    const renderContent = () => {
        if (!authenticated) {
            return (
                <View style={styles.guestContainer}>
                    <Ionicons name="heart-dislike-outline" size={80} color="#ccc" />
                    <Text style={styles.guestTitle}>Favori listeniz görüntülenemiyor</Text>
                    <Text style={styles.guestSubtitle}>Favorilerinizi kaydetmek ve size özel fırsatları görmek için giriş yapın.</Text>
                    <CustomButton
                        title="Giriş Yap / Kayıt Ol"
                        onPress={handleLoginRedirect}
                        style={styles.loginButton}
                    />
                </View>
            );
        }

        if (isLoading) {
            return <View style={styles.center}><ActivityIndicator size="large" color="#8B4513" /></View>;
        }

        if (favoriteProducts.length === 0) {
            return (
                <View style={styles.center}>
                    <Ionicons name="heart-outline" size={80} color="#ccc" />
                    <Text style={styles.title}>Favori Ürününüz Yok</Text>
                    <Text style={styles.subtitle}>Beğendiğiniz ürünleri kalp ikonuna dokunarak favorilerinize ekleyebilirsiniz.</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={favoriteProducts}
                renderItem={({ item }) => (
                    <ProductCard
                        product={item}
                        onPress={() => navigation.navigate('Home', { screen: 'ProductDetail', params: { productId: item.id } })}
                    />
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
            />
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Text style={styles.pageTitle}>Favorilerim</Text>
            {renderContent()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: '#f5f5f5' 
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    center: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#f5f5f5', 
        paddingHorizontal: 40 
    },
    title: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        marginTop: 20, 
        color: '#333', 
        textAlign: 'center' 
    },
    subtitle: { 
        fontSize: 16, 
        color: '#666', 
        marginTop: 10, 
        textAlign: 'center' 
    },
    listContainer: { 
        paddingTop: 8, 
        paddingHorizontal: 8 
    },
    guestContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20, 
        backgroundColor: 'white' 
    },
    guestTitle: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        marginTop: 20, 
        color: '#333' 
    },
    guestSubtitle: { 
        fontSize: 16, 
        color: 'gray', 
        marginTop: 10, 
        textAlign: 'center', 
        paddingHorizontal: 20 
    },
    loginButton: { 
        marginTop: 30, 
        width: '80%', 
        backgroundColor: '#8B4513' 
    }
});

export default FavoritesScreen;
