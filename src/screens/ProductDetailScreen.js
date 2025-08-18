import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { CustomButton } from '../components';
import { API_ENDPOINTS } from '../config/api';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';

const ProductDetailScreen = ({ route }) => {
    const { productId } = route.params; 
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();

    const isFav = product ? isFavorite(product.id) : false;

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/${productId}`);
                if (!response.ok) {
                    throw new Error('Ürün bulunamadı veya bir ağ hatası oluştu.');
                }
                const data = await response.json();
                setProduct(data);
            } catch (e) {
                setError(e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

    const handleAddToCart = async () => {
        if (!product) return;

        const result = await addToCart(product.id, 1);
        if (result.success) {
            Alert.alert('Folka', result.message);
        } else {
            Alert.alert('Hata', result.message);
        }
    };

    const handleToggleFavorite = () => {
        if (product) {
            toggleFavorite(product.id);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#8B4513" />
            </View>
        );
    }

    if (error || !product) {
        return (
            <View style={styles.center}>
                <Text>Ürün yüklenirken bir hata oluştu.</Text>
                <Text>{error?.message}</Text>
            </View>
        );
    }

    const imageSource = typeof product.image === 'string'
        ? { uri: product.image }
        : product.image;

    return (
        <ScrollView style={styles.container}>
            <Image source={imageSource} style={styles.image} />
            <TouchableOpacity 
                style={styles.favoriteButton} 
                onPress={handleToggleFavorite}
            >
                <Ionicons 
                    name={isFav ? "heart" : "heart-outline"} 
                    size={28}
                    color={isFav ? "red" : "gray"}
                />
            </TouchableOpacity>
            <View style={styles.detailsContainer}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.price}>{product.price}</Text>
                <Text style={styles.description}>{product.description}</Text>
                <CustomButton 
                    title="Sepete Ekle" 
                    onPress={handleAddToCart}
                    style={styles.button}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    image: { width: '100%', height: 350 },
    detailsContainer: { padding: 20 },
    name: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    price: { fontSize: 22, color: '#008000', marginBottom: 20 },
    description: { fontSize: 16, lineHeight: 24, color: '#666', marginBottom: 30 },
    button: {
        width: '100%',
        backgroundColor: '#8B4513'
    },
    favoriteButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        padding: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});

export default ProductDetailScreen;
