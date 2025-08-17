import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoritesContext';
import { API_ENDPOINTS } from '../config/api';
import { ProductCard } from '../components';

const FavoritesScreen = ({ navigation }) => {
    const { favoriteIds } = useFavorites();
    const [allProducts, setAllProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.PRODUCTS);
                const data = await response.json();
                setAllProducts(data);
            } catch (e) {
                console.error("Failed to fetch products for favorites screen", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const favoriteProducts = allProducts.filter(product => favoriteIds.includes(product.id));

    const renderContent = () => {
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
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                    <ProductCard
                        product={item}
                        onPress={() => navigation.navigate('Home', { screen: 'ProductDetail', params: { productId: item.id } })}
                    />
                )}
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
    }
});

export default FavoritesScreen;
