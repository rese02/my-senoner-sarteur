
import { LayoutDashboard, ShoppingCart, Package, Users, Megaphone, Sparkles, ListTodo } from 'lucide-react';

export const ADMIN_NAV_ITEMS = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Bestellungen' },
  { href: '/admin/products', icon: Package, label: 'Produkte' },
  { href: '/admin/customers', icon: Users, label: 'Kunden' },
  { href: '/admin/marketing', icon: Megaphone, label: 'Marketing' },
  { href: '/admin/sommelier', icon: Sparkles, label: 'Sommelier' },
  { href: '/admin/picker', icon: ListTodo, label: 'Picker' },
];
