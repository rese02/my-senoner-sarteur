
'use server';

import { Suspense } from 'react';
import { getScannerPageData } from '@/app/actions/scanner.actions';
import { EmployeeScannerClient } from './client'; 
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { QrCode, ClipboardList, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { PageHeader } from '@/components/common/PageHeader';

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
        <div className="w-full space-y-6">
             <PageHeader title="Mitarbeiter-Menü" description="Wählen Sie eine Aktion aus."/>

             <div className="grid grid-cols-1 gap-6">
                 <Link href="/employee/scanner/scan">
                    <Card className="hover:bg-secondary/50 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-3 text-primary">
                                    <QrCode className="w-6 h-6" />
                                    <span>QR-Code Scanner</span>
                                </CardTitle>
                                <CardDescription>Kundenkarte scannen, um Stempel zu geben oder Gewinne einzulösen.</CardDescription>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/employee/picker">
                     <Card className="hover:bg-secondary/50 hover:shadow-lg transition-all duration-300 group cursor-pointer relative">
                        {groceryLists.length > 0 && (
                            <Badge variant="destructive" className="absolute -top-2 -right-2 animate-pulse">
                                {groceryLists.length} NEU
                            </Badge>
                        )}
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-3">
                                    <ClipboardList className="w-6 h-6" />
                                    <span>Einkaufszettel</span>
                                </CardTitle>
                                <CardDescription>Offene Listen bearbeiten und für die Lieferung vorbereiten.</CardDescription>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardHeader>
                    </Card>
                </Link>
             </div>
        </div>
    );
}
    
