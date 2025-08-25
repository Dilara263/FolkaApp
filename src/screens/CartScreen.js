import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { CustomButton } from '../components';
import { useCart } from '../context/CartContext';
import { API_ENDPOINTS } from '../config/api';

// Sepet öğesi kartı bileşeni
const CartItemCard = ({ item, onRemove, onQuantityChange }) => {
    const productName = item.productName || 'Ürün Adı Yok'; 
    const productPrice = (item.productPrice !== undefined && item.productPrice !== null && !isNaN(item.productPrice))
        ? item.productPrice
        : 0; 

    const productImage = item.productImage || 'https://placehold.co/80x80/cccccc/333333?text=No+Image'; 
    const imageSource = { uri: productImage }; 

    const formattedPrice = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(productPrice);

    return (
        <View style={styles.cartItemContainer}>
            <Image source={imageSource} style={styles.cartItemImage} />
            <View style={styles.cartItemDetails}>
                <Text style={styles.cartItemName} numberOfLines={2}>{productName}</Text>
                <Text style={styles.cartItemPrice}>{formattedPrice}</Text>
                <View style={styles.quantityControl}>
                    <TouchableOpacity onPress={() => onQuantityChange(item.productId, item.quantity - 1)}>
                        <Ionicons name="remove-circle-outline" size={24} color="#8B4513" />
                    </TouchableOpacity>
                    <Text style={styles.cartItemQuantity}>{item.quantity != null ? item.quantity.toString() : '0'}</Text>
                    <TouchableOpacity onPress={() => onQuantityChange(item.productId, item.quantity + 1)}>
                        <Ionicons name="add-circle-outline" size={24} color="#8B4513" />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity onPress={() => onRemove(item.productId)} style={styles.removeButton}>
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
            </TouchableOpacity>
        </View>
    );
};


