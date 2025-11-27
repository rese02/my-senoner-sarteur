
'use server';

import { initializeFirebase } from '@/firebase';
import type { Product, Category } from '@/lib/types';
import { getSession } from '@/lib/session';
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc, writeBatch, query, where } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

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
    const { firestore } = initializeFirebase();

    const productsQuery = collection(firestore, "products");
    const categoriesQuery = collection(firestore, "categories");

    const productSnapshot = await getDocs(productsQuery);
    const categorySnapshot = await getDocs(categoriesQuery);
    
    // Manually create plain objects to ensure serializability
    const products = productSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            price: data.price,
            unit: data.unit,
            imageUrl: data.imageUrl,
            imageHint: data.imageHint,
            categoryId: data.categoryId,
            description: data.description,
            availabilityDay: data.availabilityDay,
            isAvailable: data.isAvailable,
            timesOrderedLast30Days: data.timesOrderedLast30Days || 0,
            type: data.type,
            packageContent: data.packageContent || [],
        } as Product;
    });

    const categories = categorySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name
        } as Category;
    });

    return { products, categories };
}

// Toggle product availability
export async function toggleProductAvailability(productId: string, isAvailable: boolean) {
    await isAdmin();
    const { firestore } = initializeFirebase();
    const productRef = doc(firestore, "products", productId);
    await updateDoc(productRef, { isAvailable });
    revalidatePath('/admin/products');
}

// Create a new category
export async function createCategory(name: string): Promise<Category> {
    await isAdmin();
    const { firestore } = initializeFirebase();
    const categoryCollection = collection(firestore, "categories");
    const docRef = await addDoc(categoryCollection, { name });
    revalidatePath('/admin/products');
    return { id: docRef.id, name };
}

// Delete a category and all its products
export async function deleteCategory(categoryId: string) {
    await isAdmin();
    const { firestore } = initializeFirebase();
    const batch = writeBatch(firestore);

    // Delete category document
    const categoryRef = doc(firestore, "categories", categoryId);
    batch.delete(categoryRef);

    // Find and delete all products in this category
    const productsQuery = query(collection(firestore, "products"), where("categoryId", "==", categoryId));
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
    const { firestore } = initializeFirebase();
    const { id, ...data } = productData;
    const productRef = doc(firestore, "products", id);
    await updateDoc(productRef, data);
    revalidatePath('/admin/products');
}

// Create a new product
export async function createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    await isAdmin();
    const { firestore } = initializeFirebase();
    const productsCollection = collection(firestore, "products");
    const docRef = await addDoc(productsCollection, productData);
    revalidatePath('/admin/products');
    return { id: docRef.id, ...productData };
}

// Delete a product
export async function deleteProduct(productId: string) {
    await isAdmin();
    const { firestore } = initializeFirebase();
    const productRef = doc(firestore, "products", productId);
    await deleteDoc(productRef);
    revalidatePath('/admin/products');
}
