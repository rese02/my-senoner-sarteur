
'use client';

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { User, Order, Product, Category } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Send, RotateCw, Trophy, Filter, Loader2, FileWarning } from "lucide-react";
import { useState, useMemo, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { improveTextWithAI } from "@/app/actions/ai.actions";
import { sendNewsletter } from "@/app/actions/email.actions";
import { Badge } from "@/components/ui/badge";
import { getLoyaltyTier, loyaltyTiers } from "@/lib/loyalty";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn, getLang } from "@/lib/utils";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";

const getCustomerPurchaseCategories = (userId: string, allOrders: Order[], allProducts: Product[]): Set<string> => {
    const categories = new Set<string>();
    const customerOrders = allOrders.filter(o => o.userId === userId);
    for (const order of customerOrders) {
        if (Array.isArray(order.items)) {
            for (const item of order.items) {
                const product = allProducts.find(p => p.id === item.productId);
                if (product) {
                    categories.add(product.categoryId);
                }
            }
        }
    }
    return categories;
};

function CustomerCard({ customer, isSelected, onSelect, orders, products }: { customer: User, isSelected: boolean, onSelect: (id: string, checked: boolean) => void, orders: Order[], products: Product[] }) {
    const customerOrders = orders.filter(o => o.userId === customer.id);
    const totalSpent = customerOrders.reduce((sum, o) => sum + (o.total ?? 0), 0);
    const loyaltyData = customer.loyaltyStamps ? { points: customer.loyaltyStamps * 15 } : { points: 0 }; // Simulate points
    const loyaltyTier = loyaltyData ? getLoyaltyTier(loyaltyData.points) : loyaltyTiers.bronze;

    return (
        <div 
            onClick={() => onSelect(customer.id, !isSelected)}
            className={cn(
                "p-3 border rounded-xl transition-colors flex items-start gap-3", 
                isSelected ? "bg-secondary border-primary ring-2 ring-primary" : "bg-card hover:bg-secondary/50"
            )}
        >
             <Checkbox 
                checked={isSelected}
                className="mt-1 shrink-0"
             />
            <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start gap-2 flex-wrap">
                    <div className="min-w-0">
                        <p className="font-semibold text-sm break-words">
                            <Link href={`/admin/customers/${customer.id}`} className="hover:underline">{customer.name}</Link>
                        </p>
                        <p className="text-xs text-muted-foreground break-words">{customer.email}</p>
                    </div>
                    <Badge variant="outline" className={`border-0 shrink-0 text-xs ${loyaltyTier.color.replace('text-', 'bg-').replace('600', '100')} ${loyaltyTier.color}`}>
                       <Trophy className="w-3 h-3 mr-1.5" />
                       {loyaltyTier.name}
                    </Badge>
                </div>
                <div className="text-right mt-2 font-semibold text-sm">
                    €{totalSpent.toFixed(2)}
                </div>
            </div>
        </div>
    )
}

interface CustomersClientProps {
    initialCustomers: User[];
    initialOrders: Order[];
    initialProducts: Product[];
    initialCategories: Category[];
}

