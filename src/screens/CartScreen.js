import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CartScreen = () => {
    return (
        <View style={styles.container}>
            <Ionicons name="cart-outline" size={80} color="#ccc" />
            <Text style={styles.title}>Sepetiniz Boş</Text>
            <Text style={styles.subtitle}>Beğendiğiniz ürünleri sepete ekleyerek alışverişe başlayın.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#333'
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
        paddingHorizontal: 40,
    }
});

export default CartScreen;
