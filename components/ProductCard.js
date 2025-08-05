import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

// Bu bileşen, dışarıdan 'product' ve 'onPress' adında iki prop (özellik) alır.
// 'product', gösterilecek ürünün bilgilerini içerir.
// 'onPress', bu karta tıklandığında ne olacağını belirler.
const ProductCard = ({ product, onPress }) => {
    return (
        // TouchableOpacity, bir View'in tıklanılabilir olmasını sağlar.
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image source={{ uri: product.image }} style={styles.image} />
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.price}>{product.price}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1, // Grid yapısında esnek bir şekilde yer kaplamasını sağlar
        margin: 8,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3, // Android için gölge
        shadowColor: '#000', // iOS için gölge
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        aspectRatio: 1, // Resmin en-boy oranını 1:1 (kare) yapar
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    infoContainer: {
        padding: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
    },
    price: {
        fontSize: 14,
        color: '#008000',
        marginTop: 5,
    }
});

export default ProductCard;