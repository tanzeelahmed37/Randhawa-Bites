
export enum Category {
  MainCourse = 'Main Course',
  FastFood = 'Fast Food',
  Desserts = 'Desserts',
  Beverages = 'Beverages',
  Sides = 'Sides',
}

export interface Variant {
  name: string; // e.g., "0.5kg", "Single"
  price: number;
}

export interface MenuItem {
  id: number;
  name: string;
  category: Category;
  imageUrl: string;
  variants: Variant[];
}

export interface OrderItem {
  orderKey: string; // Unique identifier for this item in the order, e.g. "1-1kg"
  menuItemId: number; // The ID of the original MenuItem
  name: string; // The display name, e.g. "Chicken Karahi (1kg)"
  price: number; // The price of the selected variant
  quantity: number;
  imageUrl: string;
  notes?: string;
  category: Category;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  timestamp: Date;
}

export enum TableStatus {
  Available = 'Available',
  Occupied = 'Occupied',
  NeedsCleaning = 'Needs Cleaning',
}

export interface Table {
  id: number;
  name: string;
  capacity: number;
  status: TableStatus;
}
