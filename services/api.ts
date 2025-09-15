import { MenuItem, Category, Table, TableStatus } from '../types';

const menuItems: MenuItem[] = [
  // Appetizers
  { id: 1, name: 'Bruschetta', price: 2500, category: Category.Appetizers, imageUrl: 'https://images.unsplash.com/photo-1579684947550-22e945225d9a?q=80&w=400&auto=format&fit=crop' },
  { id: 2, name: 'Calamari Fritti', price: 3500, category: Category.Appetizers, imageUrl: 'https://images.unsplash.com/photo-1599921852435-052d952a259c?q=80&w=400&auto=format&fit=crop' },
  { id: 3, name: 'Caprese Salad', price: 2800, category: Category.Appetizers, imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=400&auto=format&fit=crop' },
  
  // Main Courses
  { id: 4, name: 'Spaghetti Carbonara', price: 5000, category: Category.MainCourses, imageUrl: 'https://images.unsplash.com/photo-1608796881204-56de9f74352a?q=80&w=400&auto=format&fit=crop' },
  { id: 5, name: 'Margherita Pizza', price: 4300, category: Category.MainCourses, imageUrl: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=400&auto=format&fit=crop' },
  { id: 6, name: 'Grilled Salmon', price: 6700, category: Category.MainCourses, imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400&auto=format&fit=crop' },
  { id: 7, name: 'Ribeye Steak', price: 9800, category: Category.MainCourses, imageUrl: 'https://images.unsplash.com/photo-1629237502172-875f3a398033?q=80&w=400&auto=format&fit=crop' },
  { id: 8, name: 'Chicken Alfredo', price: 5450, category: Category.MainCourses, imageUrl: 'https://images.unsplash.com/photo-1627914029306-a9c148f438da?q=80&w=400&auto=format&fit=crop' },

  // Desserts
  { id: 9, name: 'Tiramisu', price: 2500, category: Category.Desserts, imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=400&auto=format&fit=crop' },
  { id: 10, name: 'Cheesecake', price: 2400, category: Category.Desserts, imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=400&auto=format&fit=crop' },

  // Beverages
  { id: 11, name: 'Espresso', price: 1000, category: Category.Beverages, imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400&auto=format&fit=crop' },
  { id: 12, name: 'Latte', price: 1400, category: Category.Beverages, imageUrl: 'https://images.unsplash.com/photo-1580661869938-35461104e745?q=80&w=400&auto=format&fit=crop' },
  { id: 13, name: 'Iced Tea', price: 850, category: Category.Beverages, imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c7921a3?q=80&w=400&auto=format&fit=crop' },

  // Sides
  { id: 14, name: 'Garlic Bread', price: 1250, category: Category.Sides, imageUrl: 'https://images.unsplash.com/photo-1623334057201-1454562c10a4?q=80&w=400&auto=format&fit=crop' },
  { id: 15, name: 'French Fries', price: 1400, category: Category.Sides, imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=400&auto=format&fit=crop' },
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
  return new Promise(resolve => setTimeout(() => resolve(data), 500));
};

export const api = {
  fetchMenu: (): Promise<MenuItem[]> => mockApiCall(menuItems),
  fetchTables: (): Promise<Table[]> => mockApiCall(tables),
  submitOrder: (order: unknown): Promise<{ success: boolean; orderId: string }> => {
    console.log("Submitting order:", order);
    return mockApiCall({ success: true, orderId: `ORD-${Date.now()}` });
  }
};