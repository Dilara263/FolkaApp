import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from './AuthContext';
import { Alert } from 'react-native';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { authenticated, token } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [appliedCouponCode, setAppliedCouponCode] = useState(null);
    const [isLoadingCart, setIsLoadingCart] = useState(true);

    const parseErrorResponse = async (response) => {
        try {
            const errorData = await response.json();
            return errorData.message || 'Bilinmeyen bir hata oluştu.';
        } catch {
            const rawText = await response.text();
            return rawText || 'Bilinmeyen bir hata oluştu.';
        }
    };

    const requireAuth = () => {
        if (!authenticated) {
            Alert.alert("Giriş Gerekli", "Lütfen giriş yapın.");
            return false;
        }
        return true;
    };

    const saveStateForRollback = () => ({
        cartItems: [...cartItems],
        totalPrice,
        discountAmount,
        appliedCouponCode
    });

    const rollbackState = (state) => {
        setCartItems(state.cartItems);
        setTotalPrice(state.totalPrice);
        setDiscountAmount(state.discountAmount);
        setAppliedCouponCode(state.appliedCouponCode);
    };

    const apiRequest = async (url, options = {}, rollback = null) => {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    ...(options.headers || {})
                }
            });

            if (!response.ok) {
                const errorMessage = await parseErrorResponse(response);
                if (rollback) rollback();
                throw new Error(errorMessage);
            }

            return await response.json();
        } catch (error) {
            Alert.alert("Hata", error.message || "Bir sorun oluştu.");
            throw error;
        }
    };

    useEffect(() => {
        const loadCart = async () => {
            if (!authenticated) {
                setCartItems([]);
                setTotalPrice(0);
                setDiscountAmount(0);
                setAppliedCouponCode(null);
                setIsLoadingCart(false);
                return;
            }

            setIsLoadingCart(true);
            try {
                const data = await apiRequest(API_ENDPOINTS.CART);
                setCartItems(data.cartItems || []);
                setTotalPrice(data.totalPrice || 0);
                setDiscountAmount(data.discountAmount || 0);
                setAppliedCouponCode(data.appliedCouponCode || null);
            } finally {
                setIsLoadingCart(false);
            }
        };

        loadCart();
    }, [authenticated, token]);


    const addToCart = async (productId, quantity = 1) => {
        if (!requireAuth()) return { success: false };

        const rollback = saveStateForRollback();
        setCartItems(prev => {
            const existing = prev.find(item => item.productId === productId);
            return existing
                ? prev.map(item =>
                    item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
                )
                : [...prev, { productId, quantity }];
        });

        setIsLoadingCart(true);
        try {
            const data = await apiRequest(API_ENDPOINTS.ADD_TO_CART, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity })
            }, () => rollbackState(rollback));

            setCartItems(data.cartItems || []);
            setTotalPrice(data.totalPrice || 0);
            setDiscountAmount(data.discountAmount || 0);
            setAppliedCouponCode(data.appliedCouponCode || null);
            return { success: true, message: 'Ürün sepete eklendi!' };
        } finally {
            setIsLoadingCart(false);
        }
    };

    const updateCartItemQuantity = async (productId, newQuantity) => {
        if (!requireAuth()) return { success: false };
        const rollback = saveStateForRollback();

        setCartItems(prev =>
            newQuantity <= 0
                ? prev.filter(item => item.productId !== productId)
                : prev.map(item => item.productId === productId ? { ...item, quantity: newQuantity } : item)
        );

        setIsLoadingCart(true);
        try {
            const data = await apiRequest(API_ENDPOINTS.UPDATE_CART_ITEM_QUANTITY, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity: newQuantity })
            }, () => rollbackState(rollback));

            setCartItems(data.cartItems || []);
            setTotalPrice(data.totalPrice || 0);
            setDiscountAmount(data.discountAmount || 0);
            setAppliedCouponCode(data.appliedCouponCode || null);
            return { success: true, message: 'Sepet miktarı güncellendi!' };
        } finally {
            setIsLoadingCart(false);
        }
    };

    const removeFromCart = async (productId) => {
        if (!requireAuth()) return { success: false };
        const rollback = saveStateForRollback();

        setCartItems(prev => prev.filter(item => item.productId !== productId));

        setIsLoadingCart(true);
        try {
            const data = await apiRequest(`${API_ENDPOINTS.REMOVE_FROM_CART}/${productId}`, {
                method: 'DELETE'
            }, () => rollbackState(rollback));

            setCartItems(data.cartItems || []);
            setTotalPrice(data.totalPrice || 0);
            setDiscountAmount(data.discountAmount || 0);
            setAppliedCouponCode(data.appliedCouponCode || null);
            return { success: true, message: 'Ürün sepetten çıkarıldı.' };
        } finally {
            setIsLoadingCart(false);
        }
    };

    const clearCart = async () => {
        if (!requireAuth()) return { success: false };
        const rollback = saveStateForRollback();

        setCartItems([]);
        setTotalPrice(0);
        setDiscountAmount(0);
        setAppliedCouponCode(null);

        setIsLoadingCart(true);
        try {
            const data = await apiRequest(API_ENDPOINTS.CLEAR_CART, { method: 'DELETE' }, () => rollbackState(rollback));

            setCartItems(data.cartItems || []);
            setTotalPrice(data.totalPrice || 0);
            setDiscountAmount(data.discountAmount || 0);
            setAppliedCouponCode(data.appliedCouponCode || null);
            return { success: true, message: 'Sepet temizlendi.' };
        } finally {
            setIsLoadingCart(false);
        }
    };

    const applyCoupon = async (couponCode) => {
        if (!requireAuth()) return { success: false };
        const rollback = saveStateForRollback();

        setIsLoadingCart(true);
        try {
            const data = await apiRequest(API_ENDPOINTS.APPLY_COUPON, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ couponCode })
            }, () => rollbackState(rollback));

            setCartItems(data.cartItems || []);
            setTotalPrice(data.totalPrice || 0);
            setDiscountAmount(data.discountAmount || 0);
            setAppliedCouponCode(data.appliedCouponCode || null);
            Alert.alert("Kupon Uygulandı", `İndirim: ${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(data.discountAmount)}`);
            return { success: true, message: 'Kupon uygulandı!' };
        } finally {
            setIsLoadingCart(false);
        }
    };

    const removeCoupon = async () => {
        if (!requireAuth()) return { success: false };
        const rollback = saveStateForRollback();

        setIsLoadingCart(true);
        try {
            const data = await apiRequest(API_ENDPOINTS.REMOVE_COUPON, { method: 'DELETE' }, () => rollbackState(rollback));

            setCartItems(data.cartItems || []);
            setTotalPrice(data.totalPrice || 0);
            setDiscountAmount(data.discountAmount || 0);
            setAppliedCouponCode(data.appliedCouponCode || null);
            Alert.alert("Kupon Kaldırıldı", "Kupon başarıyla kaldırıldı.");
            return { success: true, message: 'Kupon kaldırıldı!' };
        } finally {
            setIsLoadingCart(false);
        }
    };

    const confirmOrder = async (orderData) => {
        if (!requireAuth()) return { success: false };
        if (cartItems.length === 0) {
            Alert.alert("Uyarı", "Sepetiniz boş.");
            return { success: false, message: "Sepet boş." };
        }

        setIsLoadingCart(true);
        try {
            const data = await apiRequest(API_ENDPOINTS.ORDERS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            setCartItems([]);
            setTotalPrice(0);
            setDiscountAmount(0);
            setAppliedCouponCode(null);
            Alert.alert("Sipariş Onaylandı", data.message || "Siparişiniz başarıyla oluşturuldu!");
            return { success: true, message: data.message || 'Sipariş oluşturuldu!' };
        } finally {
            setIsLoadingCart(false);
        }
    };


    const formattedTotalPrice = useMemo(() =>
        new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totalPrice), [totalPrice]);

    const formattedDiscountAmount = useMemo(() =>
        new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(discountAmount), [discountAmount]);


    const value = {
        cartItems,
        isLoadingCart,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        confirmOrder,
        totalPrice: formattedTotalPrice,
        discountAmount: formattedDiscountAmount,
        appliedCouponCode
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
