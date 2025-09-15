
export enum Category {
  Appetizers = 'Appetizers',
  MainCourses = 'Main Courses',
  Desserts = 'Desserts',
  Beverages = 'Beverages',
  Sides = 'Sides',
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: Category;
  imageUrl: string;
}

export interface OrderItem extends MenuItem {
  quantity: number;
  notes?: string;
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
