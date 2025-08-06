import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { USER } from '../data/products';
import { CustomButton } from '../components';

const ProfileListItem = ({ icon, text, onPress, isLogout = false }) => (
    <TouchableOpacity style={styles.listItem} onPress={onPress}>
        <Ionicons name={icon} size={24} color={isLogout ? "#FF3B30" : "#555"} />
        <Text style={[styles.listItemText, isLogout && styles.logoutText]}>{text}</Text>
        {!isLogout && <Ionicons name="chevron-forward-outline" size={22} color="#ccc" />}
    </TouchableOpacity>
);

const ProfileScreen = ({ navigation, route }) => {
    const isGuest = route.params?.isGuest ?? false;

    const handleLogout = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'AuthStack' }],
        });
    };

    const handleLoginRedirect = () => {
        navigation.navigate('AuthStack', { screen: 'Login' });
    };

    const featureNotAvailable = () => {
        Alert.alert("Folka", "Bu özellik yakında eklenecektir.");
    };

    if (isGuest) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.guestContainer}>
                    <Ionicons name="person-circle-outline" size={100} color="#ccc" />
                    <Text style={styles.guestTitle}>Henüz giriş yapmadınız</Text>
                    <Text style={styles.guestSubtitle}>Favorilerinizi kaydetmek ve size özel fırsatları görmek için giriş yapın.</Text>
                    <CustomButton
                        title="Giriş Yap / Kayıt Ol"
                        onPress={handleLoginRedirect}
                        style={styles.loginButton}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.pageTitle}>Hesabım</Text>
                <View style={styles.headerContainer}>
                    <Image source={{ uri: USER.profileImage }} style={styles.avatar} />
                    <Text style={styles.name}>{USER.name}</Text>
                    <Text style={styles.email}>{USER.email}</Text>
                </View>

                <View style={styles.summaryContainer}>
                    <TouchableOpacity style={styles.summaryBox} onPress={featureNotAvailable}>
                        <Ionicons name="notifications-outline" size={24} color="#8B4513" />
                        <Text style={styles.summaryText}>Bildirimler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.summaryBox} onPress={featureNotAvailable}>
                        <Ionicons name="ticket-outline" size={24} color="#8B4513" />
                        <Text style={styles.summaryText}>Kuponlarım</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.summaryBox} onPress={featureNotAvailable}>
                        <Ionicons name="time-outline" size={24} color="#8B4513" />
                        <Text style={styles.summaryText}>Geçmiş</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.menuContainer}>
                    <ProfileListItem icon="person-outline" text="Profilim" onPress={() => navigation.navigate('EditProfile')} />
                    <ProfileListItem icon="location-outline" text="Adres Yönetimi" onPress={featureNotAvailable} />
                    <ProfileListItem icon="help-buoy-outline" text="Yardım & Destek" onPress={featureNotAvailable} />
                    <ProfileListItem icon="settings-outline" text="Ayarlar" onPress={featureNotAvailable} />
                    <ProfileListItem icon="log-out-outline" text="Çıkış Yap" onPress={handleLogout} isLogout={true} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
    container: { paddingBottom: 20 },
    pageTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 15,
        backgroundColor: '#F5EFE6',
    },
    headerContainer: { 
        backgroundColor: '#F5EFE6', 
        paddingTop: 10,
        paddingBottom: 30,
        alignItems: 'center', 
        borderBottomLeftRadius: 30, 
        borderBottomRightRadius: 30 
    },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: 'white' },
    name: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 10 },
    email: { fontSize: 16, color: '#666', marginTop: 5 },
    summaryContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        paddingHorizontal: 20, 
        marginTop: -25,
    },
    summaryBox: { 
        backgroundColor: 'white', 
        padding: 15, 
        borderRadius: 15, 
        alignItems: 'center', 
        width: '31%',
        elevation: 5, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 10 
    },
    summaryText: { 
        marginTop: 5, 
        fontSize: 12, 
        color: '#555', 
        fontWeight: '500' 
    },
    menuContainer: { 
        marginTop: 25, 
        marginHorizontal: 20, 
        backgroundColor: 'white', 
        borderRadius: 15, 
        padding: 10, 
        elevation: 2, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 1 }, 
        shadowOpacity: 0.05, 
        shadowRadius: 5 
    },
    listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10 },
    listItemText: { flex: 1, marginLeft: 15, fontSize: 16, color: '#333' },
    logoutText: { color: '#FF3B30', fontWeight: '500' },
    guestContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: 'white' },
    guestTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 20, color: '#333' },
    guestSubtitle: { fontSize: 16, color: 'gray', marginTop: 10, textAlign: 'center', paddingHorizontal: 20 },
    loginButton: { marginTop: 30, width: '80%', backgroundColor: '#8B4513' }
});

export default ProfileScreen;
