import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import { USER } from '../data/products'; // Artık statik USER'ı kullanmıyoruz
import { CustomButton } from '../components';
import { useAuth } from '../context/AuthContext';

const InfoRow = ({ label, value, icon, onChangeText, keyboardType, editable = true }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <View style={styles.infoValueContainer}>
            <TextInput 
                style={styles.infoInput} 
                value={value}
                onChangeText={onChangeText}
                editable={editable}
                keyboardType={keyboardType}
            />
            <Ionicons name={icon} size={22} color="#ccc" />
        </View>
    </View>
);

const EditProfileScreen = ({ navigation }) => {
    const { user, updateProfile, isLoading } = useAuth();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [address, setAddress] = useState(user?.address || '');

    const handleSave = async () => {
        if (!name || !email) {
            Alert.alert("Hata", "Ad ve e-posta alanları boş bırakılamaz.");
            return;
        }

        const result = await updateProfile(name, email, phoneNumber, address);

        if (result.success) {
            Alert.alert("Başarılı", result.message);
            navigation.goBack();
        } else {
            Alert.alert("Hata", result.message);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.avatarContainer}>
                    <Image 
                        source={{ uri: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop' }} // Şimdilik sabit bir resim
                        style={styles.avatar} 
                    />
                    <TouchableOpacity style={styles.editAvatarButton}>
                        <Ionicons name="add" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                
                <InfoRow 
                    label="Ad Soyad" 
                    value={name} 
                    onChangeText={setName} 
                    icon="pencil-outline" 
                    editable={!isLoading}
                />
                <InfoRow 
                    label="E-posta" 
                    value={email} 
                    onChangeText={setEmail}
                    icon="mail-outline" 
                    keyboardType="email-address"
                    editable={!isLoading}
                />
                <InfoRow 
                    label="Telefon Numarası" 
                    value={phoneNumber} 
                    onChangeText={setPhoneNumber} 
                    icon="call-outline" 
                    keyboardType="phone-pad"
                    editable={!isLoading}
                />
                <InfoRow 
                    label="Adres" 
                    value={address} 
                    onChangeText={setAddress} 
                    icon="location-outline" 
                    editable={!isLoading}
                />
                
                <View style={styles.buttonContainer}>
                    <CustomButton 
                        title="Vazgeç" 
                        onPress={() => navigation.goBack()}
                        style={styles.discardButton}
                        textStyle={styles.discardButtonText}
                        disabled={isLoading}
                    />
                    <CustomButton 
                        title={isLoading ? "" : "Kaydet"}
                        onPress={handleSave}
                        style={styles.saveButton}
                        disabled={isLoading}
                    >
                        {isLoading && <ActivityIndicator color="#fff" />}
                    </CustomButton>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: 'white' },
    container: { padding: 20 },
    avatarContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: '35%',
        backgroundColor: '#8B4513',
        borderRadius: 15,
        padding: 4,
        borderWidth: 2,
        borderColor: 'white',
    },
    infoRow: {
        marginBottom: 20,
    },
    infoLabel: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 5,
    },
    infoValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    infoInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40,
    },
    discardButton: {
        backgroundColor: '#f0f0f0',
        width: '48%',
    },
    discardButtonText: {
        color: '#555',
    },
    saveButton: {
        backgroundColor: '#8B4513',
        width: '48%',
    },
});

export default EditProfileScreen;
