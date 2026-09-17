'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Machine, CartItem } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (machine: Machine, quantity?: number) => void;
  removeFromCart: (machineId: string) => void;
  updateQuantity: (machineId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (machineId: string) => boolean;
  getItemQuantity: (machineId: string) => number;
  totalCount: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  toastMessage: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'ebenezer_quote_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (err) {
      console.error('Error loading cart from localStorage', err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Error saving cart to localStorage', err);
    }
  }, [items, isHydrated]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    const timer = setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  const addToCart = useCallback((machine: Machine, quantity = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.machine.id === machine.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [...prevItems, { machine, quantity }];
      }
    });

    showToast(`"${machine.name}" añadida a la cotización`);
  }, [showToast]);

  const removeFromCart = useCallback((machineId: string) => {
    setItems((prevItems) => {
      const target = prevItems.find((i) => i.machine.id === machineId);
      if (target) {
        showToast(`"${target.machine.name}" eliminada de la lista`);
      }
      return prevItems.filter((item) => item.machine.id !== machineId);
    });
  }, [showToast]);

  const updateQuantity = useCallback((machineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(machineId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.machine.id === machineId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    showToast('Lista de cotización vaciada');
  }, [showToast]);

  const isInCart = useCallback(
    (machineId: string) => items.some((item) => item.machine.id === machineId),
    [items]
  );

  const getItemQuantity = useCallback(
    (machineId: string) => {
      const found = items.find((item) => item.machine.id === machineId);
      return found ? found.quantity : 0;
    },
    [items]
  );

  const totalCount = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart,
      getItemQuantity,
      totalCount,
      isOpen,
      setIsOpen,
      openCart,
      closeCart,
      toastMessage
    }),
    [
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart,
      getItemQuantity,
      totalCount,
      isOpen,
      openCart,
      closeCart,
      toastMessage
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
