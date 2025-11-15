import { PageHeader } from "@/components/common/PageHeader";
import { mockCategories, mockProducts } from "@/lib/mock-data";
import { ProductCard } from "./_components/ProductCard";
import { Cart } from "./_components/Cart";
import { RecipeCard } from "./_components/RecipeCard";

export default function CustomerDashboardPage() {
    return (
        <div className="container mx-auto p-0 md:p-4">
            <div className="hidden md:block">
                <PageHeader title="Pre-Order Specials" description="Order your favorite items in advance." />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="space-y-8">
                        <div className="px-4 md:px-0">
                            <RecipeCard />
                        </div>
                        {mockCategories.map(category => (
                             <section key={category.id}>
                                <h2 className="text-2xl font-bold mb-4 px-4 md:px-0">{category.name}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-0">
                                    {mockProducts.filter(p => p.categoryId === category.id).map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
                
                <div className="hidden lg:block">
                     <div className="sticky top-8">
                        <Cart />
                     </div>
                </div>
            </div>
        </div>
    );
}
