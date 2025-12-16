'use server';

import { Suspense } from 'react';
import { getScannerPageData } from '@/app/actions/scanner.actions';
import { EmployeeScannerClient } from './client'; 
import { Loader2 } from 'lucide-react';

function ScannerFallback() {
    return (
        <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
}

export default async function EmployeePage() {
    // Laden der offenen Einkaufszettel
    const { groceryLists } = await getScannerPageData();

    return (
        // Suspense Boundary ist wichtig, damit die searchParams vom Client sofort gelesen werden können.
        <Suspense fallback={<ScannerFallback />}>
            <EmployeeScannerClient initialOrders={groceryLists} />
        </Suspense>
    );
}
    