import type { User, Category, Product, Order, AppConfig, Story, PlannerEvent, Recipe } from '@/lib/types';


// This is now only for fallback display if firestore fails.
export let mockAppConfig: AppConfig = {
    isWheelOfFortuneActive: true,
};

// Deprecated mock data arrays. Kept for reference, but should not be used in production code.
// These arrays are now populated by Firestore. We keep them here in case of DB connection issues
// on some pages that still rely on them.
export let mockUsers: User[] = [];
export let mockCategories: Category[] = [];
export let mockProducts: Product[] = [];
export let mockOrders: Order[] = [];
export let mockStories: Story[] = [];
export let mockPlannerEvents: PlannerEvent[] = [];
