'use client';
import { PageHeader } from "@/components/common/PageHeader";
import { mockOrders } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Search, Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import type { Order, OrderStatus } from "@/lib/types";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const statusMap: Record<OrderStatus, string> = {
  new: 'Neu',
  ready: 'Abholbereit',
  collected: 'Abgeholt',
  cancelled: 'Storniert'
};

const statusColors: Record<OrderStatus, 'default' | 'outline' | 'secondary' | 'destructive'> = {
  new: 'default',
  ready: 'outline',
  collected: 'secondary',
  cancelled: 'destructive'
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const { toast } = useToast();

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders => prevOrders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast({
        title: "Status aktualisiert",
        description: `Bestellung #${orderId.slice(-6)} ist jetzt "${statusMap[newStatus]}".`
    })
  };

  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const matchesSearch = 
          order.customerName.toLowerCase().includes(lowerSearchTerm) ||
          order.id.toLowerCase().includes(lowerSearchTerm);
        
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime());
  }, [orders, searchTerm, statusFilter]);

  return (
    <>
      <PageHeader title="Bestellungen" description="Verwalten Sie alle Vorbestellungen Ihrer Kunden." />
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <CardTitle>Alle Bestellungen</CardTitle>
             <div className="flex gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Kunde oder ID suchen..." 
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={(value: OrderStatus | 'all') => setStatusFilter(value)}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Status filtern" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Alle Status</SelectItem>
                        <SelectItem value="new">Neu</SelectItem>
                        <SelectItem value="ready">Abholbereit</SelectItem>
                        <SelectItem value="collected">Abgeholt</SelectItem>
                        <SelectItem value="cancelled">Storniert</SelectItem>
                    </SelectContent>
                </Select>
             </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bestell-ID</TableHead>
                <TableHead>Bestelldatum</TableHead>
                <TableHead>Kunde</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Abholung</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">Keine Bestellungen gefunden.</TableCell>
                </TableRow>
              )}
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">#{order.id.slice(-6)}</TableCell>
                  <TableCell>{format(parseISO(order.createdAt), "dd.MM.yy, HH:mm")}</TableCell>
                  <TableCell className="font-medium">{order.customerName}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}</TableCell>
                  <TableCell className="text-right">€{order.total.toFixed(2)}</TableCell>
                  <TableCell>{format(new Date(order.pickupDate), "EEE, dd.MM.", { locale: de })}</TableCell>
                  <TableCell>
                    <Select value={order.status} onValueChange={(value: OrderStatus) => handleStatusChange(order.id, value)}>
                      <SelectTrigger className="h-8 w-[120px] capitalize text-xs">
                         <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                         {Object.keys(statusMap).map(s => (
                            <SelectItem key={s} value={s} className="capitalize text-xs">{statusMap[s as OrderStatus]}</SelectItem>
                         ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
