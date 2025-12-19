
import { LayoutDashboard, ShoppingCart, Package, Users, Megaphone, Sparkles, ListTodo, Settings } from 'lucide-react';

export const PRIMARY_NAV_ITEMS = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Bestellungen' },
  { href: '/admin/products', icon: Package, label: 'Produkte' },
  { href: '/admin/marketing', icon: Megaphone, label: 'Marketing' },
];

export const ALL_ADMIN_NAV_ITEMS = [
  ...PRIMARY_NAV_ITEMS,
  { href: '/admin/customers', icon: Users, label: 'Kunden' },
  { href: '/admin/sommelier', icon: Sparkles, label: 'Sommelier' },
  { href: '/admin/picker', icon: ListTodo, label: 'Picker' },
];

export const SECONDARY_NAV_ITEMS = [
    { href: '/admin/settings', label: 'Einstellungen', icon: Settings },
];
