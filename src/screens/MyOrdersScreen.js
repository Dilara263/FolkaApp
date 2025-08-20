import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, Alert, TextInput, ScrollView, Image } from 'react-native'; // TextInput, ScrollView, Image eklendi
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import { CustomButton } from '../components';

const OrderCard = ({ order, onPress }) => {
    const formattedTotalPrice = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.totalPrice);

    return (
        <TouchableOpacity style={styles.orderCard} onPress={() => onPress(order.id)}>
            <View style={styles.orderCardContent}>
                <View style={styles.orderInfoLeft}>
                    <Text style={styles.orderDate}>{new Date(order.orderDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                    <Text style={styles.orderTotal}>{formattedTotalPrice}</Text>
                    <View style={styles.orderStatusContainer}>
                        <Ionicons name="checkmark-circle" size={16} color="#28a745" />
                        <Text style={styles.orderStatusText}>{order.status === "Pending" ? "Hazırlanıyor" : "Teslim Edildi"}</Text>
                    </View>
                </View>
                <View style={styles.orderInfoRight}>
                    <TouchableOpacity style={styles.detailsButton} onPress={() => onPress(order.id)}>
                        <Text style={styles.detailsButtonText}>Detaylar</Text>
                        <Ionicons name="chevron-forward-outline" size={16} color="#8B4513" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.orderItemsContainer}>
                {order.orderItems && order.orderItems.length > 0 ? (
                    order.orderItems.slice(0, 2).map((item, index) => (
                        <View key={item.id || index} style={styles.orderItemRow}>
                            {item.productImage ? (
                                <Image source={{ uri: item.productImage }} style={styles.orderItemImage} />
                            ) : (
                                <View style={styles.orderItemImagePlaceholder}><Text style={{fontSize: 8, textAlign: 'center'}}>Görsel Yok</Text></View>
                            )}
                            <Text style={styles.orderItemText}>{item.quantity}x {item.productName}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.orderItemText}>Ürün yok</Text>
                )}
                {order.orderItems && order.orderItems.length > 2 && (
                    <Text style={styles.orderItemEllipsis}>...</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const MyOrdersScreen = ({ navigation }) => {
    const { authenticated, token, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchVisible, setSearchVisible] = useState(false);

    useEffect(() => {
        const fetchMyOrders = async () => {
            if (!authenticated) {
                setIsLoading(false);
                setOrders([]);
                return;
            }

            try {
                const response = await fetch(API_ENDPOINTS.MY_ORDERS, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        setOrders([]);
                        return;
                    }
                    const errorData = await response.json().catch(() => ({ message: 'Siparişler yüklenirken bilinmeyen bir hata oluştu.' }));
                    throw new Error(errorData.message || 'Siparişler yüklenirken API hatası oluştu.');
                }

                const data = await response.json();
                setOrders(data);
            } catch (e) {
                console.error("Siparişler yüklenirken hata:", e);
                setError(e);
                Alert.alert("Hata", e.message || "Siparişleriniz yüklenirken bir sorun oluştu.");
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyOrders();
    }, [authenticated, token]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => setSearchVisible(!searchVisible)} style={{ marginRight: 15 }}>
                    <Ionicons name="search-outline" size={24} color="black" />
                </TouchableOpacity>
            ),
        });
    }, [navigation, searchVisible]);

    const handleOrderPress = (orderId) => {
        Alert.alert("Sipariş Detayı", `Sipariş ID: ${orderId} detayları yakında eklenecektir.`);
    };

    const filteredOrders = orders.filter(order => 
        order.orderItems.some(item => 
            item.productName && item.productName.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const ListHeader = () => (
        <>
            {searchVisible && (
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Ürün adına göre ara..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        autoFocus={true}
                    />
                </View>
            )}
        </>
    );

    if (!authenticated) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.guestContainer}>
                    <Ionicons name="receipt-outline" size={80} color="#ccc" />
                    <Text style={styles.guestTitle}>Sipariş Geçmişiniz görüntülenemiyor</Text>
                    <Text style={styles.guestSubtitle}>Geçmiş siparişlerinizi görmek için lütfen giriş yapın.</Text>
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
                    <Text>Siparişleriniz Yükleniyor...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.center}>
                    <Text>Siparişleriniz yüklenirken bir hata oluştu.</Text>
                    <Text>{error.message}</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (filteredOrders.length === 0 && searchTerm !== '') {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ListHeader />
                <View style={styles.center}>
                    <Ionicons name="search-outline" size={80} color="#ccc" />
                    <Text style={styles.title}>Aramanızla Eşleşen Sipariş Bulunamadı</Text>
                    <Text style={styles.subtitle}>Farklı bir ürün adı deneyin.</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (orders.length === 0) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ListHeader />
                <View style={styles.center}>
                    <Ionicons name="receipt-outline" size={80} color="#ccc" />
                    <Text style={styles.title}>Henüz Siparişiniz Yok</Text>
                    <Text style={styles.subtitle}>Sepetinizi onaylayarak ilk siparişinizi oluşturabilirsiniz.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <OrderCard order={item} onPress={handleOrderPress} />
                )}
                ListHeaderComponent={ListHeader}
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
    
    // Arama çubuğu stilleri (HomeScreen'den alındı)
    searchContainer: { 
        paddingHorizontal: 18, 
        paddingTop: 10, 
        paddingBottom: 5,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    searchInput: { 
        height: 40, 
        backgroundColor: '#f0f0f0', 
        borderRadius: 8, 
        paddingHorizontal: 10, 
        fontSize: 16 
    },

    // Misafir modu stilleri
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

    // OrderCard stilleri (görsele göre güncellendi)
    orderCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    orderCardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    orderInfoLeft: {
        flex: 1,
        marginRight: 10,
    },
    orderInfoRight: {
        alignItems: 'flex-end',
    },
    orderHeader: { // Kaldırıldı, orderCardContent içinde yönetiliyor
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // marginBottom: 10,
        // borderBottomWidth: 1,
        // borderBottomColor: '#eee',
        // paddingBottom: 8,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    orderDate: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 5,
    },
    orderTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#8B4513',
        marginBottom: 8,
    },
    orderStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e6ffe6',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 5,
        alignSelf: 'flex-start',
    },
    orderStatusText: {
        fontSize: 14,
        color: '#28a745',
        marginLeft: 5,
        fontWeight: 'bold',
    },
    orderDetails: { // Kaldırıldı, orderCardContent içinde yönetiliyor
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // marginBottom: 10,
    },
    detailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#F5EFE6',
    },
    detailsButtonText: {
        fontSize: 14,
        color: '#8B4513',
        marginRight: 5,
        fontWeight: 'bold',
    },
    orderArrow: { // Kaldırıldı, detailsButton içinde yönetiliyor
        // position: 'absolute',
        // right: 15,
        // top: '50%',
        // marginTop: -12,
    },
    orderItemsContainer: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
        marginTop: 10,
    },
    orderItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    orderItemImage: {
        width: 40,
        height: 40,
        borderRadius: 5,
        marginRight: 10,
        resizeMode: 'cover',
    },
    orderItemImagePlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 5,
        marginRight: 10,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderItemText: {
        fontSize: 14,
        color: '#666',
    },
    orderItemEllipsis: {
        fontSize: 14,
        color: '#666',
        textAlign: 'right',
        marginTop: 5,
    }
});

export default MyOrdersScreen;
