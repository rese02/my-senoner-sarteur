
'use server';

import { initializeFirebase } from '@/firebase';
import type { Product, Category } from '@/lib/types';
import { getSession } from '@/lib/session';
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc, writeBatch, query, where } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { toPlainObject } from '@/lib/utils';
import { adminDb } from '@/lib/firebase-admin';

// Helper to check for Admin role
async function isAdmin() {
    const session = await getSession();
    if (session?.role !== 'admin') {
        throw new Error("Unauthorized: Admin access required.");
    }
    return true;
}

// Fetch all products and categories for the admin dashboard
export async function getAdminDashboardData() {
    await isAdmin();
    
    const productsQuery = collection(adminDb, "products");
    const categoriesQuery = collection(adminDb, "categories");

    const productSnapshot = await getDocs(productsQuery);
    const categorySnapshot = await getDocs(categoriesQuery);
    
    const products = productSnapshot.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Product));
    const categories = categorySnapshot.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Category));

    return { products, categories };
}

// Toggle product availability
export async function toggleProductAvailability(productId: string, isAvailable: boolean): Promise<{isAvailable: boolean}> {
    await isAdmin();
    const productRef = doc(adminDb, "products", productId);
    await updateDoc(productRef, { isAvailable });
    revalidatePath('/admin/products');
    return { isAvailable };
}

// Create a new category
export async function createCategory(name: string): Promise<Category> {
    await isAdmin();
    const categoryCollection = collection(adminDb, "categories");
    const docRef = await addDoc(categoryCollection, { name });
    revalidatePath('/admin/products');
    return { id: docRef.id, name };
}

// Delete a category and all its products
export async function deleteCategory(categoryId: string) {
    await isAdmin();
    const batch = writeBatch(adminDb);

    // Delete category document
    const categoryRef = doc(adminDb, "categories", categoryId);
    batch.delete(categoryRef);

    // Find and delete all products in this category
    const productsQuery = query(collection(adminDb, "products"), where("categoryId", "==", categoryId));
    const productsSnapshot = await getDocs(productsQuery);
    productsSnapshot.forEach(doc => {
        batch.delete(doc.ref);
    });

    await batch.commit();
    revalidatePath('/admin/products');
}

// Update a product
export async function updateProduct(productData: Product) {
    await isAdmin();
    const { id, ...data } = productData;
    const productRef = doc(adminDb, "products", id);
    await updateDoc(productRef, toPlainObject(data));
    revalidatePath('/admin/products');
}

// Create a new product
export async function createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    await isAdmin();
    const productsCollection = collection(adminDb, "products");
    const docRef = await addDoc(productsCollection, { ...toPlainObject(productData), createdAt: new Date() });
    revalidatePath('/admin/products');
    const newProduct = { id: docRef.id, ...productData } as Product;
    return toPlainObject(newProduct);
}

// Delete a product
export async function deleteProduct(productId: string) {
    await isAdmin();
    const productRef = doc(adminDb, "products", productId);
    await deleteDoc(productRef);
    revalidatePath('/admin/products');
}
