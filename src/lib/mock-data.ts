import type { User, Category, Product, Order, LoyaltyData, AppConfig } from '@/lib/types';

export const mockUsers: User[] = [
  { id: 'user-1-customer', name: 'Maria Muster', email: 'customer@example.com', role: 'customer', password: 'password123', customerSince: new Date('2023-01-15').toISOString() },
  { id: 'user-2-employee', name: 'Mitarbeiter Max', email: 'employee@example.com', role: 'employee', password: 'password123' },
  { id: 'user-3-admin', name: 'Senoner Admin', email: 'admin@example.com', role: 'admin', password: 'password123' },
  { id: 'user-4-customer', name: 'John Doe', email: 'john@example.com', role: 'customer', password: 'password123', customerSince: new Date('2024-05-20').toISOString() },
];

export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Spezielle Vorbestellungen' },
  { id: 'cat-2', name: 'Lokale Delikatessen' },
];

export const mockProducts: Product[] = [
  { id: 'prod-1', name: 'Kleine Sushi-Box', price: 15, unit: 'box', categoryId: 'cat-1', imageUrl: 'https://picsum.photos/seed/sushism/400/300', imageHint: 'sushi box', availabilityDay: 'Donnerstag', isAvailable: true, timesOrderedLast30Days: 25 },
  { id: 'prod-2', name: 'Große Sushi-Box', price: 25, unit: 'box', categoryId: 'cat-1', imageUrl: 'https://picsum.photos/seed/sushilg/400/300', imageHint: 'sushi assortment', availabilityDay: 'Donnerstag', isAvailable: true, timesOrderedLast30Days: 18 },
  { id: 'prod-3', name: 'Frischer Fisch des Tages', price: 18, unit: 'kg', categoryId: 'cat-1', imageUrl: 'https://picsum.photos/seed/freshfish/400/300', imageHint: 'fresh fish', availabilityDay: 'Freitag', isAvailable: false, timesOrderedLast30Days: 12 },
  { id: 'prod-4', name: 'Regionale Käseplatte', price: 12.5, unit: 'platte', categoryId: 'cat-2', imageUrl: 'https://picsum.photos/seed/cheese/400/300', imageHint: 'cheese platter', isAvailable: true, timesOrderedLast30Days: 35 },
  { id: 'prod-5', name: 'Südtiroler Speck', price: 22, unit: 'kg', categoryId: 'cat-2', imageUrl: 'https://picsum.photos/seed/speck/400/300', imageHint: 'cured meat', isAvailable: true, timesOrderedLast30Days: 42 },
];

export const mockLoyaltyData: LoyaltyData[] = [
    {
        userId: 'user-1-customer',
        stamps: 7,
        availableCoupons: [],
        scanHistory: [
            { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), addedStamps: 1 },
            { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), addedStamps: 1 }
        ]
    },
    {
        userId: 'user-4-customer',
        stamps: 10,
        availableCoupons: [{id: 'coupon-1', type: 'discount', value: 5, description: '€5 Rabatt'}],
        scanHistory: []
    }
];

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    userId: 'user-1-customer',
    customerName: 'Maria Muster',
    items: [{ productId: 'prod-1', productName: 'Kleine Sushi-Box', quantity: 2, price: 15 }],
    total: 30,
    pickupDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'new',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'order-2',
    userId: 'user-4-customer',
    customerName: 'John Doe',
    items: [
        { productId: 'prod-2', productName: 'Große Sushi-Box', quantity: 1, price: 25 },
        { productId: 'prod-3', productName: 'Frischer Fisch des Tages', quantity: 1, price: 18 }
    ],
    total: 43,
    pickupDate: new Date().toISOString().split('T')[0],
    status: 'ready',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
    {
    id: 'order-3',
    userId: 'user-1-customer',
    customerName: 'Maria Muster',
    items: [{ productId: 'prod-4', productName: 'Regionale Käseplatte', quantity: 1, price: 12.5 }],
    total: 12.5,
    pickupDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'collected',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
    {
    id: 'order-4',
    userId: 'user-4-customer',
    customerName: 'John Doe',
    items: [{ productId: 'prod-5', productName: 'Südtiroler Speck', quantity: 1, price: 22 }],
    total: 22,
    pickupDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'new',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
    {
    id: 'order-5',
    userId: 'user-1-customer',
    customerName: 'Maria Muster',
    items: [{ productId: 'prod-1', productName: 'Kleine Sushi-Box', quantity: 1, price: 15 }],
    total: 15,
    pickupDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'ready', // This is an overdue pickup
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];


export let mockAppConfig: AppConfig = {
    seasonalHighlightText: 'Diese Woche neu: Frische Pfifferlinge aus der Region!',
    isWheelOfFortuneActive: true,
};
