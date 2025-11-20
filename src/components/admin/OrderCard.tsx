'use client';
import type { Order, OrderStatus } from "@/lib/types";
import { format, isToday } from "date-fns";
import { de } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";


type OrderCardProps = {
    order: Order;
    statusMap: Record<OrderStatus, {label: string, className: string}>;
    onStatusChange: (id: string, status: OrderStatus) => void;
    onShowDetails: (order: Order) => void;
}

export function OrderCard({ order, statusMap, onStatusChange, onShowDetails }: OrderCardProps) {
  const [isPending, startTransition] = useTransition();
  const dueDate = new Date(order.pickupDate || order.deliveryDate || order.createdAt);

  const handleSelectChange = (value: OrderStatus) => {
    startTransition(() => {
        onStatusChange(order.id, value);
    });
  }

  return (
    <Card className="mb-4 transition-all hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex justify-between items-start" onClick={() => onShowDetails(order)}>
            <div>
              <p className="font-bold text-lg">{order.customerName}</p>
              <p className="text-sm text-muted-foreground">#{order.id.slice(-6)}</p>
            </div>
             <p className={cn("text-sm font-medium", isToday(dueDate) ? "text-primary" : "")}>
                {isToday(dueDate) ? 'Heute' : format(dueDate, "EEE, dd.MM.", { locale: de })}
            </p>
          </div>
          <div className="mt-4 text-sm space-y-2" onClick={() => onShowDetails(order)}>
            <p className="text-muted-foreground">{
               order.type === 'grocery_list'
                ? `${order.rawList?.split('\n').length || 0} Artikel`
                : order.items?.map(item => `${item.quantity}x ${item.productName}`).join(', ')
            }</p>
             <p className="font-bold text-base">{order.total ? `€${order.total.toFixed(2)}`: 'Preis offen'}</p>
          </div>
           <div className="border-t pt-4 mt-4 flex items-center justify-between gap-4">
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
              <Button variant="ghost" onClick={() => onShowDetails(order)}>Details</Button>
           </div>
        </CardContent>
    </Card>
  );
}
