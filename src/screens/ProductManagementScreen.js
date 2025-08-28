import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, Alert, TextInput, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import { CustomButton } from '../components';
import { useProducts } from '../context/ProductContext';

const ProductManagementCard = ({ product, onEdit, onDelete }) => (
    <View style={styles.cardContainer}>
        <Image source={{ uri: product.image }} style={styles.cardImage} />
        <View style={styles.cardDetails}>
            <Text style={styles.cardName}>{product.name}</Text>
            <Text style={styles.cardPrice}>{product.price}</Text>
            <Text style={styles.cardStock}>Stok: {product.stock}</Text>
            <Text style={styles.cardCategory}>Kategori: {product.category}</Text>
        </View>
        <View style={styles.cardActions}>
            <TouchableOpacity onPress={() => onEdit(product)} style={styles.actionButton}>
                <Ionicons name="create-outline" size={24} color="#8B4513" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(product.id)} style={styles.actionButton}>
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
            </TouchableOpacity>
        </View>
    </View>
);

const ProductManagementScreen = ({ navigation }) => {
    const { authenticated, user } = useAuth();
    const { products, isLoading, fetchProducts, addProduct, updateProduct, deleteProduct } = useProducts();

    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');

    useEffect(() => {
        fetchProducts(); 
    }, []);

    const setFormState = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
            setImage(product.image);
            setCategory(product.category);
            setStock(product.stock.toString());
        } else {
            setEditingProduct(null);
            setName('');
            setPrice('');
            setDescription('');
            setImage('');
            setCategory('');
            setStock('');
        }
        setIsAddingNew(true);
    };

    const handleSaveProduct = async () => {
        if (!name || !price || !description || !stock) {
            Alert.alert("Eksik Bilgi", "Lütfen tüm zorunlu alanları doldurun.");
            return;
        }
        
        const productData = { 
            id: editingProduct ? editingProduct.id : undefined,
            name, 
            price, 
            description, 
            image, 
            category, 
            stock: parseInt(stock) 
        };

        let result;
        if (editingProduct) {
            result = await updateProduct(editingProduct.id, productData);
        } else {
            result = await addProduct(productData);
        }

        if (result.success) {
            setIsAddingNew(false);
            setEditingProduct(null);
        }
    };

    const handleDeleteProduct = async (productId) => {
        Alert.alert(
            "Ürünü Sil",
            "Bu ürünü silmek istediğinizden emin misiniz?",
            [
                { text: "Vazgeç", style: "cancel" },
                { text: "Sil", onPress: async () => {
                    await deleteProduct(productId);
                }, style: "destructive" }
            ],
            { cancelable: true }
        );
    };
    
    if (!authenticated || user?.role !== "Admin") {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.center}>
                    <Ionicons name="alert-circle-outline" size={80} color="#FF3B30" />
                    <Text style={styles.title}>Erişim Reddedildi</Text>
                    <Text style={styles.subtitle}>Bu sayfayı görüntülemek için yönetici yetkisine sahip olmalısınız.</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#8B4513" />
                    <Text>Ürünler Yükleniyor...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (isAddingNew || editingProduct) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.formHeader}>
                    <TouchableOpacity onPress={() => { setIsAddingNew(false); setEditingProduct(null); }} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.formTitle}>{editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</Text>
                    <View style={{width: 24}} />
                </View>
                <ScrollView contentContainerStyle={styles.formContainer}>
                    <Text style={styles.inputLabel}>Ürün Adı</Text>
                    <TextInput style={styles.textInput} placeholder="Ürün Adı" value={name} onChangeText={setName} />
                    
                    <Text style={styles.inputLabel}>Fiyat</Text>
                    <TextInput style={styles.textInput} placeholder="Fiyat" value={price} onChangeText={setPrice} keyboardType="numeric" />
                    
                    <Text style={styles.inputLabel}>Açıklama</Text>
                    <TextInput style={styles.textInput} placeholder="Açıklama" value={description} onChangeText={setDescription} multiline />
                    
                    <Text style={styles.inputLabel}>Görsel URL'si</Text>
                    <TextInput style={styles.textInput} placeholder="Görsel URL'si" value={image} onChangeText={setImage} />
                    
                    <Text style={styles.inputLabel}>Kategori</Text>
                    <TextInput style={styles.textInput} placeholder="Kategori" value={category} onChangeText={setCategory} />
                    
                    <Text style={styles.inputLabel}>Stok</Text>
                    <TextInput style={styles.textInput} placeholder="Stok" value={stock} onChangeText={setStock} keyboardType="numeric" />
                    
                    <View style={styles.formButtons}>
                        <CustomButton title="Vazgeç" onPress={() => { setIsAddingNew(false); setEditingProduct(null); }} style={styles.cancelButton} textStyle={styles.cancelButtonText} />
                        <CustomButton title="Kaydet" onPress={handleSaveProduct} style={styles.saveButton} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ürün Yönetimi</Text>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => setIsSearchVisible(!isSearchVisible)} style={styles.headerSearchButton}>
                         <Ionicons name="search-outline" size={28} color="#8B4513" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setFormState()} style={styles.headerAddButton}>
                        <Ionicons name="add-circle-outline" size={28} color="#8B4513" />
                    </TouchableOpacity>
                </View>
            </View>
            {isSearchVisible && (
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
            {filteredProducts.length === 0 && searchTerm === '' ? (
                <View style={styles.center}>
                    <Text style={styles.title}>Henüz ürün bulunmamaktadır.</Text>
                    <Text style={styles.subtitle}>Yeni ürün eklemek için sağ üstteki '+' butonunu kullanın.</Text>
                </View>
            ) : filteredProducts.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.title}>Aramanızla eşleşen ürün bulunamadı.</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <ProductManagementCard product={item} onEdit={() => setFormState(item)} onDelete={handleDeleteProduct} />
                    )}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 22, fontWeight: 'bold', marginTop: 20, color: '#333' },
    subtitle: { fontSize: 16, color: '#666', marginTop: 10, textAlign: 'center' },
    
    headerContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 15, 
        backgroundColor: 'white', 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee' 
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
    headerAddButton: {
        padding: 5,
        marginLeft: 10,
    },
    headerSearchButton: {
        padding: 5,
    },
    searchContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    searchInput: {
        height: 40,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    
    addFirstProductButton: { marginTop: 20 },
    listContainer: { padding: 10 },
    
    formHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    formTitle: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        color: '#333', 
        flex: 1,
        textAlign: 'center' 
    },
    formContainer: { padding: 20, paddingBottom: 100 },
    inputLabel: {
        fontSize: 16,
        color: '#555',
        marginTop: 10,
        marginBottom: 5,
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
    formButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    cancelButton: { backgroundColor: '#ccc', width: '48%' },
    cancelButtonText: { color: '#333' },
    saveButton: { backgroundColor: '#8B4513', width: '48%' },
    
    cardContainer: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 10, padding: 15, marginBottom: 10, elevation: 2 },
    cardImage: { width: 80, height: 80, borderRadius: 8, marginRight: 15, resizeMode: 'cover' },
    cardDetails: { flex: 1, justifyContent: 'center' },
    cardName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    cardPrice: { fontSize: 14, color: 'gray', marginTop: 5 },
    cardStock: { fontSize: 14, color: 'darkred' },
    cardCategory: { fontSize: 12, color: 'gray' },
    cardActions: { flexDirection: 'row', alignItems: 'center' },
    actionButton: { marginLeft: 10 },

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

export default ProductManagementScreen;
