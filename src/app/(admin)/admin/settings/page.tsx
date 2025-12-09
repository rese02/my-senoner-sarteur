
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { deleteOldOrders } from '@/app/actions/admin-cleanup.actions';
import { Loader2, Trash2, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/common/PageHeader';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


export default function AdminSettingsPage() {
  const [months, setMonths] = useState("6");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleBulkDelete = () => {
    startTransition(async () => {
        try {
            const result = await deleteOldOrders(parseInt(months));
            toast({ 
                title: "Aufräumen erfolgreich", 
                description: `${result.count} alte Bestellungen wurden gelöscht.`,
            });
        } catch (e: any) {
            toast({ title: "Fehler", description: e.message || "Konnte nicht löschen.", variant: "destructive" });
        }
    });
  };

  return (
    <>
      <PageHeader title="Einstellungen" description="Verwalten Sie hier allgemeine App-Konfigurationen und Wartungsaufgaben." />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <History className="w-5 h-5" />
             Datenhistorie verwalten
          </CardTitle>
          <CardDescription>
            Löschen Sie regelmäßig alte, abgeschlossene Bestellungen, um die Datenbank-Performance zu optimieren und die App schnell zu halten.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="p-4 bg-secondary border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                    <label className="text-sm font-medium text-foreground">Bestellungen löschen, die älter sind als:</label>
                    <Select value={months} onValueChange={setMonths} disabled={isPending}>
                        <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Zeitraum wählen" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="3">3 Monate</SelectItem>
                        <SelectItem value="6">6 Monate (Empfohlen)</SelectItem>
                        <SelectItem value="12">1 Jahr</SelectItem>
                        <SelectItem value="24">2 Jahre</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <Button variant="outline" className="w-full sm:w-auto mt-2 sm:mt-0" disabled={isPending}>
                            <Trash2 className="mr-2 w-4 h-4" />
                            Alte Daten bereinigen
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Sind Sie absolut sicher?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Diese Aktion löscht alle abgeschlossenen Bestellungen (Status: Abgeholt, Geliefert, Bezahlt, Storniert), die älter als <strong>{months} Monate</strong> sind. <br/><br/>
                                Diese Aktion kann nicht rückgängig gemacht werden.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction onClick={handleBulkDelete} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Ja, unwiderruflich löschen
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">
                Diese Aktion betrifft nur Bestellungen mit dem Status "Abgeholt", "Geliefert", "Bezahlt" oder "Storniert", um die Datenintegrität zu gewährleisten.
            </p>
        </CardFooter>
      </Card>
    </>
  );
}
