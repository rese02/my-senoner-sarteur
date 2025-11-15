import { PageHeader } from "@/components/common/PageHeader";
import { mockCategories, mockProducts } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2 } from "lucide-react";

export default function AdminProductsPage() {
  return (
    <>
      <PageHeader title="Products" description="Manage your product categories and items." />
      
      {/* This would be a form to add a new category */}

      <div className="space-y-8">
        {mockCategories.map((category) => {
          const productsInCategory = mockProducts.filter(p => p.categoryId === category.id);
          return (
            <Card key={category.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{category.name}</CardTitle>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm"><PlusCircle className="w-4 h-4 mr-2" />Add Product</Button>
                    <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardHeader>
              <CardContent>
                {productsInCategory.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {productsInCategory.map(product => (
                       <Card key={product.id} className="overflow-hidden">
                        <div className="relative aspect-[4/3] bg-muted">
                           <Image src={product.imageUrl} alt={product.name} fill className="object-cover" data-ai-hint={product.imageHint} />
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <div className="flex items-baseline justify-between mt-2">
                                <p className="text-xl font-bold text-primary">€{product.price.toFixed(2)}</p>
                                <span className="text-sm text-muted-foreground">/ {product.unit}</span>
                            </div>
                            {product.availabilityDay && <Badge variant="secondary" className="mt-2">{product.availabilityDay} only</Badge>}
                        </CardContent>
                       </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground bg-secondary/50 rounded-md">
                    <p>No products in this category yet.</p>
                    <Button variant="link" className="mt-2">Add the first product</Button>
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
