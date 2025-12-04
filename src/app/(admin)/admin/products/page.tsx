'use client';
import { ProductsClient } from './client';
import { getProductsPageData } from '@/app/actions/product.actions';
import { useState, useEffect } from 'react';
import type { Product, Category } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function ProductsPage() {
  const [initialProducts, setInitialProducts] = useState<Product[]>([]);
  const [initialCategories, setInitialCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { products, categories } = await getProductsPageData();
        setInitialProducts(products);
        setInitialCategories(categories);
      } catch (error) {
        console.error("Failed to fetch products data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ProductsClient
      initialProducts={initialProducts}
      initialCategories={initialCategories}
    />
  );
}
