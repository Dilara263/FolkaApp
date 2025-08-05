import React from 'react';
import { View, Text, Image, StyleSheet, Button, ScrollView, Alert } from 'react-native';
import { PRODUCTS } from '../data/products'; // Veri dosyamızı tekrar import ediyoruz

// Bu sefer component'imiz { route } adında özel bir prop alıyor.
// 'route' prop'u, bu ekrana gelirken gönderilen parametreleri içerir.
const ProductDetailScreen = ({ route }) => {
    // 'route.params' içinden, HomeScreen'den gönderdiğimiz 'productId'yi alıyoruz.
    const { productId } = route.params; 
    
    // Gelen ID'yi kullanarak, PRODUCTS dizisi içinde doğru ürünü buluyoruz.
    const product = PRODUCTS.find(p => p.id === productId);

    // Eğer bir sebepten ürün bulunamazsa (normalde olmamalı) bir uyarı gösterelim.
    if (!product) {
        return (
            <View style={styles.center}>
                <Text>Ürün bulunamadı!</Text>
            </View>
        );
    }

    // Ürün bulunduysa, detaylarını ekranda gösterelim.
    // İçerik ekrandan taşabileceği için ScrollView kullanmak iyi bir pratiktir.
    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: product.image }} style={styles.image} />
            <View style={styles.detailsContainer}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.price}>{product.price}</Text>
                <Text style={styles.description}>{product.description}</Text>
                <View style={styles.buttonContainer}>
                    <Button 
                        title="Sepete Ekle" 
                        onPress={() => Alert.alert('Folka', `${product.name} sepete eklendi!`)} 
                        color="#8B4513"
                    />
                </View>
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
    buttonContainer: {
        marginTop: 10,
    }
});

export default ProductDetailScreen;