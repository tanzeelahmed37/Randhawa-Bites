import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { OrderItem, MenuItem, Order } from '../types';

interface OrderContextType {
  activeTableId: number | null;
  setActiveTableId: (id: number | null) => void;
  orders: Record<number, OrderItem[]>;
  addItemToOrder: (item: MenuItem) => void;
  updateItemQuantity: (itemId: number, newQuantity: number) => void;
  removeItemFromOrder: (itemId: number) => void;
  completeActiveOrder: () => void;
  getActiveOrderItems: () => OrderItem[];
  completedOrders: Order[];
  isDashboardReset: boolean;
  setIsDashboardReset: (isReset: boolean) => void;
}

const OrderContext = createContext<OrderContextType | null>(null);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTableId, setActiveTableId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Record<number, OrderItem[]>>({});
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [isDashboardReset, setIsDashboardReset] = useState(false);

  const addItemToOrder = useCallback((itemToAdd: MenuItem) => {
    if (!activeTableId) return;
    setOrders(prevOrders => {
      const currentOrder = prevOrders[activeTableId] || [];
      const existingItem = currentOrder.find(item => item.id === itemToAdd.id);
      let newOrder;
      if (existingItem) {
        newOrder = currentOrder.map(item =>
          item.id === itemToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newOrder = [...currentOrder, { ...itemToAdd, quantity: 1 }];
      }
      return { ...prevOrders, [activeTableId]: newOrder };
    });
  }, [activeTableId]);

  const updateItemQuantity = useCallback((itemId: number, newQuantity: number) => {
    if (!activeTableId) return;
    setOrders(prevOrders => {
        const currentOrder = prevOrders[activeTableId] || [];
        if (newQuantity <= 0) {
            const newOrder = currentOrder.filter(item => item.id !== itemId);
            return { ...prevOrders, [activeTableId]: newOrder };
        } else {
            const newOrder = currentOrder.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            );
            return { ...prevOrders, [activeTableId]: newOrder };
        }
    });
  }, [activeTableId]);
  
  const removeItemFromOrder = useCallback((itemId: number) => {
    if (!activeTableId) return;
     setOrders(prevOrders => {
        const currentOrder = prevOrders[activeTableId] || [];
        const newOrder = currentOrder.filter(item => item.id !== itemId);
        return { ...prevOrders, [activeTableId]: newOrder };
     });
  }, [activeTableId]);

  const getActiveOrderItems = useCallback((): OrderItem[] => {
    return activeTableId ? orders[activeTableId] || [] : [];
  }, [activeTableId, orders]);
  
  const completeActiveOrder = useCallback(() => {
    if (!activeTableId) return;
    
    const items = getActiveOrderItems();
    if (items.length === 0) return;
    
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.10;
    const total = subtotal + tax;
    
    const newOrder: Order = {
        id: `ORD-${Date.now()}-${activeTableId}`,
        items,
        subtotal,
        tax,
        total,
        timestamp: new Date(),
    };
    
    setCompletedOrders(prev => [...prev, newOrder]);
    
    setOrders(prevOrders => {
        const newOrders = { ...prevOrders };
        delete newOrders[activeTableId];
        return newOrders;
    });
  }, [activeTableId, getActiveOrderItems]);


  const value = useMemo(() => ({
    activeTableId,
    setActiveTableId,
    orders,
    addItemToOrder,
    updateItemQuantity,
    removeItemFromOrder,
    completeActiveOrder,
    getActiveOrderItems,
    completedOrders,
    isDashboardReset,
    setIsDashboardReset
  }), [activeTableId, orders, addItemToOrder, updateItemQuantity, removeItemFromOrder, completeActiveOrder, getActiveOrderItems, completedOrders, isDashboardReset]);

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
