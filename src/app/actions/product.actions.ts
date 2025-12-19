
'use server';

import 'server-only';
import { adminDb } from '@/lib/firebase-admin';
import { getSession } from '@/lib/session';
import { toPlainObject } from '@/lib/utils';
import type { Product, Category, Story, Recipe, Order, User } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const ProductSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long."}),
  price: z.preprocess((val) => Number(val), z.number().positive({ message: "Price must be a positive number."})),
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
async function requireAdmin() {
  const session = await getSession();
  if (session?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required.');
  }
}

// Get all products and categories for the customer dashboard page
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

    // Check for user's open orders
    const session = await getSession();
    let openOrder: Order | null = null;
    if (session?.id) {
        const openStatuses = ['new', 'picking', 'ready', 'ready_for_delivery'];
        const userOrdersSnap = await adminDb.collection('orders')
            .where('userId', '==', session.id)
            .where('status', 'in', openStatuses)
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();
            
        if (!userOrdersSnap.empty) {
            openOrder = toPlainObject({id: userOrdersSnap.docs[0].id, ...userOrdersSnap.docs[0].data()} as Order);
        }
    }


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

    return { products, categories, stories, recipe, openOrder };
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    // Return empty arrays on failure to prevent crashes
    return {
      products: [],
      categories: [],
      stories: [],
      recipe: getFallbackRecipe(),
      openOrder: null
    };
  }
}

// Get all products and categories for the admin products page
export async function getProductsPageData() {
  await requireAdmin();
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
    console.error("Failed to fetch products page data:", error);
    throw new Error("Failed to fetch products page data.");
  }
}

// Toggle product availability
export async function toggleProductAvailability(
  productId: string,
  isAvailable: boolean
): Promise<{ isAvailable: boolean }> {
  await requireAdmin();
  const validatedId = z.string().min(1).parse(productId);
  const validatedAvailability = z.boolean().parse(isAvailable);

  const productRef = adminDb.collection('products').doc(validatedId);
  await productRef.update({ isAvailable: validatedAvailability });
  revalidatePath('/admin/products');
  revalidatePath('/dashboard');
  return { isAvailable: validatedAvailability };
}

// Create a new category
export async function createCategory(name: string): Promise<Category> {
  await requireAdmin();
  const validatedName = z.string().trim().min(1, 'Category name cannot be empty.').parse(name);
  
  const categoryCollection = adminDb.collection('categories');
  const docRef = await categoryCollection.add({ name: validatedName });
  revalidatePath('/admin/products');
  return { id: docRef.id, name: validatedName };
}

// Delete a category and all its products
export async function deleteCategory(categoryId: string) {
  await requireAdmin();
  const validatedId = z.string().min(1).parse(categoryId);

  const batch = adminDb.batch();

  const categoryRef = adminDb.collection('categories').doc(validatedId);
  batch.delete(categoryRef);

  const productsQuery = adminDb
    .collection('products')
    .where('categoryId', '==', validatedId);
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
  await requireAdmin();
  const { id, ...data } = productData;
  const validatedId = z.string().min(1).parse(id);

  const validation = ProductSchema.safeParse(data);

  if (!validation.success) {
    console.error("Zod Validation Error:", validation.error.flatten().fieldErrors);
    throw new Error("Invalid product data provided.");
  }

  const productRef = adminDb.collection('products').doc(validatedId);
  await productRef.update(toPlainObject(validation.data));
  revalidatePath('/admin/products');
  revalidatePath('/dashboard');
  return toPlainObject({ id: validatedId, ...validation.data } as Product);
}

// Create a new product
export async function createProduct(
  productData: Omit<Product, 'id'>
): Promise<Product> {
  await requireAdmin();
  
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

  const newProduct: Product = { id: docRef.id, ...dataToSave } as unknown as Product;
  return toPlainObject(newProduct);
}

// Delete a product
export async function deleteProduct(productId: string) {
  await requireAdmin();
  const validatedId = z.string().min(1).parse(productId);
  const productRef = adminDb.collection('products').doc(validatedId);
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
