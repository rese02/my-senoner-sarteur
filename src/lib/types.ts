
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

// Centralized Status Map
export const STATUS_MAP: Record<OrderStatus, { label: string; className: string; icon: LucideIcon }> = {
    new: { label: 'Neu', className: 'bg-blue-100 text-blue-800', icon: require('lucide-react').Info },
    picking: { label: 'Wird gepackt', className: 'bg-yellow-100 text-yellow-800', icon: require('lucide-react').PackageSearch },
    ready: { label: 'Abholbereit', className: 'bg-green-100 text-green-800', icon: require('lucide-react').CheckCircle },
    ready_for_delivery: { label: 'Auf dem Weg', className: 'bg-cyan-100 text-cyan-800', icon: require('lucide-react').Truck },
    delivered: { label: 'Geliefert', className: 'bg-purple-100 text-purple-800', icon: require('lucide-react').Home },
    collected: { label: 'Abgeholt', className: 'bg-purple-100 text-purple-800', icon: require('lucide-react').CheckCircle },
    paid: { label: 'Bezahlt', className: 'bg-emerald-100 text-emerald-800', icon: require('lucide-react').Euro },
    cancelled: { label: 'Storniert', className: 'bg-red-100 text-red-800', icon: require('lucide-react').XCircle }
};


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
  description?: string;
  isAvailable: boolean;
  type: 'product' | 'package';
  packageContent?: PackageItem[];
  tags: string[];
  createdAt?: string;
}

export interface PlannerIngredientRule {
  productId: string;
  productName: string;
  baseAmount: number; 
  unit: string; 
}

export interface PlannerEvent {
  id: string;
  title: string;
  description: string;
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
