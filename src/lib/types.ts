export type UserRole = 'customer' | 'employee' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // Only for mock data, not in real DB
  customerSince?: string;
  loyaltyData?: LoyaltyData;
}

export interface LoyaltyData {
  points: number;
  availableCoupons: {
    id: string;
    type: string;
    value: number;
    description: string;
  }[];
  scanHistory: {
    date: string;
    addedPoints: number;
  }[];
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  imageUrl: string;
  imageHint: string;
  categoryId: string;
  availabilityDay?: 'Donnerstag' | 'Freitag';
  isAvailable: boolean;
  timesOrderedLast30Days?: number;
}

export type OrderStatus = 'new' | 'ready' | 'collected' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  pickupDate: string;
  status: OrderStatus;
  createdAt: string;
}

export interface SessionPayload {
  userId: string;
  role: UserRole;
  expiresAt: Date;
}

export interface Recipe {
  title: string;
  subtitle: string;
  image: string;
  imageHint: string;
  ingredients: string[];
  instructions: string;
  description: string;
}
export interface AppConfig {
  recipeOfTheWeek: Recipe;
  isWheelOfFortuneActive: boolean;
}

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};
