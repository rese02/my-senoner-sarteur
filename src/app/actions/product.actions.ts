'use server';

import 'server-only';
import { adminDb } from '@/lib/firebase-admin';
import { getSession } from '@/lib/session';
import { toPlainObject } from '@/lib/utils';
import type { Product, Category } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { doc, deleteDoc, writeBatch, query, where } from 'firebase/firestore';


// Helper to check for Admin role
async function isAdmin() {
    const session = await getSession();
    if (session?.role !== 'admin') {
        throw new Error("Unauthorized: Admin access required.");
    }
    return true;
}

// Toggle product availability
export async function toggleProductAvailability(productId: string, isAvailable: boolean): Promise<{isAvailable: boolean}> {
    await isAdmin();
    const productRef = adminDb.collection("products").doc(productId);
    await productRef.update({ isAvailable });
    revalidatePath('/admin/products');
    revalidatePath('/dashboard');
    return { isAvailable };
}

// Create a new category
export async function createCategory(name: string): Promise<Category> {
    await isAdmin();
     if (!name.trim()) {
        throw new Error("Category name cannot be empty.");
    }
    const categoryCollection = adminDb.collection("categories");
    const docRef = await categoryCollection.add({ name });
    revalidatePath('/admin/products');
    return { id: docRef.id, name };
}

// Delete a category and all its products
export async function deleteCategory(categoryId: string) {
    await isAdmin();
    const batch = adminDb.batch();

    // Delete category document
    const categoryRef = adminDb.collection("categories").doc(categoryId);
    batch.delete(categoryRef);

    // Find and delete all products in this category
    const productsQuery = adminDb.collection("products").where("categoryId", "==", categoryId);
    const productsSnapshot = await productsQuery.get();
    productsSnapshot.forEach(doc => {
        batch.delete(doc.ref);
    });

    await batch.commit();
    revalidatePath('/admin/products');
    revalidatePath('/dashboard');
}

// Update a product
export async function updateProduct(productData: Product) {
    await isAdmin();
    const { id, ...data } = productData;
    const productRef = adminDb.collection("products").doc(id);
    // Ensure numeric price
    data.price = Number(data.price) || 0;
    await productRef.update(toPlainObject(data));
    revalidatePath('/admin/products');
    revalidatePath('/dashboard');
}

// Create a new product
export async function createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    await isAdmin();
    const productsCollection = adminDb.collection("products");
    
    const dataToSave = {
        ...toPlainObject(productData),
        createdAt: new Date().toISOString(),
        price: Number(productData.price) || 0, // Ensure price is a number
    };

    const docRef = await productsCollection.add(dataToSave);
    
    revalidatePath('/admin/products');
    revalidatePath('/dashboard');

    const newProduct: Product = { id: docRef.id, ...productData };
    return toPlainObject(newProduct);
}

// Delete a product
export async function deleteProduct(productId: string) {
    await isAdmin();
    const productRef = adminDb.collection("products").doc(productId);
    await productRef.delete();
    revalidatePath('/admin/products');
    revalidatePath('/dashboard');
}
