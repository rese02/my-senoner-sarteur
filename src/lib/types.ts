
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
  consent: { // Made non-optional
    privacyPolicy: {
      accepted: boolean;
      timestamp: string;
    };
    marketing: { // Made non-optional
      accepted: boolean;
      timestamp: string;
    };
    profiling: { // Made non-optional
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
