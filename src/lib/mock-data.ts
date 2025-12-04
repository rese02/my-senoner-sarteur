import type { User, Category, Product, Order, AppConfig, Story, PlannerEvent } from '@/lib/types';


// This is now only for fallback display if firestore fails.
export let mockAppConfig: AppConfig = {
    recipeOfTheWeek: {
        title: 'Frische Pfifferlinge mit Rahmsauce',
        subtitle: 'Ein herbstlicher Genuss in 20 Minuten',
        image: 'https://images.unsplash.com/photo-1731570226263-9ada7cf7928f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxjb29raW5nJTIwZGlzaHxlbnwwfHx8fDE3NjMyMjU3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        imageHint: 'cooking dish',
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
// These arrays are now populated by Firestore. We keep them here in case of DB connection issues
// on some pages that still rely on them.
export let mockUsers: User[] = [];
export let mockCategories: Category[] = [];
export let mockProducts: Product[] = [];
export let mockOrders: Order[] = [];
export let mockStories: Story[] = [];
export let mockPlannerEvents: PlannerEvent[] = [];
