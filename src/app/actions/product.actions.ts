'use server';

import 'server-only';
import { adminDb } from '@/lib/firebase-admin';
import { getSession } from '@/lib/session';
import { toPlainObject } from '@/lib/utils';
import type { Product, Category, Story, Recipe } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const ProductSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long."}),
  price: z.number().positive({ message: "Price must be a positive number."}),
  unit: z.string().min(1, { message: "Unit is required."}),
  imageUrl: z.string().url({ message: "A valid image URL is required."}).or(z.literal('')),
  imageHint: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(['product', 'package']),
  packageContent: z.array(z.object({
    item: z.string(),
    amount: z.string(),
  })).optional(),
});


// Helper to check for Admin role
async function isAdmin() {
  const session = await getSession();
  if (session?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required.');
  }
  return true;
}

// Get all products and categories for the dashboard page
export async function getDashboardData() {
  try {
    const productsSnapshot = await adminDb
      .collection('products')
      .where('isAvailable', '==', true)
      .get();
    const categoriesSnapshot = await adminDb
      .collection('categories')
      .orderBy('name')
      .get();
    const storiesSnapshot = await adminDb.collection('stories').limit(10).get();
    const recipeDoc = await adminDb.collection('content').doc('recipe_of_the_week').get();


    const products = productsSnapshot.docs.map((doc) =>
      toPlainObject({ id: doc.id, ...doc.data() } as Product)
    );
    const categories = categoriesSnapshot.docs.map((doc) =>
      toPlainObject({ id: doc.id, ...doc.data() } as Category)
    );
    const stories = storiesSnapshot.docs.map((doc) =>
      toPlainObject({ id: doc.id, ...doc.data() } as Story)
    ).filter(story => new Date(story.expiresAt || 0) > new Date());
    
    const recipe = recipeDoc.exists ? toPlainObject(recipeDoc.data() as Recipe) : getFallbackRecipe();

    return { products, categories, stories, recipe };
  } catch (error) {
    // Return empty arrays on failure to prevent crashes
    return {
      products: [],
      categories: [],
      stories: [],
      recipe: getFallbackRecipe(),
    };
  }
}


// Get all products and categories for the admin products page
export async function getProductsPageData() {
  await isAdmin();
  try {
    const productsSnapshot = await adminDb
      .collection('products')
      .orderBy('name')
      .get();
    const categoriesSnapshot = await adminDb
      .collection('categories')
      .orderBy('name')
      .get();

    const products = productsSnapshot.docs.map((doc) =>
      toPlainObject({ ...doc.data(), id: doc.id } as Product)
    );

    const categories = categoriesSnapshot.docs.map((doc) =>
      toPlainObject({ ...doc.data(), id: doc.id } as Category)
    );
    return { products, categories };
  } catch (error) {
    throw new Error("Failed to fetch products page data.");
  }
}

// Toggle product availability
export async function toggleProductAvailability(
  productId: string,
  isAvailable: boolean
): Promise<{ isAvailable: boolean }> {
  await isAdmin();
  const productRef = adminDb.collection('products').doc(productId);
  await productRef.update({ isAvailable });
  revalidatePath('/admin/products');
  revalidatePath('/dashboard');
  return { isAvailable };
}

// Create a new category
export async function createCategory(name: string): Promise<Category> {
  await isAdmin();
  if (!name.trim()) {
    throw new Error('Category name cannot be empty.');
  }
  const categoryCollection = adminDb.collection('categories');
  const docRef = await categoryCollection.add({ name });
  revalidatePath('/admin/products');
  return { id: docRef.id, name };
}

// Delete a category and all its products
export async function deleteCategory(categoryId: string) {
  await isAdmin();
  const batch = adminDb.batch();

  const categoryRef = adminDb.collection('categories').doc(categoryId);
  batch.delete(categoryRef);

  const productsQuery = adminDb
    .collection('products')
    .where('categoryId', '==', categoryId);
  const productsSnapshot = await productsQuery.get();
  productsSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  revalidatePath('/admin/products');
  revalidatePath('/dashboard');
}

// Update a product
export async function updateProduct(productData: Product): Promise<Product> {
  await isAdmin();
  const { id, ...data } = productData;

  const validation = ProductSchema.safeParse(data);

  if (!validation.success) {
    console.error("Zod Validation Error:", validation.error.flatten().fieldErrors);
    throw new Error("Invalid product data provided.");
  }

  const productRef = adminDb.collection('products').doc(id);
  await productRef.update(toPlainObject(validation.data));
  revalidatePath('/admin/products');
  revalidatePath('/dashboard');
  return toPlainObject({ id, ...validation.data } as Product);
}

// Create a new product
export async function createProduct(
  productData: Omit<Product, 'id'>
): Promise<Product> {
  await isAdmin();
  
  const validation = ProductSchema.safeParse(productData);

  if (!validation.success) {
     console.error("Zod Validation Error:", validation.error.flatten().fieldErrors);
     throw new Error("Invalid product data provided.");
  }
  
  const productsCollection = adminDb.collection('products');

  const dataToSave = {
    ...toPlainObject(validation.data),
    categoryId: productData.categoryId,
    isAvailable: productData.isAvailable,
    createdAt: new Date().toISOString(),
  };

  const docRef = await productsCollection.add(dataToSave);

  revalidatePath('/admin/products');
  revalidatePath('/dashboard');

  const newProduct: Product = { id: docRef.id, ...dataToSave } as Product;
  return toPlainObject(newProduct);
}

// Delete a product
export async function deleteProduct(productId: string) {
  await isAdmin();
  const productRef = adminDb.collection('products').doc(productId);
  await productRef.delete();
  revalidatePath('/admin/products');
  revalidatePath('/dashboard');
}


function getFallbackRecipe(): Recipe {
    return {
        title: 'Kein Rezept verfügbar',
        subtitle: 'Bitte im Admin-Bereich ein Rezept der Woche festlegen.',
        image: 'https://picsum.photos/seed/recipefallback/1080/800',
        imageHint: 'empty plate',
        description: 'Derzeit ist kein Rezept der Woche hinterlegt.',
        ingredients: [],
        instructions: ''
    };
}
