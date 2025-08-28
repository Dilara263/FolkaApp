import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const adminActions = [
    { id: '1', title: 'Ürün Yönetimi', icon: 'cube-outline', screen: 'ProductManagement' },
    { id: '2', title: 'Kupon Yönetimi', icon: 'ticket-outline', screen: 'CouponManagement' },
    { id: '3', title: 'Sipariş Yönetimi', icon: 'receipt-outline', screen: 'OrderManagement' },
    { id: '4', title: 'Kullanıcı Yönetimi', icon: 'people-outline', screen: 'UserManagement' },
];

const ActionCard = ({ item, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item.screen)}>
        <Ionicons name={item.icon} size={32} color="#8B4513" />
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Ionicons name="chevron-forward-outline" size={24} color="#ccc" />
    </TouchableOpacity>
);

const AdminDashboardScreen = ({ navigation }) => {
    const { user, logout } = useAuth();

    const handleActionPress = (screenName) => {
        if (screenName === 'ProductManagement' || screenName === 'CouponManagement') {
             navigation.navigate(screenName);
        } else {
            Alert.alert("Yakında", `${screenName} ekranı yakında eklenecektir.`);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Admin Paneli</Text>
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                </TouchableOpacity>
            </View>
            <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText}>Hoş geldin, {user?.name}!</Text>
                <Text style={styles.descriptionText}>Lütfen bir yönetim görevi seçin.</Text>
            </View>
            <FlatList
                data={adminActions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <ActionCard item={item} onPress={handleActionPress} />}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    logoutButton: {
        position: 'absolute',
        right: 15,
        top: 15,
    },
    welcomeContainer: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    descriptionText: {
        fontSize: 14,
        color: 'gray',
        marginTop: 5,
    },
    listContainer: {
        padding: 10,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginLeft: 15,
    },
});

export default AdminDashboardScreen;
