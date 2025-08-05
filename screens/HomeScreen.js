// screens/HomeScreen.js dosyasının yeni ve son hali

import React, { useState, useLayoutEffect } from 'react';
import { View, StyleSheet, FlatList, Button, Text, ScrollView, TouchableOpacity } from 'react-native';
import { PRODUCTS, CATEGORIES } from '../data/products'; // CATEGORIES'i de import ediyoruz
import ProductCard from '../components/ProductCard';

const HomeScreen = ({ navigation }) => {
    // Hangi kategorinin seçili olduğunu tutmak için bir state oluşturuyoruz.
    // Başlangıçta 'Tümü' seçili olacak.
    const [selectedCategory, setSelectedCategory] = useState('Tümü');

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onPress={() => navigation.navigate('Profile')} title="Profil" color="#007AFF" />
            )
        });
    }, [navigation]);

    // Seçili kategoriye göre ürünleri filtreleyen bir mantık.
    // Eğer 'Tümü' seçiliyse tüm ürünleri, değilse sadece o kategorideki ürünleri göster.
    const filteredProducts = selectedCategory === 'Tümü'
        ? PRODUCTS
        : PRODUCTS.filter(product => product.category === selectedCategory);

    const renderProductItem = ({ item }) => (
        <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        />
    );

    // Kategori butonlarını oluşturan bölüm
    const renderCategoryButtons = () => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {CATEGORIES.map(category => (
                <TouchableOpacity
                    key={category}
                    style={[
                        styles.categoryButton,
                        selectedCategory === category && styles.categoryButtonActive
                    ]}
                    onPress={() => setSelectedCategory(category)}
                >
                    <Text style={[
                        styles.categoryButtonText,
                        selectedCategory === category && styles.categoryButtonTextActive
                    ]}>{category}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    return (
        <View style={styles.mainContainer}>
            {/* Kategori butonlarını en üste ekliyoruz */}
            {renderCategoryButtons()}
            
            {/* Ürün listesini FlatList ile gösteriyoruz */}
            <FlatList
                data={filteredProducts} // Artık filtrelenmiş veriyi kullanıyoruz
                renderItem={renderProductItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    categoriesContainer: {
        paddingVertical: 10,
        paddingHorizontal: 8,
        backgroundColor: 'white',
        maxHeight: 60,
    },
    categoryButton: {
        backgroundColor: '#eee',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginHorizontal: 5,
        justifyContent: 'center',
    },
    categoryButtonActive: {
        backgroundColor: '#8B4513', // Marka rengimiz
    },
    categoryButtonText: {
        color: '#333',
        fontSize: 14,
    },
    categoryButtonTextActive: {
        color: 'white',
        fontWeight: 'bold',
    },
    listContainer: {
        paddingHorizontal: 8,
        paddingTop: 8,
    }
});

export default HomeScreen;