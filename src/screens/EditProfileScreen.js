import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { USER } from '../data/products';
import { CustomButton } from '../components';

const InfoRow = ({ label, value, icon, editable = true }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <View style={styles.infoValueContainer}>
            <TextInput 
                style={styles.infoInput} 
                defaultValue={value} 
                editable={editable}
            />
            <Ionicons name={icon} size={22} color="#ccc" />
        </View>
    </View>
);

const EditProfileScreen = ({ navigation }) => {

    const handleSave = () => {
        Alert.alert("Başarılı", "Profil bilgileriniz güncellendi.");
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: USER.profileImage }} style={styles.avatar} />
                    <TouchableOpacity style={styles.editAvatarButton}>
                        <Ionicons name="add" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                
                <InfoRow label="Ad Soyad" value={USER.name} icon="pencil-outline" />
                <InfoRow label="E-posta" value={USER.email} icon="mail-outline" editable={false} />
                <InfoRow label="Telefon Numarası" value="+90 555 123 4567" icon="call-outline" />
                <InfoRow label="Adres" value="Folka Sanat Sokağı, No:12" icon="location-outline" />
                
                <View style={styles.buttonContainer}>
                    <CustomButton 
                        title="Vazgeç" 
                        onPress={() => navigation.goBack()}
                        style={styles.discardButton}
                        textStyle={styles.discardButtonText}
                    />
                    <CustomButton 
                        title="Kaydet" 
                        onPress={handleSave}
                        style={styles.saveButton}
                    />
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
