

import type { LucideIcon } from "lucide-react";

export type UserRole = 'customer' | 'employee' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  customerSince?: string;
  loyaltyStamps?: number;
  phone?: string;
  deliveryAddress?: {
    street: string;
    city: string;
    zip: string;
    province: string;
  };
  currentDebt?: number;
  consent: {
    privacyPolicy: {
      accepted: boolean;
      timestamp: string;
    };
    marketing: {
      accepted: boolean;
      timestamp: string;
    };
    profiling: {
      accepted: boolean;
      timestamp: string;
    }
  };
  lastWheelSpin?: string;
  activePrize?: string;
  lastStampAt?: string;
  lastLogin?: string;
}

export type OrderType = 'preorder' | 'grocery_list';

export type OrderStatus = 'new' | 'picking' | 'ready' | 'collected' | 'ready_for_delivery' | 'delivered' | 'paid' | 'cancelled';

// Centralized Status Map with keys for translation
export const STATUS_MAP: Record<OrderStatus, { labelKey: keyof typeof import('./translations')['translations']['de']['status']; className: string; icon: LucideIcon }> = {
    new: { labelKey: 'new', className: 'bg-blue-100 text-blue-800', icon: require('lucide-react').Info },
    picking: { labelKey: 'picking', className: 'bg-yellow-100 text-yellow-800', icon: require('lucide-react').PackageSearch },
    ready: { labelKey: 'ready', className: 'bg-green-100 text-green-800', icon: require('lucide-react').CheckCircle },
    ready_for_delivery: { labelKey: 'ready_for_delivery', className: 'bg-cyan-100 text-cyan-800', icon: require('lucide-react').Truck },
    delivered: { labelKey: 'delivered', className: 'bg-purple-100 text-purple-800', icon: require('lucide-react').Home },
    collected: { labelKey: 'collected', className: 'bg-purple-100 text-purple-800', icon: require('lucide-react').CheckCircle },
    paid: { labelKey: 'paid', className: 'bg-emerald-100 text-emerald-800', icon: require('lucide-react').Euro },
    cancelled: { labelKey: 'cancelled', className: 'bg-red-100 text-red-800', icon: require('lucide-react').XCircle }
};


export interface OrderItem {
  productId: string;
  productName: MultilingualText;
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
  items?: OrderItem[];
  pickupDate?: string;
  rawList?: string;
  checklist?: ChecklistItem[];
  deliveryAddress?: { street: string; city: string; };
  deliveryDate?: string;
  processedBy?: string;
  total?: number;
  status: OrderStatus;
}


export interface Session {
  id: string;
  role: UserRole;
  [key: string]: any;
}

export interface MultilingualText {
  de: string;
  it: string;
  en: string;
}

export interface Recipe {
  title: MultilingualText;
  subtitle: MultilingualText;
  image: string;
  imageHint: string;
  ingredients: MultilingualText[];
  instructions: MultilingualText;
  description: MultilingualText;
}


export type CartItem = {
  productId: string;
  name: string; // Keep as simple string for cart display
  price: number;
  quantity: number;
};

export interface Story {
  id: string;
  imageUrl: string;
  imageHint: string;
  label: MultilingualText;
  author: MultilingualText;
  expiresAt: string;
}

export interface Category {
  id: string;
  name: MultilingualText;
}

export interface PackageItem {
  item: MultilingualText;
  amount: string;
}

export interface Product {
  id: string;
  name: MultilingualText;
  price: number;
  unit: string;
  imageUrl: string;
  imageHint: string;
  categoryId: string;
  description: MultilingualText;
  isAvailable: boolean;
  type: 'product' | 'package';
  packageContent?: PackageItem[];
  tags: string[];
  createdAt?: string;
}

export interface PlannerIngredientRule {
  productId: string;
  productName: MultilingualText;
  baseAmount: number; 
  unit: string; 
}

export interface PlannerEvent {
  id: string;
  title: MultilingualText;
  description: MultilingualText;
  imageUrl: string;
  imageHint: string;
  ingredients: PlannerIngredientRule[];
}

export interface WheelSegment {
    text: string;
    type: 'win' | 'lose';
}

export interface WheelOfFortuneSettings {
    isActive: boolean;
    schedule: 'daily' | 'weekly' | 'monthly';
    segments: WheelSegment[];
    developerMode?: boolean;
}