const CartScreen = ({ navigation }) => {
    const { authenticated, logout } = useAuth();
    const { cartItems, isLoadingCart, removeFromCart, updateCartItemQuantity, clearCart, totalPrice, discountAmount, appliedCouponCode, applyCoupon, removeCoupon, confirmOrder } = useCart(); 

    const [showOrderSummaryDetails, setShowOrderSummaryDetails] = useState(false); 
    const [couponCode, setCouponCode] = useState(''); 

    const handleLoginRedirect = () => {
        logout();
    };

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity <= 0) {
            await removeFromCart(productId);
        } else {
            await updateCartItemQuantity(productId, newQuantity);
        }
    };

    const handleClearCart = () => {
        Alert.alert(
            "Sepeti Temizle",
            "Sepetinizdeki tüm ürünleri silmek istediğinizden emin misiniz?",
            [
                {
                    text: "Vazgeç",
                    style: "cancel"
                },
                {
                    text: "Evet, Temizle",
                    onPress: () => clearCart(),
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    const handleOrderSummary = () => {
        setShowOrderSummaryDetails(prevState => !prevState);
    };

    const handleConfirmOrder = async () => { 
        const result = await confirmOrder();
        if (result.success) {
            console.log("Sipariş başarıyla oluşturuldu:", result.message);
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode) {
            Alert.alert("Uyarı", "Lütfen bir kupon kodu girin.");
            return;
        }
        await applyCoupon(couponCode);
    };

    const handleRemoveCoupon = async () => {
        await removeCoupon();
        setCouponCode('');
    };

    const getFlatListPaddingBottom = () => {
        const baseHeight = 60; 
        const detailedSummaryHeight = 150; 
        const couponSectionHeight = 100; // Kupon alanı için tahmini yükseklik

        // Eğer özet detayları gösteriliyorsa, kupon alanı da görünür olacağı için ek yükseklik
        return showOrderSummaryDetails ? baseHeight + detailedSummaryHeight + couponSectionHeight + 20 : baseHeight + 20; 
    };


    const renderCartContent = () => (
        <>
            <View style={styles.headerContainer}>
                <Text style={styles.pageTitle}>Sepetim</Text>
                <TouchableOpacity onPress={handleClearCart} style={styles.clearCartIcon}>
                    <Ionicons name="trash-outline" size={24} color="gray" /> 
                </TouchableOpacity>
            </View>
            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.productId}
                renderItem={({ item }) => (
                    <CartItemCard
                        item={item}
                        onRemove={removeFromCart}
                        onQuantityChange={handleQuantityChange}
                    />
                )}
                contentContainerStyle={[styles.cartListContainer, { paddingBottom: getFlatListPaddingBottom() }]} 
            />
            <View style={styles.bottomFixedContainer}> 
                {showOrderSummaryDetails && (
                    <View style={styles.detailedSummaryBox}>
                        <View style={styles.couponInputContainer}>
                            {appliedCouponCode ? (
                                <View style={styles.appliedCouponBox}>
                                    <Text style={styles.appliedCouponText}>Uygulanan Kupon: {appliedCouponCode}</Text>
                                    <TouchableOpacity onPress={handleRemoveCoupon} style={styles.removeCouponButton}>
                                        <Ionicons name="close-circle" size={20} color="#FF3B30" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <>
                                    <TextInput
                                        style={styles.couponTextInput}
                                        placeholder="Kupon Kodu Girin"
                                        value={couponCode}
                                        onChangeText={setCouponCode}
                                        autoCapitalize="characters"
                                    />
                                    <CustomButton
                                        title="Uygula"
                                        onPress={handleApplyCoupon}
                                        style={styles.applyCouponButton}
                                        textStyle={styles.applyCouponButtonText}
                                    />
                                </>
                            )}
                        </View>
                        {/* Özet Detayları */}
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Ara Toplam:</Text>
                            <Text style={styles.summaryValue}>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(parseFloat(totalPrice.replace(/[^\d.,]/g, '').replace(',', '.')) + parseFloat(discountAmount.replace(/[^\d.,]/g, '').replace(',', '.')))}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Kargo Ücreti:</Text>
                            <Text style={styles.summaryValue}>Ücretsiz</Text> 
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>İndirim:</Text>
                            <Text style={styles.summaryValue}>- {discountAmount}</Text> 
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalText}>Toplam:</Text>
                            <Text style={styles.totalValue}>{totalPrice}</Text>
                        </View>
                    </View>
                )}

                <View style={styles.bottomButtonsRow}>
                    <TouchableOpacity style={styles.orderSummaryButton} onPress={handleOrderSummary}>
                        <Ionicons 
                            name={showOrderSummaryDetails ? "chevron-down-outline" : "chevron-up-outline"} 
                            size={18} 
                            color="#8B4513" 
                        />
                        <Text style={styles.orderSummaryText}>Sipariş Özeti</Text>
                    </TouchableOpacity>
                    <CustomButton
                        title={isLoadingCart ? "" : "Sepeti Onayla"} 
                        onPress={handleConfirmOrder}
                        style={styles.confirmCartButton}
                        disabled={isLoadingCart}
                    >
                        {isLoadingCart && <ActivityIndicator color="#fff" />}
                    </CustomButton>
                </View>
            </View>
        </>
    );

    if (!authenticated) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.guestContainer}>
                    <Ionicons name="cart-outline" size={80} color="#ccc" />
                    <Text style={styles.guestTitle}>Sepetiniz görüntülenemiyor</Text>
                    <Text style={styles.guestSubtitle}>Sepetinizi kullanmak ve alışverişinize devam etmek için giriş yapın.</Text>
                    <CustomButton
                        title="Giriş Yap / Kayıt Ol"
                        onPress={handleLoginRedirect}
                        style={styles.loginButton}
                    />
                </View>
            </SafeAreaView>
        );
    }

    if (isLoadingCart) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerContainer}>
                    <Text style={styles.pageTitle}>Sepetim</Text>
                </View>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#8B4513" />
                    <Text>Sepetiniz Yükleniyor...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (cartItems.length === 0) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerContainer}>
                    <Text style={styles.pageTitle}>Sepetim</Text>
                </View>
                <View style={styles.container}>
                    <Ionicons name="cart-outline" size={80} color="#ccc" />
                    <Text style={styles.title}>Sepetiniz Boş</Text>
                    <Text style={styles.subtitle}>Beğendiğiniz ürünleri sepete ekleyerek alışverişe başlayın.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {renderCartContent()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        textAlign: 'center',
        paddingLeft: 24,
    },
    clearCartIcon: {
        padding: 5,
    },
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
        color: '#333',
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
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    cartListContainer: { paddingHorizontal: 10, paddingTop: 10, paddingBottom: 0 }, 
    cartItemContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    cartItemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 10,
        resizeMode: 'cover',
    },
    cartItemDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    cartItemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    cartItemPrice: {
        fontSize: 14,
        color: '#008000',
        marginTop: 5,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    cartItemQuantity: {
        fontSize: 16,
        marginHorizontal: 10,
        fontWeight: 'bold',
    },
    removeButton: {
        padding: 5,
    },
    cartItemLoading: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 10,
    },
    bottomFixedContainer: { 
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        overflow: 'hidden', 
    },
    detailedSummaryBox: { 
        backgroundColor: 'white',
        padding: 15, 
        paddingBottom: 5, 
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#555',
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#008000',
    },
    bottomButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15, 
        paddingVertical: 10, 
    },
    orderSummaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5EFE6', 
        borderRadius: 10,
        paddingVertical: 8, 
        paddingHorizontal: 12, 
        marginRight: 8, 
        height: 45, 
        flex: 1, 
        justifyContent: 'center', 
    },
    orderSummaryText: {
        fontSize: 15, 
        fontWeight: 'bold',
        color: '#8B4513', 
        marginLeft: 5,
    },
    confirmCartButton: {
        flex: 2, 
        backgroundColor: '#8B4513', 
        borderRadius: 10,
        height: 45, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Kupon giriş alanı için yeni stiller
    couponInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15, // Detaylı özet ile butonlar arasına boşluk
        paddingHorizontal: 15, // İç padding
    },
    couponTextInput: {
        flex: 1,
        height: 45,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#333',
        marginRight: 10,
    },
    applyCouponButton: {
        backgroundColor: '#8B4513',
        borderRadius: 10,
        height: 45,
        width: 100, // Sabit genişlik
        justifyContent: 'center',
        alignItems: 'center',
    },
    applyCouponButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    appliedCouponBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e6ffe6', // Açık yeşil arka plan
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        flex: 1,
        justifyContent: 'space-between',
    },
    appliedCouponText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#28a745',
    },
    removeCouponButton: {
        padding: 5,
    },
});

export default CartScreen;
