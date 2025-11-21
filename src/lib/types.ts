export type UserRole = 'customer' | 'employee' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // Only for mock data, not in real DB
  customerSince?: string;
  loyaltyData?: LoyaltyData;
  deliveryAddress?: {
    street: string;
    city: string;
    notes?: string;
  };
  currentDebt?: number;
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
  description?: string; // Added for bundles
  availabilityDay?: 'Donnerstag' | 'Freitag';
  isAvailable: boolean;
  timesOrderedLast30Days?: number;
}

export type OrderType = 'preorder' | 'grocery_list';
export type OrderStatus = 'new' | 'picking' | 'ready' | 'collected' | 'ready_for_delivery' | 'delivered' | 'paid' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface ChecklistItem {
    item: string;
    isFound: boolean;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  createdAt: string;
  
  type: OrderType;
  
  // For 'preorder'
  items?: OrderItem[];
  pickupDate?: string;
  
  // For 'grocery_list'
  rawList?: string;
  checklist?: ChecklistItem[];
  deliveryAddress?: { street: string; city: string; notes?: string };
  deliveryDate?: string;
  
  processedBy?: string; // Employee User ID

  total?: number; // Can be pre-calculated for 'preorder' or set for 'grocery_list'
  status: OrderStatus;
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

export interface Story {
  id: string;
  imageUrl: string;
  imageHint: string;
  label: string;
  author: string;
  duration?: number;
}
