

import { PageHeader } from "@/components/common/PageHeader";
import { mockCategories, mockProducts, mockAppConfig } from "@/lib/mock-data";
import { ProductCard } from "./_components/ProductCard";
import { Cart } from "./_components/Cart";
import { RecipeCard } from "./_components/RecipeCard";
import type { Recipe } from "@/lib/types";
import { ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

// This would typically be a server-side fetch from a database.
async function getRecipeData(): Promise<Recipe> {
    // Simulating an async operation
    return Promise.resolve(mockAppConfig.recipeOfTheWeek);
}

export default async function CustomerDashboardPage() {
    const recipe = await getRecipeData();

    return (
        <div className="container mx-auto p-0">
            <div className="hidden md:block">
                <PageHeader title="Pre-Order Specials" description="Order your favorite items in advance." />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <div className="space-y-8">
                        <div className="px-4 md:px-0">
                            <RecipeCard recipe={recipe} />
                        </div>
                        {mockCategories.map(category => (
                             <section key={category.id}>
                                <h2 className="text-2xl font-bold mb-4 px-4 md:px-0">{category.name}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-0">
                                    {mockProducts.filter(p => p.categoryId === category.id && p.isAvailable).map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
                
                <div className="hidden lg:block">
                     <div className="sticky top-24">
                        <Cart />
                     </div>
                </div>
            </div>
            
            {/* Mobile Cart Button & Sheet */}
            <div className="lg:hidden fixed bottom-20 right-4 z-20">
                 <Sheet>
                    <SheetTrigger asChild>
                        <Button size="lg" className="rounded-full h-16 w-16 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground">
                            <ShoppingCart className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[80vh] flex flex-col rounded-t-lg p-0">
                        <Cart />
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
