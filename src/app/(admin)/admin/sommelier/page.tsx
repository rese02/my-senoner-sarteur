'use server';

import { PageHeader } from "@/components/common/PageHeader";
import { getWineCatalog } from "@/app/actions/wine-manager.actions";
import { SommelierClient } from "./_components/SommelierClient";

export default async function WineManagerPage() {
    const wines = await getWineCatalog();

    return (
        <>
            <PageHeader title="Sommelier Inventar" description="Verwalten Sie hier die Datenbank für den AI-Sommelier." />
            <SommelierClient initialWines={wines} />
        </>
    );
}
