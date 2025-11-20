'use client';

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockUsers, mockOrders } from "@/lib/mock-data";
import type { LoyaltyData, User } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Send, RotateCw, Trophy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { improveTextWithAI } from "@/ai/flows/improve-newsletter-text";
import { generateSeasonalPromotions } from "@/ai/flows/generate-seasonal-promotions";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { getLoyaltyTier, loyaltyTiers } from "@/lib/loyalty";

export default function AdminCustomersPage() {
    const customers = mockUsers.filter(u => u.role === 'customer');
    const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isImproving, setIsImproving] = useState(false);
    const { toast } = useToast();
    const [promotions, setPromotions] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSelectAll = (checked: boolean | 'indeterminate') => {
        if (checked === true) {
            setSelectedCustomers(customers.map(c => c.id));
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
        if (!message) {
            toast({ variant: 'destructive', title: 'Die Nachricht ist leer.' });
            return;
        }
        setIsImproving(true);
        try {
            const { improvedText } = await improveTextWithAI({ text: message });
            setMessage(improvedText);
            toast({ title: 'Text mit KI verbessert!' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'KI-Verbesserung fehlgeschlagen', description: 'Der Text konnte nicht verbessert werden.' });
        } finally {
            setIsImproving(false);
        }
    };

    const handleGeneratePromotions = async () => {
        setIsGenerating(true);
        try {
            const { promotionIdeas } = await generateSeasonalPromotions({
                season: 'Herbst',
                availableProducts: ['Sushi', 'Frischer Fisch', 'Regionaler Käse', 'Speck'],
                marketTrends: 'Fokus auf lokale und Bio-Produkte, gemütliches Comfort-Food.'
            });
            setPromotions(promotionIdeas);
            toast({ title: 'Neue Promotion-Ideen generiert!' });
        } catch(error) {
             toast({ variant: 'destructive', title: 'KI-Generierung fehlgeschlagen', description: 'Promotionen konnten nicht generiert werden.' });
        } finally {
            setIsGenerating(false);
        }
    };

  return (
    <>
      <PageHeader title="Kunden & Marketing" description="Engagieren Sie sich mit Ihren Kunden und führen Sie Marketingkampagnen durch." />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Kundenliste</CardTitle>
                    <CardDescription>Wählen Sie Kunden für Ihre Newsletter aus.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selectedCustomers.length === customers.length && customers.length > 0 ? true : (selectedCustomers.length > 0 ? 'indeterminate' : false) }
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Kunde seit</TableHead>
                            <TableHead className="text-center">Bestellungen</TableHead>
                            <TableHead className="text-right">Gesamtausgaben</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {customers.map((customer) => {
                            const customerOrders = mockOrders.filter(o => o.userId === customer.id);
                            const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);
                            const loyaltyData = customer.loyaltyData;
                            const loyaltyTier = loyaltyData ? getLoyaltyTier(loyaltyData.points) : loyaltyTiers.bronze;

                            return (
                                <TableRow key={customer.id} data-state={selectedCustomers.includes(customer.id) && "selected"}>
                                    <TableCell>
                                        <Checkbox checked={selectedCustomers.includes(customer.id)} onCheckedChange={(checked) => handleSelectCustomer(customer.id, !!checked)} />
                                    </TableCell>
                                    <TableCell className="font-medium">{customer.name}</TableCell>
                                    <TableCell>
                                       <Badge variant="outline" className={`border-0 ${loyaltyTier.color.replace('text-', 'bg-').replace('500', '100')} ${loyaltyTier.color}`}>
                                          <Trophy className="w-3 h-3 mr-1.5" />
                                          {loyaltyTier.name}
                                       </Badge>
                                    </TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.customerSince ? format(new Date(customer.customerSince), "dd.MM.yyyy") : 'N/A'}</TableCell>
                                    <TableCell className="text-center">{customerOrders.length}</TableCell>
                                    <TableCell className="text-right">€{totalSpent.toFixed(2)}</TableCell>
                                </TableRow>
                            )
                        })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Newsletter-Editor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input placeholder="Betreff des Newsletters" value={subject} onChange={e => setSubject(e.target.value)} />
                    <Textarea placeholder="Schreiben Sie hier Ihre Newsletter-Nachricht..." className="min-h-[200px]" value={message} onChange={e => setMessage(e.target.value)} />
                     <p className="text-xs text-muted-foreground">Ihre Nachricht wird von einem KI-Dienst zur Verbesserung verarbeitet. Bitte geben Sie keine sensiblen Daten ein.</p>
                    <div className="flex justify-between items-center">
                        <Button variant="outline" onClick={handleImproveText} disabled={isImproving}>
                            {isImproving ? <RotateCw className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                            Mit KI verbessern
                        </Button>
                        <Button disabled={selectedCustomers.length === 0}>
                            <Send className="mr-2 h-4 w-4" />
                            Senden an {selectedCustomers.length} Kunde(n)
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>KI Promotion-Ideen</CardTitle>
                    <CardDescription>Erhalten Sie saisonale Marketingideen von der KI.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full" onClick={handleGeneratePromotions} disabled={isGenerating}>
                        {isGenerating ? <RotateCw className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        Ideen generieren
                    </Button>
                    {promotions.length > 0 && (
                        <div className="mt-4 space-y-3 text-sm">
                            <h4 className="font-semibold">Generierte Ideen:</h4>
                            <ul className="list-disc list-inside bg-secondary/50 p-4 rounded-md space-y-2">
                                {promotions.map((promo, i) => <li key={i}>{promo}</li>)}
                            </ul>
                        </div>
                    )}
                     <p className="text-xs text-muted-foreground mt-4">Ihre Eingaben werden von einem KI-Dienst zur Ideengenerierung verarbeitet.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}
