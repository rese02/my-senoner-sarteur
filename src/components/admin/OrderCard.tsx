'use client';
import type { Order, OrderStatus } from "@/lib/types";
import { format, isToday, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { ChevronRight, FileText, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const statusMap: Record<OrderStatus, {label: string, className: string}> = {
  new: { label: 'Neu', className: 'bg-blue-100 text-blue-800' },
  picking: { label: 'Wird gepackt', className: 'bg-yellow-100 text-yellow-800' },
  ready: { label: 'Abholbereit', className: 'bg-green-100 text-green-700' },
  ready_for_delivery: { label: 'Bereit Zur Lieferung', className: 'bg-green-100 text-green-700' },
  delivered: { label: 'Geliefert', className: 'bg-gray-100 text-gray-800' },
  collected: { label: 'Abgeholt', className: 'bg-gray-100 text-gray-800' },
  paid: { label: 'Bezahlt', className: 'bg-teal-100 text-teal-800' },
  cancelled: { label: 'Storniert', className: 'bg-red-100 text-red-800' }
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
    onShowDetails?: () => void;
}

export function OrderCard({ order, onShowDetails }: OrderCardProps) {
  const isGroceryList = order.type === 'grocery_list';
  const pickupDate = order.pickupDate ? parseISO(order.pickupDate) : parseISO(order.createdAt);
  const itemCount = isGroceryList ? order.rawList?.split('\n').length : order.items?.length;

  return (
    <div 
      onClick={onShowDetails}
      className={cn(
        "bg-card rounded-xl p-4 shadow-sm border hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group relative",
        onShowDetails && "cursor-pointer"
      )}>
      
      {/* Icon, Name, ID */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={cn(
            "p-3 rounded-lg", 
            isGroceryList ? 'bg-orange-100 text-orange-600' : 'bg-primary/10 text-primary'
          )}
        >
          {isGroceryList ? <FileText size={20} /> : <ShoppingCart size={20} />}
        </div>
        <div>
          <h4 className="font-bold text-base text-foreground">{order.customerName}</h4>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">#{order.id.slice(-6)}</p>
        </div>
      </div>

      {/* Details (Item count & Date) */}
      <div className="text-sm text-muted-foreground sm:text-center shrink-0">
        <p>{itemCount} Artikel</p>
        <p className="font-medium text-foreground">{isToday(pickupDate) ? 'Heute' : format(pickupDate, 'dd. MMM', { locale: de })}</p>
      </div>

      {/* Price & Status */}
      <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0">
        {order.total ? 
          <p className="font-bold text-lg text-foreground">€{order.total.toFixed(2)}</p>
          : <p className="font-bold text-lg text-muted-foreground">-</p>
        }
        <StatusBadge status={order.status} />
      </div>

      {/* Action Button */}
      {onShowDetails && (
        <div className="sm:ml-4 flex items-center">
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      )}
    </div>
  );
}
