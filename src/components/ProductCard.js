import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoritesContext';

const ProductCard = ({ product, onPress }) => {
    const { toggleFavorite, isFavorite } = useFavorites();
    const isFav = isFavorite(product.id);

    const imageSource = typeof product.image === 'string'
        ? { uri: product.image } 
        : product.image;

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image source={imageSource} style={styles.image} />
            <TouchableOpacity 
                style={styles.favoriteButton} 
                onPress={() => toggleFavorite(product.id)}
            >
                <Ionicons 
                    name={isFav ? "heart" : "heart-outline"} 
                    size={24} 
                    color={isFav ? "red" : "gray"} 
                />
            </TouchableOpacity>
            <View style={styles.infoContainer}>
                <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
                <Text style={styles.price}>{product.price}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: { flex: 1, margin: 8, backgroundColor: 'white', borderRadius: 8, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    image: { width: '100%', height: 160, resizeMode: 'cover', borderTopLeftRadius: 8, borderTopRightRadius: 8 },
    favoriteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 15,
        padding: 4,
    },
    infoContainer: { padding: 10 },
    name: { fontSize: 15, fontWeight: '600', minHeight: 40 },
    price: { fontSize: 14, color: '#008000', marginTop: 5 }
});

export default ProductCard;
