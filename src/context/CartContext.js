import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from './AuthContext';
import { Alert } from 'react-native';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const { authenticated, token } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isLoadingCart, setIsLoadingCart] = useState(true);

    const parseErrorResponse = async (response) => {
        let errorData;
        try {
            errorData = await response.json();
        } catch (jsonError) {
            const rawText = await response.text();
            errorData = { message: rawText || 'Bilinmeyen bir hata oluştu.' };
        }
        return errorData.message || 'Bilinmeyen bir hata oluştu.';
    };

    useEffect(() => {
        const loadCart = async () => {
            if (!authenticated) {
                setCartItems([]);
                setTotalPrice(0);
                setIsLoadingCart(false);
                return;
            }

            try {
                const response = await fetch(API_ENDPOINTS.CART, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorMessage = await parseErrorResponse(response);
                    throw new Error(errorMessage);
                }

                const data = await response.json();
                setCartItems(data.cartItems || []);
                setTotalPrice(data.totalPrice || 0);

            } catch (error) {
                console.error("Sepet yüklenirken hata oluştu:", error);
                Alert.alert("Hata", error.message || "Sepet yüklenirken bir sorun oluştu.");
                setCartItems([]);
                setTotalPrice(0);
            } finally {
                setIsLoadingCart(false);
            }
        };

        loadCart();
    }, [authenticated, token]);

    const addToCart = async (productId, quantity = 1) => {
        if (!authenticated) {
            Alert.alert("Giriş Gerekli", "Sepete ürün eklemek için lütfen giriş yapın.");
            return { success: false, message: "Giriş yapmalısınız." };
        }

        const originalCartItems = [...cartItems];
        const originalTotalPrice = totalPrice;

        const existingItemIndex = cartItems.findIndex(item => item.productId === productId);
        let newCartItems;
        if (existingItemIndex > -1) {
            newCartItems = [...cartItems];
            newCartItems[existingItemIndex] = {
                ...newCartItems[existingItemIndex],
                quantity: newCartItems[existingItemIndex].quantity + quantity
            };
        } else {
            newCartItems = [...cartItems, { productId: productId, quantity: quantity }];
        }
        setCartItems(newCartItems);

        setIsLoadingCart(true);
        try {
            const response = await fetch(API_ENDPOINTS.ADD_TO_CART, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId: productId, quantity: quantity }),
            });

            if (!response.ok) {
                const errorMessage = await parseErrorResponse(response);
                // Hata durumunda rollback
                setCartItems(originalCartItems);
                setTotalPrice(originalTotalPrice);
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setCartItems(data.cartItems || []);
            setTotalPrice(data.totalPrice || 0);
            return { success: true, message: 'Ürün sepete eklendi!' };
        } catch (error) {
            console.warn("Sepete ekleme uyarısı:", error.message);
            Alert.alert("Hata", error.message || "Ürün sepete eklenirken bir sorun oluştu.");
            return { success: false, message: error.message || 'Sepete eklenirken bir hata oluştu.' };
        } finally {
            setIsLoadingCart(false);
        }
    };

    const updateCartItemQuantity = async (productId, newQuantity) => {
        if (!authenticated) {
            Alert.alert("Giriş Gerekli", "Sepet miktarını güncellemek için lütfen giriş yapın.");
            return { success: false, message: "Giriş yapmalısınız." };
        }

        const originalCartItems = [...cartItems];
        const originalTotalPrice = totalPrice;

        let newCartItems;
        if (newQuantity <= 0) {
            newCartItems = cartItems.filter(item => item.productId !== productId);
        } else {
            newCartItems = cartItems.map(item =>
                item.productId === productId ? { ...item, quantity: newQuantity } : item
            );
        }
        setCartItems(newCartItems);

        setIsLoadingCart(true);
        try {
            const response = await fetch(API_ENDPOINTS.UPDATE_CART_ITEM_QUANTITY, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId: productId, quantity: newQuantity }),
            });

            if (!response.ok) {
                const errorMessage = await parseErrorResponse(response);
                setCartItems(originalCartItems);
                setTotalPrice(originalTotalPrice);
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setCartItems(data.cartItems || []);
            setTotalPrice(data.totalPrice || 0);
            return { success: true, message: 'Sepet miktarı güncellendi!' };
        } catch (error) {
            console.warn("Sepet miktar güncelleme uyarısı:", error.message);
            Alert.alert("Hata", error.message || "Sepet miktarı güncellenirken bir sorun oluştu.");
            return { success: false, message: error.message || 'Sepet miktarı güncellenirken bir hata oluştu.' };
        } finally {
            setIsLoadingCart(false);
        }
    };

    const removeFromCart = async (productId) => {
        if (!authenticated) {
            Alert.alert("Giriş Gerekli", "Sepetten ürün çıkarmak için lütfen giriş yapın.");
            return { success: false, message: "Giriş yapmalısınız." };
        }

        const originalCartItems = [...cartItems];
        const originalTotalPrice = totalPrice;

        const newCartItems = cartItems.filter(item => item.productId !== productId);
        setCartItems(newCartItems);

        setIsLoadingCart(true);
        try {
            const response = await fetch(`${API_ENDPOINTS.REMOVE_FROM_CART}/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorMessage = await parseErrorResponse(response);
                setCartItems(originalCartItems);
                setTotalPrice(originalTotalPrice);
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setCartItems(data.cartItems || []);
            setTotalPrice(data.totalPrice || 0);
            return { success: true, message: 'Ürün sepetten çıkarıldı.' };
        } catch (error) {
            console.warn("Sepetten çıkarma uyarısı:", error.message);
            Alert.alert("Hata", error.message || "Sepetten çıkarılırken bir sorun oluştu.");
            return { success: false, message: error.message || 'Sepetten çıkarılırken bir hata oluştu.' };
        } finally {
            setIsLoadingCart(false);
        }
    };

    const clearCart = async () => {
        if (!authenticated) {
            Alert.alert("Giriş Gerekli", "Sepeti temizlemek için lütfen giriş yapın.");
            return { success: false, message: "Giriş yapmalısınız." };
        }

        const originalCartItems = [...cartItems];
        const originalTotalPrice = totalPrice;

        setCartItems([]);
        setTotalPrice(0);

        setIsLoadingCart(true);
        try {
            const response = await fetch(API_ENDPOINTS.CLEAR_CART, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorMessage = await parseErrorResponse(response);
                setCartItems(originalCartItems);
                setTotalPrice(originalTotalPrice);
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setCartItems(data.cartItems || []);
            setTotalPrice(data.totalPrice || 0);
            return { success: true, message: 'Sepet temizlendi.' };
        } catch (error) {
            console.warn("Sepet temizleme uyarısı:", error.message);
            Alert.alert("Hata", error.message || "Sepet temizlenirken bir sorun oluştu.");
            return { success: false, message: error.message || 'Sepet temizlenirken bir hata oluştu.' };
        } finally {
            setIsLoadingCart(false);
        }
    };

    const confirmOrder = async () => {
        if (!authenticated) {
            Alert.alert("Giriş Gerekli", "Sipariş oluşturmak için lütfen giriş yapın.");
            return { success: false, message: "Giriş yapmalısınız." };
        }
        if (cartItems.length === 0) {
            Alert.alert("Uyarı", "Sepetiniz boş, sipariş oluşturulamaz.");
            return { success: false, message: "Sepet boş." };
        }

        setIsLoadingCart(true);
        try {
            const response = await fetch(API_ENDPOINTS.ORDERS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({})
            });

            if (!response.ok) {
                const errorMessage = await parseErrorResponse(response);
                throw new Error(errorMessage);
            }

            const data = await response.json();
            
            setCartItems([]);
            setTotalPrice(0);
            
            Alert.alert("Sipariş Onaylandı", data.message || "Siparişiniz başarıyla oluşturuldu!");
            return { success: true, message: data.message || 'Sipariş başarıyla oluşturuldu!' };

        } catch (error) {
            console.error("Sipariş oluşturma hatası:", error);
            Alert.alert("Hata", error.message || "Sipariş oluşturulurken bir sorun oluştu.");
            return { success: false, message: error.message || 'Sipariş oluşturulurken bir hata oluştu.' };
        } finally {
            setIsLoadingCart(false);
        }
    };

    const formattedTotalPrice = useMemo(() => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totalPrice);
    }, [totalPrice]);

    const value = {
        cartItems,
        isLoadingCart,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItemQuantity,
        totalPrice: formattedTotalPrice,
        confirmOrder,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};