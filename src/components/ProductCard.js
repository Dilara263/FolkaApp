import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const ProductCard = ({ product, onPress }) => {

    const imageSource = typeof product.image === 'string'
        ? { uri: product.image } 
        : product.image;

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image source={imageSource} style={styles.image} />
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.price}>{product.price}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 8,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: 160,
        resizeMode: 'cover',
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