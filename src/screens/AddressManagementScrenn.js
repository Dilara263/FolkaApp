import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useAddress } from '../context/AddressContext'; 
import { CustomButton } from '../components';

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => (
    <View style={[styles.addressCard, address.isDefault && styles.defaultAddressCard]}>
        <View style={styles.addressCardHeader}>
            <Text style={styles.addressCardTitle}>{address.addressTitle}</Text>
            {address.isDefault && (
                <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Varsayılan</Text>
                </View>
            )}
        </View>
        <Text style={styles.addressCardFullAddress}>{address.fullAddress}</Text>
        {address.city && <Text style={styles.addressCardLocation}>{address.district}, {address.city}</Text>}
        {address.zipCode && <Text style={styles.addressCardLocation}>Posta Kodu: {address.zipCode}</Text>}
        <View style={styles.addressCardActions}>
            {!address.isDefault && (
                <TouchableOpacity onPress={() => onSetDefault(address.id)} style={styles.actionButton}>
                    <Ionicons name="star-outline" size={20} color="#8B4513" />
                    <Text style={styles.actionButtonText}>Varsayılan Yap</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => onEdit(address)} style={styles.actionButton}>
                <Ionicons name="create-outline" size={20} color="#8B4513" />
                <Text style={styles.actionButtonText}>Düzenle</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(address.id)} style={styles.actionButton}>
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                <Text style={styles.actionButtonText}>Sil</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const AddressManagementScreen = ({ navigation }) => {
    const { authenticated, logout } = useAuth();
    const { userAddresses, isLoadingAddresses, addAddress, updateAddress, deleteAddress } = useAddress();

    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false); 
    const [editingAddress, setEditingAddress] = useState(null); 

    const [addressTitle, setAddressTitle] = useState('');
    const [fullAddress, setFullAddress] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [isDefault, setIsDefault] = useState(false);

    useEffect(() => {
        if (editingAddress) {
            setAddressTitle(editingAddress.addressTitle);
            setFullAddress(editingAddress.fullAddress);
            setCity(editingAddress.city || '');
            setDistrict(editingAddress.district || '');
            setZipCode(editingAddress.zipCode || '');
            setIsDefault(editingAddress.isDefault);
        } else {
            setAddressTitle('');
            setFullAddress('');
            setCity('');
            setDistrict('');
            setZipCode('');
            setIsDefault(false);
        }
    }, [editingAddress]);

    const handleSaveAddress = async () => {
        if (!addressTitle || !fullAddress) {
            Alert.alert("Eksik Bilgi", "Adres başlığı ve tam adres zorunludur.");
            return;
        }

        const addressData = { addressTitle, fullAddress, city, district, zipCode, isDefault };
        let result;

        if (editingAddress) {
            result = await updateAddress(editingAddress.id, addressData);
        } else {
            result = await addAddress(addressData);
        }

        if (result.success) {
            setIsAddingNewAddress(false);
            setEditingAddress(null);
            setAddressTitle('');
            setFullAddress('');
            setCity('');
            setDistrict('');
            setZipCode('');
            setIsDefault(false);
        }
    };

    const handleDeleteAddress = (id) => {
        Alert.alert(
            "Adresi Sil",
            "Bu adresi silmek istediğinizden emin misiniz?",
            [
                { text: "Vazgeç", style: "cancel" },
                { text: "Sil", onPress: async () => await deleteAddress(id), style: "destructive" }
            ],
            { cancelable: true }
        );
    };

    const handleSetDefaultAddress = async (id) => {
        const addressToSetDefault = userAddresses.find(addr => addr.id === id);
        if (addressToSetDefault) {
            if (!addressToSetDefault.isDefault) {
                const result = await updateAddress(id, { ...addressToSetDefault, isDefault: true });
                if (result.success) {
                }
            }
        }
    };

    if (!authenticated) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.guestContainer}>
                    <Ionicons name="location-outline" size={80} color="#ccc" />
                    <Text style={styles.guestTitle}>Adresleriniz görüntülenemiyor</Text>
                    <Text style={styles.guestSubtitle}>Adreslerinizi yönetmek için lütfen giriş yapın.</Text>
                    <CustomButton
                        title="Giriş Yap / Kayıt Ol"
                        onPress={() => logout()}
                        style={styles.loginButton}
                    />
                </View>
            </SafeAreaView>
        );
    }

    if (isLoadingAddresses) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#8B4513" />
                    <Text>Adresleriniz Yükleniyor...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>

            {isAddingNewAddress || editingAddress ? (
                <ScrollView contentContainerStyle={styles.formContainer}>
                    <Text style={styles.formTitle}>{editingAddress ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Adres Başlığı (Ev, İş vb.)"
                        value={addressTitle}
                        onChangeText={setAddressTitle}
                    />
                    <TextInput
                        style={[styles.textInput, { height: 80, textAlignVertical: 'top' }]}
                        placeholder="Tam Adres (Sokak, Bina No, Daire No)"
                        value={fullAddress}
                        onChangeText={setFullAddress}
                        multiline={true}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Şehir"
                        value={city}
                        onChangeText={setCity}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder="İlçe"
                        value={district}
                        onChangeText={setDistrict}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Posta Kodu"
                        value={zipCode}
                        onChangeText={setZipCode}
                        keyboardType="numeric"
                    />
                    <TouchableOpacity style={styles.checkboxContainer} onPress={() => setIsDefault(!isDefault)}>
                        <Ionicons 
                            name={isDefault ? "checkbox-outline" : "square-outline"} 
                            size={24} 
                            color="#8B4513" 
                        />
                        <Text style={styles.checkboxLabel}>Varsayılan Adres Yap</Text>
                    </TouchableOpacity>
                    <View style={styles.formButtons}>
                        <CustomButton
                            title="Vazgeç"
                            onPress={() => { setIsAddingNewAddress(false); setEditingAddress(null); }}
                            style={styles.cancelButton}
                            textStyle={styles.cancelButtonText}
                        />
                        <CustomButton
                            title="Kaydet"
                            onPress={handleSaveAddress}
                            style={styles.saveButton}
                        />
                    </View>
                </ScrollView>
            ) : (
            <FlatList
                data={userAddresses}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <AddressCard
                        address={item}
                        onEdit={(addr) => { setEditingAddress(addr); setIsAddingNewAddress(true); }}
                        onDelete={handleDeleteAddress}
                        onSetDefault={handleSetDefaultAddress}
                    />
                )}
                contentContainerStyle={[
                    styles.listContainer,
                    userAddresses.length === 0 && { flex: 1, justifyContent: 'center' } // 👈 ortalama
                ]}
                ListEmptyComponent={() => (
                    <View style={styles.center}>
                        <Ionicons name="location-outline" size={80} color="#ccc" />
                        <Text style={styles.title}>Henüz Adresiniz Yok</Text>
                        <Text style={styles.subtitle}>Yeni adres eklemek için aşağıdaki butona tıklayın.</Text>
                    </View>
                )}
            />
            )}
            
            {!isAddingNewAddress && !editingAddress && (
                <View style={styles.bottomFixedAddButtonContainer}>
                    <CustomButton
                        title="Yeni Adres Ekle"
                        onPress={() => { setIsAddingNewAddress(true); setEditingAddress(null); }}
                        style={styles.addNewAddressButton}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
    center: {   flex: 1, 
  justifyContent: 'center', 
  alignItems: 'center', 
  paddingHorizontal: 20  },
    title: { fontSize: 22, fontWeight: 'bold', marginTop: 20, color: '#333', textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#666', marginTop: 10, textAlign: 'center' },
    listContainer: { paddingHorizontal: 10, paddingTop: 10, paddingBottom: 80 }, 
    
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
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },
    backButton: { 
        padding: 5,
        marginRight: 10,
    },
    addAddressButton: { 
        padding: 5,
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

    addressCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderLeftWidth: 5,
        borderColor: '#ccc',
    },
    defaultAddressCard: {
        borderColor: '#8B4513',
    },
    addressCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    addressCardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    defaultBadge: {
        backgroundColor: '#F5EFE6',
        borderRadius: 5,
        paddingVertical: 3,
        paddingHorizontal: 8,
    },
    defaultBadgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#8B4513',
    },
    addressCardFullAddress: {
        fontSize: 15,
        color: '#555',
        marginBottom: 5,
    },
    addressCardLocation: {
        fontSize: 13,
        color: 'gray',
    },
    addressCardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
    },
    actionButtonText: {
        marginLeft: 5,
        fontSize: 14,
        color: '#8B4513',
    },

    formContainer: {
        padding: 20,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    textInput: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkboxLabel: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    formButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: '#ccc',
        width: '48%',
    },
    cancelButtonText: {
        color: '#333',
    },
    saveButton: {
        backgroundColor: '#8B4513',
        width: '48%',
    },
    bottomFixedAddButtonContainer: {
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
    addNewAddressButton: {
        width: '100%',
        height: 55,
        backgroundColor: '#8B4513',
        borderRadius: 10,
    },
});

export default AddressManagementScreen;