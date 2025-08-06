import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FavoritesScreen = () => {
    return (
        <View style={styles.container}>
            <Ionicons name="heart-outline" size={80} color="#ccc" />
            <Text style={styles.title}>Favori Ürününüz Yok</Text>
            <Text style={styles.subtitle}>Beğendiğiniz ürünleri kalp ikonuna dokunarak favorilerinize ekleyebilirsiniz.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 40,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#333',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
    }
});

export default FavoritesScreen;
