const API_BASE_URL = 'http://192.168.1.200:5227/api';
//Tel: 'http://192.168.1.200:5227/api'
//PC:  'http://10.0.2.2:5227/api'
//Hotspot: 'http://192.168.137.1:5227/api'
export const API_ENDPOINTS = {
    PRODUCTS: `${API_BASE_URL}/Products`,
    FAVORITES: `${API_BASE_URL}/Favorites`,
    REGISTER: `${API_BASE_URL}/Auth/register`,
    LOGIN: `${API_BASE_URL}/Auth/login`,
    UPDATE_PROFILE: `${API_BASE_URL}/Auth/update-profile`,
    CART: `${API_BASE_URL}/Cart`,
    ADD_TO_CART: `${API_BASE_URL}/Cart/add`,
    REMOVE_FROM_CART: `${API_BASE_URL}/Cart`,
    CLEAR_CART: `${API_BASE_URL}/Cart/clear`,
    UPDATE_CART_ITEM_QUANTITY: `${API_BASE_URL}/Cart/update-quantity`,
    ORDERS: `${API_BASE_URL}/Order`,
    MY_ORDERS: `${API_BASE_URL}/Order/MyOrders`,

};
