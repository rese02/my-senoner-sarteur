'use client';
import { PageHeader } from "@/components/common/PageHeader";
import { mockCategories, mockProducts } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import type { Product } from "@/lib/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const handleAvailabilityToggle = (productId: string) => {
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p
      )
    );
  };

  return (
    <>
      <PageHeader title="Produkte" description="Verwalten Sie Ihre Produktkategorien und Artikel." />
      
      {/* This would be a form to add a new category */}

      <div className="space-y-8">
        {mockCategories.map((category) => {
          const productsInCategory = products.filter(p => p.categoryId === category.id);
          return (
            <Card key={category.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{category.name}</CardTitle>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm"><PlusCircle className="mr-2" />Produkt hinzufügen</Button>
                    <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardHeader>
              <CardContent>
                {productsInCategory.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {productsInCategory.map(product => (
                       <Card key={product.id} className="overflow-hidden flex flex-col">
                        <div className="relative aspect-[4/3] bg-muted">
                           <Image src={product.imageUrl} alt={product.name} fill className="object-cover" data-ai-hint={product.imageHint} />
                        </div>
                        <CardContent className="p-4 flex flex-col flex-1">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <div className="flex items-baseline justify-between mt-2">
                                <p className="text-xl font-bold text-primary">€{product.price.toFixed(2)}</p>
                                <span className="text-sm text-muted-foreground">/ {product.unit}</span>
                            </div>
                            {product.availabilityDay && <Badge variant="secondary" className="mt-2 w-fit">{product.availabilityDay} only</Badge>}
                            <div className="mt-4 text-xs text-muted-foreground">
                                <span>Bestellt (30T): </span>
                                <span className="font-bold">{product.timesOrderedLast30Days ?? 0}</span>
                            </div>
                             <div className="mt-auto pt-4 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Switch 
                                        id={`availability-${product.id}`} 
                                        checked={product.isAvailable} 
                                        onCheckedChange={() => handleAvailabilityToggle(product.id)}
                                    />
                                    <Label htmlFor={`availability-${product.id}`} className="text-xs">
                                        {product.isAvailable ? "Verfügbar" : "Inaktiv"}
                                    </Label>
                                </div>
                                <div className="flex items-center">
                                    <Button variant="ghost" size="sm">
                                        <Edit className="mr-2"/>
                                        Bearbeiten
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive">
                                        <Trash2 className="w-4 h-4"/>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                       </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground bg-secondary/50 rounded-md">
                    <p>Noch keine Produkte in dieser Kategorie.</p>
                    <Button variant="link" className="mt-2">Fügen Sie das erste Produkt hinzu</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  );
}
