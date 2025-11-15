'use client';

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockUsers, mockLoyaltyData } from "@/lib/mock-data";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Send, RotateCw } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { improveTextWithAI } from "@/ai/flows/improve-newsletter-text";
import { generateSeasonalPromotions } from "@/ai/flows/generate-seasonal-promotions";


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
            toast({ variant: 'destructive', title: 'Message is empty' });
            return;
        }
        setIsImproving(true);
        try {
            const { improvedText } = await improveTextWithAI({ text: message });
            setMessage(improvedText);
            toast({ title: 'Text improved with AI!' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'AI Improvement Failed', description: 'Could not improve the text.' });
        } finally {
            setIsImproving(false);
        }
    };

    const handleGeneratePromotions = async () => {
        setIsGenerating(true);
        try {
            const { promotionIdeas } = await generateSeasonalPromotions({
                season: 'Autumn',
                availableProducts: ['Sushi', 'Fresh Fish', 'Regional Cheese', 'Speck'],
                marketTrends: 'Focus on local and organic products, cozy comfort food.'
            });
            setPromotions(promotionIdeas);
            toast({ title: 'New promotion ideas generated!' });
        } catch(error) {
             toast({ variant: 'destructive', title: 'AI Generation Failed', description: 'Could not generate promotions.' });
        } finally {
            setIsGenerating(false);
        }
    };

  return (
    <>
      <PageHeader title="Customers & Marketing" description="Engage with your customers and run marketing campaigns." />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Customer List</CardTitle>
                    <CardDescription>Select customers to include in your newsletter.</CardDescription>
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
                            <TableHead>Email</TableHead>
                            <TableHead>Stamps</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {customers.map((customer) => {
                            const loyalty = mockLoyaltyData.find(l => l.userId === customer.id);
                            return (
                                <TableRow key={customer.id} data-state={selectedCustomers.includes(customer.id) && "selected"}>
                                    <TableCell>
                                        <Checkbox checked={selectedCustomers.includes(customer.id)} onCheckedChange={(checked) => handleSelectCustomer(customer.id, !!checked)} />
                                    </TableCell>
                                    <TableCell className="font-medium">{customer.name}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{loyalty?.stamps ?? 0}</TableCell>
                                </TableRow>
                            )
                        })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Newsletter Editor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input placeholder="Newsletter Subject" value={subject} onChange={e => setSubject(e.target.value)} />
                    <Textarea placeholder="Write your newsletter message here..." className="min-h-[200px]" value={message} onChange={e => setMessage(e.target.value)} />
                    <div className="flex justify-between items-center">
                        <Button variant="outline" onClick={handleImproveText} disabled={isImproving}>
                            {isImproving ? <RotateCw className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                            Improve with AI
                        </Button>
                        <Button disabled={selectedCustomers.length === 0}>
                            <Send className="mr-2 h-4 w-4" />
                            Send to {selectedCustomers.length} customer(s)
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>AI Promotion Ideas</CardTitle>
                    <CardDescription>Get seasonal marketing ideas from AI.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full" onClick={handleGeneratePromotions} disabled={isGenerating}>
                        {isGenerating ? <RotateCw className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        Generate Ideas
                    </Button>
                    {promotions.length > 0 && (
                        <div className="mt-4 space-y-3 text-sm">
                            <h4 className="font-semibold">Generated Ideas:</h4>
                            <ul className="list-disc list-inside bg-secondary/50 p-4 rounded-md space-y-2">
                                {promotions.map((promo, i) => <li key={i}>{promo}</li>)}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}
