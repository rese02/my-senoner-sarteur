
'use server';

import { Suspense } from 'react';
import { getScannerPageData } from '@/app/actions/scanner.actions';
import { EmployeeScannerClient } from './client'; 
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { QrCode, ClipboardList } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

function ScannerFallback() {
    return (
        <div className="flex justify-center items-center p-8 mt-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4">Lade Kundendaten...</p>
        </div>
    )
}

// This page now acts as a router.
// If a userId is in the search params, it shows the client to process it.
// Otherwise, it shows the main menu.
export default async function EmployeeMenuPage({ searchParams }: { searchParams: { userId?: string }}) {
    const userId = searchParams.userId;

    // If a user has been scanned, render the client to display the results.
    if (userId) {
        return (
             <div className="w-full space-y-4">
                <Suspense fallback={<ScannerFallback />}>
                    <EmployeeScannerClient userId={userId} />
                </Suspense>
            </div>
        )
    }
    
    // Otherwise, show the main menu.
    const { groceryLists } = await getScannerPageData();

    return (
        <div className="w-full space-y-4">
             <Link href="/employee/scanner/scan">
                <Card className="hover:bg-secondary transition-colors cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle>QR-Code Scanner</CardTitle>
                            <CardDescription>Kundenkarte scannen, um Stempel zu geben oder Gewinne einzulösen.</CardDescription>
                        </div>
                        <QrCode className="w-8 h-8 text-primary" />
                    </CardHeader>
                </Card>
            </Link>

            <Link href="/employee/picker">
                 <Card className="hover:bg-secondary transition-colors cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle>Einkaufszettel</CardTitle>
                            <CardDescription>Offene Listen bearbeiten.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                             {groceryLists.length > 0 && <Badge variant="destructive">{groceryLists.length}</Badge>}
                             <ClipboardList className="w-8 h-8 text-muted-foreground" />
                        </div>
                    </CardHeader>
                </Card>
            </Link>
        </div>
    );
}
    
