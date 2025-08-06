import React, { useState, useLayoutEffect } from 'react';
import { View, StyleSheet, FlatList, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState('Tümü');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchVisible, setSearchVisible] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => <Text style={styles.headerTitle}>Folka</Text>,
            headerRight: () => (
                <TouchableOpacity onPress={() => setSearchVisible(!searchVisible)} style={{ marginRight: 15 }}>
                    <Ionicons name="search-outline" size={24} color="black" />
                </TouchableOpacity>
            ),
            headerLeft: () => <View style={{ marginLeft: 15 }}/>
        });
    }, [navigation, searchVisible]);

    const filteredProducts = PRODUCTS
        .filter(product => selectedCategory === 'Tümü' || product.category === selectedCategory)
        .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const renderProductItem = ({ item }) => (
        <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        />
    );

    const ListHeader = () => (
        <>
            {searchVisible && (
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Ürün adı ara..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        autoFocus={true}
                    />
                </View>
            )}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
                {CATEGORIES.map(category => (
                    <TouchableOpacity
                        key={category}
                        style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
                        onPress={() => setSelectedCategory(category)}
                    >
                        <Text style={[styles.categoryButtonText, selectedCategory === category && styles.categoryButtonTextActive]}>{category}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </>
    );

    return (
        <FlatList
            style={styles.mainContainer}
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            ListHeaderComponent={ListHeader}
            contentContainerStyle={styles.listContainer}
        />
    );
};

const styles = StyleSheet.create({
    headerTitle: { fontSize: 22, fontWeight: 'bold', fontFamily: 'serif' },
    mainContainer: { 
        flex: 1, 
        backgroundColor: '#f5f5f5',
    },
    searchContainer: { 
        paddingHorizontal: 18, 
        paddingTop: 10, 
        paddingBottom: 5,
        backgroundColor: 'white' 
    },
    searchInput: { 
        height: 40, 
        backgroundColor: '#f0f0f0', 
        borderRadius: 8, 
        paddingHorizontal: 10, 
        fontSize: 16 
    },
    categoriesContainer: { 
        paddingVertical: 10, 
        paddingHorizontal: 8, 
        backgroundColor: 'white', 
        maxHeight: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    categoryButton: { 
        backgroundColor: '#eee', 
        paddingHorizontal: 16, 
        paddingVertical: 8, 
        borderRadius: 20, 
        marginHorizontal: 5, 
        justifyContent: 'center' 
    },
    categoryButtonActive: { 
        backgroundColor: '#8B4513' 
    },
    categoryButtonText: { 
        color: '#333', 
        fontSize: 14 
    },
    categoryButtonTextActive: { 
        color: 'white', 
        fontWeight: 'bold' 
    },
    listContainer: { 
        paddingHorizontal: 8, 
        paddingTop: 8,
    }
});

export default HomeScreen;
