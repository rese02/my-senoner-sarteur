'use server';

import { PageHeader } from "@/components/common/PageHeader";
import { getSession } from "@/lib/session";
import { LoyaltyClient } from "./client";
import { Suspense } from "react";
import Loading from "./loading";


export default async function LoyaltyPage() {
    const user = await getSession();

    if (!user) {
        return <PageHeader title="Nicht angemeldet" description="Bitte melden Sie sich an, um Ihre Treuekarte zu sehen." />;
    }
    
    return (
        <Suspense fallback={<Loading />}>
            <LoyaltyClient user={user} />
        </Suspense>
    );
}
