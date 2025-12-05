export type UserRole = 'customer' | 'employee' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // Only for mock data, not in real DB
  customerSince?: string;
  loyaltyStamps?: number; // New stamp system
  phone?: string;
  deliveryAddress?: {
    street: string;
    city: string;
    zip: string;
    province: string;
  };
  currentDebt?: number;
}

export interface LoyaltyData {
  // This interface is now deprecated in favor of loyaltyStamps on User
  // Kept for potential history or other data in the future
  stamps?: number;
  history?: { date: string; action: string; amount: number; note: string }[];
}


export interface Category {
  id: string;
  name:string;
}

export interface PackageItem {
  item: string;
  amount: string;
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
  type: 'product' | 'package';
  packageContent?: PackageItem[];
  // For wine catalog
  tags: string[];
  createdAt: string;
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


export interface Session {
  userId: string;
  role: UserRole;
  [key: string]: any;
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
  expiresAt: string;
}


// --- Party Planner ---
export interface PlannerIngredientRule {
  productId: string;
  productName: string;
  baseAmount: number; // Amount for 1 person
  unit: string; // e.g., 'g', 'ml', 'Stück'
}

export interface PlannerEvent {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  ingredients: PlannerIngredientRule[];
}
