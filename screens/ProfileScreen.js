import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { USER } from '../data/products'; // Statik kullanıcı verimizi import ediyoruz

const ProfileScreen = ({ navigation }) => {
    // Çıkış yap butonuna basıldığında kullanıcıyı Login ekranına geri döndürür.
    // 'replace' kullanıyoruz ki, çıkış yaptıktan sonra geri tuşuyla profile dönemesin.
const handleLogout = () => {
    // Navigasyon geçmişini sıfırla.
    navigation.reset({
        index: 0, // Aktif ekranın dizideki ilk eleman olduğunu belirtir.
        routes: [{ name: 'Login' }], // Yeni navigasyon destesi: içinde sadece 'Login' ekranı var.
    });
};

    return (
        <View style={styles.container}>
            <Image source={{ uri: USER.profileImage }} style={styles.avatar} />
            <Text style={styles.name}>{USER.name}</Text>
            <Text style={styles.email}>{USER.email}</Text>
            <View style={styles.buttonContainer}>
                 <Button 
                    title="Çıkış Yap" 
                    color="#FF3B30" // Kırmızı bir renk
                    onPress={handleLogout} 
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 50,
        backgroundColor: 'white'
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75, // Daire şeklinde olması için genişliğin yarısı
        marginBottom: 20,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 40,
    },
    buttonContainer:{
        width: '80%'
    }
});

export default ProfileScreen;