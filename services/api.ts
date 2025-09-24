
import { MenuItem, Category, Table, TableStatus } from '../types';

let menuItems: MenuItem[] = [
  // Main Course
  { id: 1, name: 'Chicken Karahi', category: Category.MainCourse, imageUrl: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8da7?q=80&w=400&auto=format&fit=crop', variants: [ { name: '1kg', price: 1800 }, { name: '0.5kg', price: 950 } ] },
  { id: 2, name: 'Mutton Karahi', category: Category.MainCourse, imageUrl: 'https://images.unsplash.com/photo-1604503462826-f33a8a3c3b88?q=80&w=400&auto=format&fit=crop', variants: [ { name: '1kg', price: 2500 }, { name: '0.5kg', price: 1300 } ] },
  { id: 3, name: 'Chicken Biryani', category: Category.MainCourse, imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=400&auto=format&fit=crop', variants: [ { name: 'Single', price: 450 }, { name: 'Double', price: 800 } ] },
  { id: 4, name: 'Mutton Pulao', category: Category.MainCourse, imageUrl: 'https://images.unsplash.com/photo-1631207865324-34c3b5a76472?q=80&w=400&auto=format&fit=crop', variants: [ { name: '1kg', price: 1900 }, { name: '0.5kg', price: 1000 } ] },

  // Fast Food
  { id: 5, name: 'Zinger Burger', category: Category.FastFood, imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=400&auto=format&fit=crop', variants: [ { name: 'Standard', price: 600 } ] },
  { id: 6, name: 'Chicken Tikka Pizza', category: Category.FastFood, imageUrl: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=400&auto=format&fit=crop', variants: [ { name: 'Regular', price: 1200 } ] },
  { id: 7, name: 'Seekh Kebab Roll', category: Category.FastFood, imageUrl: 'https://images.unsplash.com/photo-1619881589716-0f7c7b6a4a44?q=80&w=400&auto=format&fit=crop', variants: [ { name: 'Standard', price: 350 } ] },
  { id: 8, name: 'Samosa Chaat', category: Category.FastFood, imageUrl: 'https://images.unsplash.com/photo-1637424696512-36c53a743b6e?q=80&w=400&auto=format&fit=crop', variants: [ { name: 'Standard', price: 250 } ] },
  
  // Sides
  { id: 9, name: 'French Fries', category: Category.Sides, imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=400&auto=format&fit=crop', variants: [ { name: 'Single', price: 200 }, { name: 'Double', price: 350 } ] },
  { id: 10, name: 'Raita', category: Category.Sides, imageUrl: 'https://images.unsplash.com/photo-1626500143899-733e361b7f03?q=80&w=400&auto=format&fit=crop', variants: [ { name: 'Standard', price: 100 } ] },
  { id: 11, name: 'Naan Bread', category: Category.Sides, imageUrl: 'https://images.unsplash.com/photo-1595301774393-d7a868411033?q=80&w=400&auto=format&fit=crop', variants: [ { name: 'Standard', price: 50 } ] },

  // Desserts
  { id: 12, name: 'Gulab Jamun', category: Category.Desserts, imageUrl: 'https://images.unsplash.com/photo-1631071191024-a15d2a297e61?q=80&w=400&auto=format&fit=crop', variants: [ { name: '2 pcs', price: 150 } ] },
  { id: 13, name: 'Kheer', category: Category.Desserts, imageUrl: 'https://images.unsplash.com/photo-1628833983942-0352554e2a8c?q=80&w=400&auto=format&fit=crop', variants: [ { name: 'Standard', price: 200 } ] },

  // Beverages
  { id: 14, name: 'Lassi', category: Category.Beverages, imageUrl: 'https://images.unsplash.com/photo-1627734819122-0002b851f558?q=80&w=400&auto=format&fit=crop', variants: [ { name: 'Sweet', price: 250 } ] },
  { id: 15, name: 'Soft Drink', category: Category.Beverages, imageUrl: 'https://images.unsplash.com/photo-1581006852262-e0349b54c1a8?q=80&w=400&auto=format&fit=crop', variants: [ { name: 'Standard', price: 100 } ] },
];

const tables: Table[] = [
  { id: 1, name: 'T1', capacity: 2, status: TableStatus.Available },
  { id: 2, name: 'T2', capacity: 4, status: TableStatus.Occupied },
  { id: 3, name: 'T3', capacity: 4, status: TableStatus.Available },
  { id: 4, name: 'T4', capacity: 6, status: TableStatus.NeedsCleaning },
  { id: 5, name: 'P1', capacity: 8, status: TableStatus.Available },
  { id: 6, name: 'P2', capacity: 8, status: TableStatus.Occupied },
  { id: 7, name: 'B1', capacity: 2, status: TableStatus.Occupied },
  { id: 8, name: 'B2', capacity: 2, status: TableStatus.Available },
  { id: 9, name: 'T5', capacity: 4, status: TableStatus.Available },
  { id: 10, name: 'T6', capacity: 6, status: TableStatus.NeedsCleaning },
];

const mockApiCall = <T,>(data: T): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), 200));
};

export const api = {
  fetchMenu: (): Promise<MenuItem[]> => mockApiCall(menuItems),
  fetchTables: (): Promise<Table[]> => mockApiCall(tables),
  submitOrder: (order: unknown): Promise<{ success: boolean; orderId: string }> => {
    console.log("Submitting order:", order);
    return mockApiCall({ success: true, orderId: `ORD-${Date.now()}` });
  },
  updateMenuItem: (updatedItem: MenuItem): Promise<MenuItem> => {
    menuItems = menuItems.map(item => item.id === updatedItem.id ? updatedItem : item);
    return mockApiCall(updatedItem);
  },
  addMenuItem: (newItemData: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
    const newId = menuItems.length > 0 ? Math.max(...menuItems.map(i => i.id)) + 1 : 1;
    const newItem: MenuItem = { id: newId, ...newItemData };
    menuItems.push(newItem);
    return mockApiCall(newItem);
  },
  deleteMenuItem: (itemId: number): Promise<{ success: boolean }> => {
    const initialLength = menuItems.length;
    menuItems = menuItems.filter(item => item.id !== itemId);
    const success = menuItems.length < initialLength;
    return mockApiCall({ success });
  }
};
