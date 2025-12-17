
'use server';

import { PageHeader } from "@/components/common/PageHeader";
import { getWineCatalog, getSommelierSettings } from "@/app/actions/wine-manager.actions";
import { SommelierClient } from "./_components/SommelierClient";
import { SommelierSettingsManager } from "./_components/SommelierSettingsManager";

export default async function WineManagerPage() {
    const wines = await getWineCatalog();
    const settings = await getSommelierSettings();

    return (
        <div className="space-y-6">
            <PageHeader title="Sommelier Inventar & Einstellungen" description="Verwalten Sie hier die Datenbank und die Aktivierung des AI-Sommeliers." />
            <SommelierSettingsManager initialIsActive={settings.isActive} />
            <SommelierClient initialWines={wines} />
        </div>
    );
}
