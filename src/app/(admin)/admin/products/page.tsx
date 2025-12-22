
'use server';
import { ProductsClient } from './client';
import { getProductsPageData } from '@/app/actions/product.actions';
import { PageHeader } from '@/components/common/PageHeader';
import { LanguageProvider } from '@/components/providers/LanguageProvider';

// This is now a Server Component, fetching data directly.
export default async function ProductsPage() {
  // Data is fetched once on the server when the page is rendered.
  const { products, categories } = await getProductsPageData();

  return (
    <LanguageProvider>
        <PageHeader title="Produkte" description="Verwalten Sie Ihre Produktkategorien und Artikel." />
        <ProductsClient
          initialProducts={products}
          initialCategories={categories}
        />
    </LanguageProvider>
  );
}