export function CustomersClient({ initialCustomers, initialOrders, initialProducts, initialCategories }: CustomersClientProps) {
    const [customers] = useState<User[]>(initialCustomers);
    const [orders] = useState<Order[]>(initialOrders);
    const [products] = useState<Product[]>(initialProducts);
    const [categories] = useState<Category[]>(initialCategories);

    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [open, setOpen] = useState(false);

    const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isImproving, setIsImproving] = useState(false);
    const [isSending, startSendingTransition] = useTransition();
    const { toast } = useToast();
    const { lang } = useLanguage();

    const filteredCustomers = useMemo(() => {
        if (selectedCategories.length === 0) {
            return customers;
        }
        const selectedCategoryIds = new Set(selectedCategories.map(c => c.id));
        return customers.filter(customer => {
            const purchaseHistory = getCustomerPurchaseCategories(customer.id, orders, products);
            return Array.from(selectedCategoryIds).some(catId => purchaseHistory.has(catId));
        });
    }, [customers, orders, products, selectedCategories]);


    const handleSelectAll = (checked: boolean | 'indeterminate') => {
        if (checked === true) {
            setSelectedCustomers(filteredCustomers.map(c => c.id));
        } else {
            setSelectedCustomers([]);
        }
    };

    const handleSelectCustomer = (customerId: string, checked: boolean) => {
        if (checked) {
            setSelectedCustomers(prev => [...prev, customerId]);
        } else {
            setSelectedCustomers(prev => prev.filter(id => id !== customerId));
        }
    };
    
    const handleImproveText = async () => {
        if (!message || !subject) {
            toast({ variant: 'destructive', title: 'Betreff und Nachricht sind erforderlich.' });
            return;
        }
        setIsImproving(true);
        try {
            const { improvedSubject, improvedMessage } = await improveTextWithAI({ subject, message });
            setSubject(improvedSubject);
            setMessage(improvedMessage);
            toast({ title: 'Text mit KI verbessert!' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'KI-Verbesserung fehlgeschlagen', description: 'Der Text konnte nicht verbessert werden.' });
        } finally {
            setIsImproving(false);
        }
    };

    const handleSendNewsletter = () => {
        if (!subject || !message) {
            toast({ variant: 'destructive', title: 'Betreff und Nachricht sind erforderlich.' });
            return;
        }
        if (selectedCustomers.length === 0) {
            toast({ variant: 'destructive', title: 'Keine Kunden ausgewählt.' });
            return;
        }
        startSendingTransition(async () => {
            const result = await sendNewsletter(selectedCustomers, subject, message);
            if (result.success) {
                toast({ title: "Newsletter gesendet!", description: result.message });
                setSubject('');
                setMessage('');
                setSelectedCustomers([]);
            } else {
                toast({ variant: 'destructive', title: 'Senden fehlgeschlagen', description: result.error });
            }
        });
    }

    const toggleCategory = (category: Category) => {
        setSelectedCategories(prev => 
            prev.some(c => c.id === category.id) 
            ? prev.filter(c => c.id !== category.id)
            : [...prev, category]
        );
        setSelectedCustomers([]);
    };

  return (
      <div className="space-y-6">
            <div>
                <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 mb-4">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="shrink-0 w-full sm:w-auto" size="sm">
                                <Filter className="mr-2 h-4 w-4" />
                                Nach Käufen filtern
                                {selectedCategories.length > 0 && <Badge variant="secondary" className="ml-2">{selectedCategories.length}</Badge>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="end">
                            <Command>
                            <CommandInput placeholder="Kategorie suchen..." />
                            <CommandList>
                            <CommandEmpty>Keine Kategorien gefunden.</CommandEmpty>
                            <CommandGroup>
                                {categories.map((category) => (
                                <CommandItem
                                    key={category.id}
                                    onSelect={() => toggleCategory(category)}
                                >
                                    <Checkbox className={cn("mr-2", selectedCategories.some(c => c.id === category.id) ? "bg-primary text-primary-foreground" : "")} checked={selectedCategories.some(c => c.id === category.id)} />
                                    <span>{getLang(category.name, lang)}</span>
                                </CommandItem>
                                ))}
                            </CommandGroup>
                            </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="bg-card border rounded-lg overflow-hidden">
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                                        onCheckedChange={handleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Level</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-right">Gesamtausgaben</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {filteredCustomers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                        {selectedCategories.length > 0 ? "Keine Kunden für diese Auswahl gefunden." : "Keine Kunden vorhanden."}
                                    </TableCell>
                                </TableRow>
                            )}
                            {filteredCustomers.map((customer) => {
                                const customerOrders = orders.filter(o => o.userId === customer.id);
                                const totalSpent = customerOrders.reduce((sum, o) => sum + (o.total ?? 0), 0);
                                const loyaltyData = customer.loyaltyStamps ? { points: customer.loyaltyStamps * 15 } : { points: 0 };
                                const loyaltyTier = loyaltyData ? getLoyaltyTier(loyaltyData.points) : loyaltyTiers.bronze;

                                return (
                                    <TableRow key={customer.id} data-state={selectedCustomers.includes(customer.id) ? "selected" : undefined}>
                                        <TableCell>
                                            <Checkbox checked={selectedCustomers.includes(customer.id)} onCheckedChange={(checked) => handleSelectCustomer(customer.id, !!checked)} />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <Link href={`/admin/customers/${customer.id}`} className="hover:underline">{customer.name}</Link>
                                        </TableCell>
                                        <TableCell>
                                        <Badge variant="outline" className={`border-0 ${loyaltyTier.color.replace('text-', 'bg-').replace('600', '100')} ${loyaltyTier.color}`}>
                                            <Trophy className="w-3 h-3 mr-1.5" />
                                            {loyaltyTier.name}
                                        </Badge>
                                        </TableCell>
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell className="text-right">€{totalSpent.toFixed(2)}</TableCell>
                                    </TableRow>
                                )
                            })}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="block md:hidden space-y-3 p-4">
                         {filteredCustomers.length === 0 && (
                            <div className="text-center py-10 text-muted-foreground">
                                {selectedCategories.length > 0 ? "Keine Kunden für diese Auswahl gefunden." : "Keine Kunden vorhanden."}
                            </div>
                        )}
                        {filteredCustomers.map(customer => (
                            <CustomerCard
                                key={customer.id}
                                customer={customer}
                                isSelected={selectedCustomers.includes(customer.id)}
                                onSelect={handleSelectCustomer}
                                orders={orders}
                                products={products}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Newsletter-Editor</CardTitle>
                    <CardDescription>Erstellen Sie eine Nachricht und senden Sie sie an die ausgewählte Kundengruppe.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input placeholder="Betreff des Newsletters" value={subject} onChange={e => setSubject(e.target.value)} />
                    <Textarea placeholder="Schreiben Sie hier Ihre Newsletter-Nachricht..." className="min-h-[160px]" value={message} onChange={e => setMessage(e.target.value)} />
                     <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t">
                        <p className="text-xs text-muted-foreground flex items-start gap-2">
                            <FileWarning className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>Ihre Nachricht wird von einem KI-Dienst zur Verbesserung verarbeitet. Geben Sie keine sensiblen Daten ein.</span>
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <Button variant="outline" onClick={handleImproveText} disabled={isImproving} className="w-full sm:w-auto">
                                {isImproving ? <RotateCw className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                Mit KI verbessern
                            </Button>
                            <Button onClick={handleSendNewsletter} disabled={selectedCustomers.length === 0 || isSending} className="w-full sm:w-auto">
                                {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                Senden an {selectedCustomers.length} Kunde(n)
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
      </div>
  );
}

    