'use server';

import { PageHeader } from "@/components/common/PageHeader";
import { getMarketingPageData, savePlannerEvent, saveStory, deletePlannerEvent, deleteStory } from "@/app/actions/marketing.actions";
import { MarketingClient } from './client';

export default async function MarketingPage() {
    const { stories, plannerEvents, products } = await getMarketingPageData();

    return (
        <div>
            <PageHeader title="Marketing & Events" description="Verwalten Sie hier Inhalte, die auf der Kundenseite angezeigt werden." />
            <MarketingClient 
                initialStories={stories}
                initialPlannerEvents={plannerEvents}
                availableProducts={products}
            />
        </div>
    );
}
