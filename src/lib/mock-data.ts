import type { User, Category, Product, Order, AppConfig, Story, PlannerEvent } from '@/lib/types';
import { PlaceHolderImages } from './placeholder-images';

// MOCK DATA IS NOW DEPRECATED AND WILL BE REPLACED BY FIRESTORE CALLS.
// Some data might be kept for fallback or initial structure reference.

const getImage = (id: string) => {
    let image = PlaceHolderImages.find(p => p.id === id);
    if (!image) {
        console.warn(`Placeholder image with id "${id}" not found. Using generic fallback.`);
        image = PlaceHolderImages.find(p => p.id === 'placeholder-general');
    }
    
    if (!image) {
        return { 
            imageUrl: `https://picsum.photos/seed/critical-fallback/600/400`, 
            imageHint: 'placeholder' 
        };
    }

    return {
        imageUrl: image.imageUrl,
        imageHint: image.imageHint,
    };
};

// This is now only for fallback display if firestore fails.
export let mockAppConfig: AppConfig = {
    recipeOfTheWeek: {
        title: 'Frische Pfifferlinge mit Rahmsauce',
        subtitle: 'Ein herbstlicher Genuss in 20 Minuten',
        image: getImage('recipe-of-the-week').imageUrl,
        imageHint: getImage('recipe-of-the-week').imageHint,
        description: 'Entdecken Sie eine neue köstliche Mahlzeitidee mit unseren besten saisonalen Produkten. Perfekt für einen gemütlichen Herbstabend.',
        ingredients: [
            '500g frische Pfifferlinge',
            '1 Zwiebel, fein gehackt',
            '2 EL Butter',
            '200ml Sahne',
            'Salz & Pfeffer',
            'Frische Petersilie, gehackt'
        ],
        instructions: `1. Pfifferlinge sorgfältig putzen (nicht waschen!).
2. Zwiebel in einer Pfanne mit Butter glasig dünsten.
3. Pfifferlinge hinzufügen und bei starker Hitze für 5-7 Minuten anbraten, bis sie goldbraun sind.
4. Mit Sahne ablöschen und die Hitze reduzieren. Einige Minuten köcheln lassen, bis die Sauce eindickt.
5. Mit Salz und Pfeffer abschmecken und die frische Petersilie unterrühren.
6. Passt hervorragend zu Semmelknödeln oder frischer Pasta.`
    },
    isWheelOfFortuneActive: true,
};

// Deprecated mock data arrays. Kept for reference, but should not be used in production code.
export const mockUsers: User[] = [];
export const mockCategories: Category[] = [];
export const mockProducts: Product[] = [];
export const mockOrders: Order[] = [];
export const mockStories: Story[] = [];
export const mockPlannerEvents: PlannerEvent[] = [];
