
import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { OrderItem, MenuItem, Order, Variant } from '../types';

interface OrderContextType {
  activeTableId: number | null;
  setActiveTableId: (id: number | null) => void;
  orders: Record<number, OrderItem[]>;
  addItemToOrder: (item: MenuItem, variant: Variant) => void;
  updateItemQuantity: (orderKey: string, newQuantity: number) => void;
  removeItemFromOrder: (orderKey: string) => void;
  removeItemFromAllOrders: (menuItemId: number) => void;
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

  const addItemToOrder = useCallback((itemToAdd: MenuItem, variant: Variant) => {
    if (!activeTableId) return;

    const orderKey = `${itemToAdd.id}-${variant.name}`;

    setOrders(prevOrders => {
      const currentOrder = prevOrders[activeTableId] || [];
      const existingItem = currentOrder.find(item => item.orderKey === orderKey);
      
      let newOrder;
      if (existingItem) {
        newOrder = currentOrder.map(item =>
          item.orderKey === orderKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        const newOrderItem: OrderItem = {
            orderKey,
            menuItemId: itemToAdd.id,
            name: `${itemToAdd.name} (${variant.name})`,
            price: variant.price,
            quantity: 1,
            imageUrl: itemToAdd.imageUrl,
            category: itemToAdd.category,
        };
        newOrder = [...currentOrder, newOrderItem];
      }
      return { ...prevOrders, [activeTableId]: newOrder };
    });
  }, [activeTableId]);

  const updateItemQuantity = useCallback((orderKey: string, newQuantity: number) => {
    if (!activeTableId) return;
    setOrders(prevOrders => {
        const currentOrder = prevOrders[activeTableId] || [];
        if (newQuantity <= 0) {
            const newOrder = currentOrder.filter(item => item.orderKey !== orderKey);
            return { ...prevOrders, [activeTableId]: newOrder };
        } else {
            const newOrder = currentOrder.map(item =>
                item.orderKey === orderKey ? { ...item, quantity: newQuantity } : item
            );
            return { ...prevOrders, [activeTableId]: newOrder };
        }
    });
  }, [activeTableId]);
  
  const removeItemFromOrder = useCallback((orderKey: string) => {
    if (!activeTableId) return;
     setOrders(prevOrders => {
        const currentOrder = prevOrders[activeTableId] || [];
        const newOrder = currentOrder.filter(item => item.orderKey !== orderKey);
        return { ...prevOrders, [activeTableId]: newOrder };
     });
  }, [activeTableId]);

  const removeItemFromAllOrders = useCallback((menuItemId: number) => {
    setOrders(prevOrders => {
        const newOrders = { ...prevOrders };
        for (const tableId in newOrders) {
            newOrders[tableId] = newOrders[tableId].filter(
                item => item.menuItemId !== menuItemId
            );
        }
        return newOrders;
    });
  }, []);

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
    removeItemFromAllOrders,
    completeActiveOrder,
    getActiveOrderItems,
    completedOrders,
    isDashboardReset,
    setIsDashboardReset
  }), [activeTableId, orders, addItemToOrder, updateItemQuantity, removeItemFromOrder, removeItemFromAllOrders, completeActiveOrder, getActiveOrderItems, completedOrders, isDashboardReset]);

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
