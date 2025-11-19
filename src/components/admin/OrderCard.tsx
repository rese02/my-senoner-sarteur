'use client';
import type { Order, OrderStatus } from "@/lib/types";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransition } from "react";


type OrderCardProps = {
    order: Order;
    statusMap: Record<OrderStatus, {label: string, className: string}>;
    onStatusChange: (id: string, status: OrderStatus) => void;
    onShowDetails: (order: Order) => void;
}

export function OrderCard({ order, statusMap, onStatusChange, onShowDetails }: OrderCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleSelectChange = (value: OrderStatus) => {
    startTransition(() => {
        onStatusChange(order.id, value);
    });
  }

  return (
    <Card className="mb-4 transition-all hover:shadow-md">
        <CardContent className="p-4" onClick={() => onShowDetails(order)}>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-lg">{order.customerName}</p>
              <p className="text-sm text-muted-foreground">#{order.id.slice(-6)}</p>
            </div>
             <p className="text-sm font-medium">
                {format(new Date(order.pickupDate), "EEE, dd.MM.", { locale: de })}
            </p>
          </div>
          <div className="mt-4 text-sm space-y-2">
            <p className="text-muted-foreground">{order.items.map(item => `${item.quantity}x ${item.productName}`).join(', ')}</p>
             <p className="font-bold text-base">€{order.total.toFixed(2)}</p>
          </div>
        </CardContent>
         <div className="px-4 pb-4" onClick={e => e.stopPropagation()}>
             <Select 
                value={order.status} 
                onValueChange={handleSelectChange}
                disabled={isPending}
              >
                <SelectTrigger className="w-full capitalize text-sm bg-card focus:ring-primary/50">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {Object.keys(statusMap).map(s => (
                      <SelectItem key={s} value={s} className="capitalize text-sm">{statusMap[s as OrderStatus].label}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
          </div>
    </Card>
  );
}
