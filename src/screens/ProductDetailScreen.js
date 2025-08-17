import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { CustomButton } from '../components';
import { API_ENDPOINTS } from '../config/api';

const ProductDetailScreen = ({ route }) => {
    const { productId } = route.params; 
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
            <View style={styles.detailsContainer}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.price}>{product.price}</Text>
                <Text style={styles.description}>{product.description}</Text>
                <CustomButton 
                    title="Sepete Ekle" 
                    onPress={() => Alert.alert('Folka', `${product.name} sepete eklendi!`)} 
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
    }
});

export default ProductDetailScreen;
