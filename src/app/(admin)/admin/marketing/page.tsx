'use server';

import { PageHeader } from "@/components/common/PageHeader";
import { getMarketingPageData } from "@/app/actions/marketing.actions";
import { MarketingClient } from './client';

export default async function MarketingPage() {
    const { stories, plannerEvents, products, recipe } = await getMarketingPageData();

    return (
        <div>
            <PageHeader title="Marketing & Events" description="Verwalten Sie hier Inhalte, die auf der Kundenseite angezeigt werden." />
            <MarketingClient 
                initialStories={stories}
                initialPlannerEvents={plannerEvents}
                availableProducts={products}
                initialRecipe={recipe}
            />
        </div>
    );
}
