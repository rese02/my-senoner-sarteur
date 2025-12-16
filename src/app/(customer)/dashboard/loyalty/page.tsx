
'use server';

import { getSession } from "@/lib/session";
import { LoyaltyClient } from './client';
import { PageHeader } from "@/components/common/PageHeader";

export default async function LoyaltyPage() {
    const user = await getSession();

    if (!user) {
        return <PageHeader title="Nicht angemeldet" description="Bitte melden Sie sich an, um Ihre Treuekarte zu sehen." />;
    }
    
    const loyaltyPoints = user.loyaltyPoints || 0;

    return (
        <LoyaltyClient uid={user.userId} points={loyaltyPoints} />
    );
}
