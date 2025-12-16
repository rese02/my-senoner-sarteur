
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
        <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
}

export default async function EmployeeMenuPage() {
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

            {/* Diese Komponente wird nur noch für die Anzeige nach dem Scan benötigt */}
            <Suspense fallback={<ScannerFallback />}>
                <EmployeeScannerClient />
            </Suspense>
        </div>
    );
}
    
