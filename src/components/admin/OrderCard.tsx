'use client';
import type { Order, OrderStatus } from "@/lib/types";
import { format, isToday } from "date-fns";
import { de } from "date-fns/locale";
import { ChevronRight, FileText, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const statusMap: Record<OrderStatus, {label: string, className: string}> = {
  new: { label: 'Neu', className: 'bg-blue-100 text-blue-700' },
  picking: { label: 'Wird gepackt', className: 'bg-yellow-100 text-yellow-800' },
  ready: { label: 'Abholbereit', className: 'bg-status-ready-bg text-status-ready-fg' },
  ready_for_delivery: { label: 'Bereit zur Lieferung', className: 'bg-status-ready-bg text-status-ready-fg' },
  delivered: { label: 'Geliefert', className: 'bg-slate-100 text-slate-600' },
  collected: { label: 'Abgeholt', className: 'bg-status-collected-bg text-status-collected-fg' },
  paid: { label: 'Bezahlt', className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Storniert', className: 'bg-status-cancelled-bg text-status-cancelled-fg' }
};

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const statusInfo = statusMap[status];
  return (
    <Badge className={cn("capitalize font-semibold text-xs", statusInfo.className)}>
      {statusInfo.label}
    </Badge>
  );
};


type OrderCardProps = {
    order: Order;
    onClick?: () => void;
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  const isGroceryList = order.type === 'grocery_list';
  const pickupDate = order.pickupDate ? new Date(order.pickupDate) : new Date(order.createdAt);
  const itemCount = isGroceryList ? order.rawList?.split('\n').length : order.items?.length;

  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-card rounded-xl p-0 shadow-sm border hover:shadow-md transition-all duration-300 flex overflow-hidden group",
        onClick && "cursor-pointer"
      )}>
      
      {/* Left color strip */}
      <div className={cn("w-2", statusMap[order.status].className)} />

      <div className="p-4 flex-1 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        
        {/* Icon & Name */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className={cn(
              "p-3 rounded-full", 
              isGroceryList ? 'bg-orange-100 text-orange-600' : 'bg-primary/5 text-primary'
            )}
          >
            {isGroceryList ? <FileText /> : <ShoppingCart />}
          </div>
          <div>
            <h4 className="font-headline text-lg font-bold text-foreground">{order.customerName}</h4>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">#{order.id.slice(-6)}</p>
          </div>
        </div>

        {/* Details */}
        <div className="text-sm text-muted-foreground sm:text-center">
          <p>{itemCount} Artikel</p>
          <p className="text-xs">{isToday(pickupDate) ? 'Heute' : format(pickupDate, 'dd.MM.yyyy')}</p>
        </div>

        {/* Price & Status */}
        <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
          {order.total ? 
            <p className="font-bold text-xl text-accent-foreground">€{order.total.toFixed(2)}</p>
            : <p className="font-bold text-lg text-muted-foreground">-</p>
          }
          <StatusBadge status={order.status} />
        </div>

        {/* Action Button (appears on hover) */}
        {onClick && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-1/2 -translate-y-1/2 sm:static sm:translate-y-0">
            <Button variant="ghost" size="icon"><ChevronRight /></Button>
          </div>
        )}
      </div>
    </div>
  );
}
