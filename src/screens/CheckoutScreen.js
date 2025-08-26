import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useAddress } from '../context/AddressContext';
import { CustomButton } from '../components';

const CheckoutScreen = ({ navigation }) => {
    const { user, authenticated, logout } = useAuth();
    const { cartItems, totalPrice, discountAmount, appliedCouponCode, isLoadingCart, confirmOrder } = useCart();
    const { userAddresses, isLoadingAddresses, addAddress, updateAddress, deleteAddress } = useAddress();

    const initialAddress = userAddresses.find(addr => addr.isDefault) || userAddresses[0];
    const [selectedAddress, setSelectedAddress] = useState(initialAddress || null);
    const [contactPhoneNumber, setContactPhoneNumber] = useState(user?.phoneNumber || '');
    const [paymentMethod, setPaymentMethod] = useState('CashOnDelivery');

    const [isProcessingOrder, setIsProcessingOrder] = useState(false);
    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
    const phoneInputRef = useRef(null); 
    useEffect(() => {
        if (selectedAddress) {
            // setDeliveryAddress(selectedAddress.fullAddress);
        } else if (userAddresses.length > 0) {
            setSelectedAddress(userAddresses.find(addr => addr.isDefault) || userAddresses[0]);
        }
    }, [selectedAddress, userAddresses]);

        useEffect(() => {
        if (user?.phoneNumber) {
            setContactPhoneNumber(user.phoneNumber);
        }
    }, [user?.phoneNumber]);


    const formattedSubtotal = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(
        parseFloat(totalPrice.replace(/[^\d.,]/g, '').replace(',', '.')) +
        parseFloat(discountAmount.replace(/[^\d.,]/g, '').replace(',', '.'))
    );
    const formattedDiscount = discountAmount;
    const formattedTotalPrice = totalPrice;

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            Alert.alert("Eksik Bilgi", "Lütfen bir teslimat adresi seçin.");
            return;
        }
        if (!contactPhoneNumber) {
            Alert.alert("Eksik Bilgi", "Lütfen telefon numarasını girin.");
            return;
        }
        if (cartItems.length === 0) {
            Alert.alert("Uyarı", "Sepetiniz boş, sipariş oluşturulamaz.");
            return;
        }

        setIsProcessingOrder(true);

        const orderData = {
            appliedCouponCode: appliedCouponCode,
            deliveryAddress: selectedAddress.fullAddress,
            contactPhoneNumber: contactPhoneNumber,
            paymentMethod: paymentMethod
        };

        console.log("Frontend'den gönderilen orderData:", orderData);

        const result = await confirmOrder(orderData);

        if (result.success) {
            Alert.alert("Siparişiniz Alındı!", "Siparişiniz başarıyla oluşturuldu.");
            navigation.navigate('MainTabs', { screen: 'Home', params: { screen: 'HomeMain' } });
        } else {
            Alert.alert("Sipariş Hatası", result.message || "Siparişiniz oluşturulurken bir sorun oluştu.");
        }
        setIsProcessingOrder(false);
    };

        const handleEditPhoneNumber = () => {
        phoneInputRef.current?.focus();
    };

    if (!authenticated) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.guestContainer}>
                    <Ionicons name="person-circle-outline" size={80} color="#ccc" />
                    <Text style={styles.guestTitle}>Giriş Yapmanız Gerekiyor</Text>
                    <Text style={styles.guestSubtitle}>Sipariş vermek için lütfen giriş yapın veya kayıt olun.</Text>
                    <CustomButton
                        title="Giriş Yap / Kayıt Ol"
                        onPress={() => logout()}
                        style={styles.loginButton}
                    />
                </View>
            </SafeAreaView>
        );
    }

    if (isLoadingAddresses || isLoadingCart) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#8B4513" />
                    <Text>Bilgileriniz Yükleniyor...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.sectionTitle}>Teslimat Bilgileri</Text>
                <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={24} color="#8B4513" style={styles.infoIcon} />
                    {selectedAddress ? (
                        <View style={styles.selectedAddressDisplay}>
                            <Text style={styles.selectedAddressTitle}>{selectedAddress.addressTitle}</Text>
                            <Text style={styles.selectedAddressText}>{selectedAddress.fullAddress}</Text>
                        </View>
                    ) : (
                        <Text style={styles.infoTextInput}>Lütfen bir adres seçin</Text>
                    )}
                    <TouchableOpacity onPress={() => setIsAddressModalVisible(true)}>
                        <Ionicons name="pencil-outline" size={20} color="gray" />
                    </TouchableOpacity>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={24} color="#8B4513" style={styles.infoIcon} />
                    <TextInput
                        ref={phoneInputRef}
                        style={styles.infoTextInput}
                        placeholder="Telefon Numarası"
                        value={contactPhoneNumber}
                        onChangeText={setContactPhoneNumber}
                        keyboardType="phone-pad"
                        editable={true}
                    />
                    <TouchableOpacity onPress={handleEditPhoneNumber}>                         
                        <Ionicons name="pencil-outline" size={20} color="gray" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Sipariş Özeti</Text>
                <View style={styles.summaryBox}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Ara Toplam:</Text>
                        <Text style={styles.summaryValue}>{formattedSubtotal}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Kargo Ücreti:</Text>
                        <Text style={styles.summaryValue}>Ücretsiz</Text>
                    </View>
                    {parseFloat(discountAmount.replace(/[^\d.,]/g, '').replace(',', '.')) > 0 && (
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>İndirim:</Text>
                            <Text style={styles.summaryValue}>- {formattedDiscount}</Text>
                        </View>
                    )}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalText}>Toplam:</Text>
                        <Text style={styles.totalValue}>{formattedTotalPrice}</Text>
                    </View>
                </View>

                <View style={styles.deliveryTimeContainer}>
                    <Ionicons name="time-outline" size={20} color="#8B4513" />
                    <Text style={styles.deliveryTimeText}>Tahmini Teslimat: 3-4 iş günü</Text>
                </View>

                <Text style={styles.sectionTitle}>Ödeme Yöntemi</Text>
                <View style={styles.paymentMethodContainer}>
                    <TouchableOpacity
                        style={[styles.paymentOption, paymentMethod === 'BankCard' && styles.selectedPaymentOption]}
                        onPress={() => setPaymentMethod('BankCard')}
                    >
                        <Ionicons name={paymentMethod === 'BankCard' ? "radio-button-on" : "radio-button-off"} size={24} color="#8B4513" />
                        <Text style={styles.paymentOptionText}>Banka / Kredi Kartı</Text>
                        <Ionicons name="card-outline" size={24} color="gray" style={{ marginLeft: 'auto' }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.paymentOption, paymentMethod === 'CashOnDelivery' && styles.selectedPaymentOption]}
                        onPress={() => setPaymentMethod('CashOnDelivery')}
                    >
                        <Ionicons name={paymentMethod === 'CashOnDelivery' ? "radio-button-on" : "radio-button-off"} size={24} color="#8B4513" />
                        <Text style={styles.paymentOptionText}>Kapıda Ödeme</Text>
                        <Ionicons name="wallet-outline" size={24} color="gray" style={{ marginLeft: 'auto' }} />
                    </TouchableOpacity>
                    {paymentMethod === 'BankCard' && (
                        <View style={styles.cardDetailsContainer}>
                            <Text style={styles.cardDetailsText}>**** **** **** 8765</Text>
                            <Text style={styles.cardDetailsSubText}>John David Mark - 08/25</Text>
                            <TouchableOpacity style={styles.addCardButton}>
                                <Ionicons name="add-circle-outline" size={20} color="#8B4513" />
                                <Text style={styles.addCardButtonText}>Yeni Kart Ekle</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
            <View style={styles.bottomPlaceOrderContainer}>
                <CustomButton
                    title={isProcessingOrder ? "" : "Siparişi Ver"}
                    onPress={handlePlaceOrder}
                    style={styles.placeOrderButton}
                    disabled={isProcessingOrder || isLoadingCart}
                >
                    {isProcessingOrder && <ActivityIndicator color="#fff" />}
                </CustomButton>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isAddressModalVisible}
                onRequestClose={() => setIsAddressModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity 
                            style={styles.closeIconContainer}
                            onPress={() => setIsAddressModalVisible(false)}
                        >
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Adres Seçin</Text>
                        <FlatList
                            data={userAddresses}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.modalAddressOption,
                                        selectedAddress?.id === item.id && styles.selectedModalAddressOption
                                    ]}
                                    onPress={() => {
                                        setSelectedAddress(item);
                                        setIsAddressModalVisible(false);
                                    }}
                                >
                                    <Ionicons
                                        name={selectedAddress?.id === item.id ? "radio-button-on" : "radio-button-off"}
                                        size={24}
                                        color="#8B4513"
                                        style={{ marginRight: 10 }}
                                    />
                                    <View>
                                        <Text style={styles.modalAddressTitle}>{item.addressTitle}</Text>
                                        <Text style={styles.modalAddressText}>{item.fullAddress}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={() => (
                                <View style={styles.modalEmptyAddress}>
                                    <Text style={styles.modalEmptyAddressText}>Kayıtlı adresiniz yok.</Text>
                                </View>
                            )}
                            ListFooterComponent={() => (
                                <CustomButton
                                    title="Yeni Adres Ekle"
                                    onPress={() => {
                                        setIsAddressModalVisible(false);
                                        navigation.navigate('AddressManagement');
                                    }}
                                    style={styles.modalAddAddressButton}
                                    textStyle={styles.modalAddAddressButtonText}
                                />
                            )}
                        />
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
    container: { padding: 20, paddingBottom: 100 },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 15,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    infoIcon: {
        marginRight: 10,
    },
    infoTextInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    selectedAddressDisplay: {
        flex: 1,
    },
    selectedAddressTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    selectedAddressText: {
        fontSize: 14,
        color: '#555',
        marginTop: 2,
    },
    summaryBox: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
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
        color: '#8B4513',
    },
    deliveryTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5EFE6',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    deliveryTimeText: {
        marginLeft: 10,
        fontSize: 15,
        color: '#8B4513',
        fontWeight: 'bold',
    },
    paymentMethodContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        paddingVertical: 5,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    selectedPaymentOption: {
        backgroundColor: '#fffaf0',
    },
    paymentOptionText: {
        fontSize: 16,
        marginLeft: 10,
        color: '#333',
        flex: 1,
    },
    cardDetailsContainer: {
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    cardDetailsText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 5,
    },
    cardDetailsSubText: {
        fontSize: 13,
        color: 'gray',
        marginBottom: 10,
    },
    addCardButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#F5EFE6',
    },
    addCardButtonText: {
        marginLeft: 5,
        fontSize: 14,
        color: '#8B4513',
        fontWeight: 'bold',
    },
    bottomPlaceOrderContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 15,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    placeOrderButton: {
        width: '100%',
        height: 55,
        backgroundColor: '#8B4513',
        borderRadius: 10,
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
    // Modal stilleri
    closeIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    zIndex: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    modalAddressOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        width: '100%',
    },
    selectedModalAddressOption: {
        backgroundColor: '#f5f5f5',
    },
    modalAddressTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    modalAddressText: {
        fontSize: 14,
        color: '#555',
        marginTop: 2,
    },
    modalEmptyAddress: {
        padding: 20,
        alignItems: 'center',
    },
    modalEmptyAddressText: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 15,
    },
    modalAddAddressButton: {
    backgroundColor: '#8B4513',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 'auto', // butonu içeriğe göre küçültür
    minWidth: 150, // çok küçük olmasını engeller
    },
    modalCloseButton: {
        backgroundColor: '#ccc',
        marginTop: 20,
        width: '80%',
    },
    modalCloseButtonText: {
        color: '#333',
    },
});

export default CheckoutScreen;
