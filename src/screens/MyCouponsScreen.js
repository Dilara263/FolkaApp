import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import { CustomButton } from '../components';

const CouponCard = ({ coupon, onPress }) => {
    return (
        <TouchableOpacity style={styles.couponCard} onPress={() => onPress(coupon.id)}>
            <View style={styles.couponCardLeft}>
                <Ionicons name="ticket-outline" size={36} color="#8B4513" style={styles.couponCardIcon} />
                <View style={styles.couponCardDetails}>
                    <Text style={styles.couponCardCode}>{coupon.id}</Text>
                    <Text style={styles.couponCardDescription} numberOfLines={1}>{coupon.description}</Text>
                    {coupon.minOrderAmount > 0 && (
                        <Text style={styles.couponCardMinAmount}>Min. Sipariş: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(coupon.minOrderAmount)}</Text>
                    )}
                </View>
            </View>
            <View style={styles.couponCardRight}>
                <Text style={styles.couponCardExpiry}>SKT: {new Date(coupon.expiryDate).toLocaleDateString('tr-TR')}</Text>
            </View>
        </TouchableOpacity>
    );
};

const MyCouponsScreen = ({ navigation }) => {
    const { authenticated, token, logout } = useAuth();
    const [coupons, setCoupons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyCoupons = async () => {
            if (!authenticated) {
                setIsLoading(false);
                setCoupons([]);
                return;
            }

            try {
                const response = await fetch(API_ENDPOINTS.MY_COUPONS, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        setCoupons([]);
                        return;
                    }
                    const errorData = await response.json().catch(() => ({ message: 'Kuponlar yüklenirken bilinmeyen bir hata oluştu.' }));
                    throw new Error(errorData.message || 'Kuponlar yüklenirken API hatası oluştu.');
                }

                const data = await response.json();
                setCoupons(data);
            } catch (e) {
                console.error("Kuponlar yüklenirken hata:", e);
                setError(e);
                Alert.alert("Hata", e.message || "Kuponlarınız yüklenirken bir sorun oluştu.");
                setCoupons([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyCoupons();
    }, [authenticated, token]);

    const handleCouponPress = (couponId) => {
        Alert.alert("Kupon Detayı", `Kupon Kodu: ${couponId}\nBu kuponu sepetinizde manuel olarak kullanabilirsiniz.`);
    };

    if (!authenticated) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.guestContainer}>
                    <Ionicons name="ticket-outline" size={80} color="#ccc" />
                    <Text style={styles.guestTitle}>Kuponlarınız görüntülenemiyor</Text>
                    <Text style={styles.guestSubtitle}>Kuponlarınızı görmek için lütfen giriş yapın.</Text>
                    <CustomButton
                        title="Giriş Yap / Kayıt Ol"
                        onPress={() => logout()}
                        style={styles.loginButton}
                    />
                </View>
            </SafeAreaView>
        );
    }

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#8B4513" />
                    <Text>Kuponlarınız Yükleniyor...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.center}>
                    <Text>Kuponlarınız yüklenirken bir hata oluştu.</Text>
                    <Text>{error.message}</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (coupons.length === 0) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.center}>
                    <Ionicons name="ticket-outline" size={80} color="#ccc" />
                    <Text style={styles.title}>Henüz Kuponunuz Yok</Text>
                    <Text style={styles.subtitle}>Yeni kuponlar için bizi takipte kalın!</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <FlatList
                data={coupons}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <CouponCard coupon={item} onPress={handleCouponPress} />
                )}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginTop: 20, color: '#333', textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#666', marginTop: 10, textAlign: 'center' },
    listContainer: { paddingHorizontal: 10, paddingTop: 10 },
    
    headerContainer: {
        backgroundColor: 'white',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },

    guestContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20, 
        backgroundColor: 'white' 
    },
    guestTitle: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        marginTop: 20, 
        color: '#333' 
    },
    guestSubtitle: { 
        fontSize: 16, 
        color: 'gray', 
        marginTop: 10, 
        textAlign: 'center', 
        paddingHorizontal: 20 
    },
    loginButton: { 
        marginTop: 30, 
        width: '80%', 
        backgroundColor: '#8B4513' 
    },

    couponCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        borderLeftWidth: 5,
        borderColor: '#8B4513',
    },
    couponCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 2,
    },
    couponCardIcon: {
        marginRight: 15,
    },
    couponCardDetails: {
        flex: 1,
    },
    couponCardCode: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    couponCardDescription: {
        fontSize: 14,
        color: '#555',
        marginBottom: 2,
    },
    couponCardMinAmount: {
        fontSize: 12,
        color: 'gray',
        marginTop: 2,
    },
    couponCardRight: {
        alignItems: 'flex-end',
        flex: 1,
    },
    couponCardExpiry: {
        fontSize: 14,
        color: '#555',
        fontWeight: '500',
    },
});

export default MyCouponsScreen;
