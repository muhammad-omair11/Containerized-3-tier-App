import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) { setCart([]); return; }
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch {}
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (product_id, quantity = 1) => {
    await api.post('/cart', { product_id, quantity });
    await fetchCart();
  };

  const updateQty = async (id, quantity) => {
    await api.put(`/cart/${id}`, { quantity });
    await fetchCart();
  };

  const removeItem = async (id) => {
    await api.delete(`/cart/${id}`);
    await fetchCart();
  };

  const clearCart = async () => {
    await api.delete('/cart');
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeItem, clearCart, fetchCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
