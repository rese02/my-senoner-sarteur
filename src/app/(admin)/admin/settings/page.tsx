
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { deleteOldOrders, deleteInactiveUsers } from '@/app/actions/admin-cleanup.actions';
import { Loader2, Trash2, History, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/common/PageHeader';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


export default function AdminSettingsPage() {
  const [months, setMonths] = useState("12");

  const [isOrderPending, startOrderTransition] = useTransition();
  const [isUserPending, startUserTransition] = useTransition();

  const { toast } = useToast();

  const handleOrderDelete = () => {
    startOrderTransition(async () => {
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

  const handleUserDelete = () => {
      startUserTransition(async () => {
          try {
              const result = await deleteInactiveUsers();
              toast({ 
                  title: "Aufräumen erfolgreich", 
                  description: `${result.count} inaktive Benutzerkonten wurden gelöscht.`,
              });
          } catch (e: any) {
              toast({ title: "Fehler", description: e.message || "Konnte nicht löschen.", variant: "destructive" });
          }
      });
  }

  return (
    <>
      <PageHeader title="Einstellungen" description="Verwalten Sie hier allgemeine App-Konfigurationen und Wartungsaufgaben." />
        <div className="grid md:grid-cols-2 gap-6 items-start">
            <Card>
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
                            <Select value={months} onValueChange={setMonths} disabled={isOrderPending}>
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Zeitraum wählen" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="6">6 Monate</SelectItem>
                                <SelectItem value="12">12 Monate (1 Jahr)</SelectItem>
                                <SelectItem value="24">24 Monate (2 Jahre)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" className="w-full sm:w-auto mt-2 sm:mt-0" disabled={isOrderPending}>
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
                                    <AlertDialogAction onClick={handleOrderDelete} disabled={isOrderPending} className="bg-destructive hover:bg-destructive/90">
                                        {isOrderPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Ja, unwiderruflich löschen
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-muted-foreground">
                        Diese Aktion betrifft nur Bestellungen mit dem Status "Abgeholt", "Geliefert", "Bezahlt" oder "Storniert", um die Datenintegrität zu gewährleisten. Steuerlich relevante Belege sind davon nicht betroffen.
                    </p>
                </CardFooter>
            </Card>
            
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserX className="w-5 h-5" />
                    Inaktive Benutzer löschen
                </CardTitle>
                <CardDescription>
                    Entfernen Sie Benutzerkonten, die seit über einem Jahr nicht mehr aktiv waren, um die DSGVO-Anforderung der Speicherbegrenzung zu erfüllen.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-secondary border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                            <label className="text-sm font-medium text-foreground">Benutzer löschen, die inaktiv sind seit:</label>
                            <Input value="12 Monaten (1 Jahr)" disabled className="bg-background" />
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" className="w-full sm:w-auto mt-2 sm:mt-0" disabled={isUserPending}>
                                    <Trash2 className="mr-2 w-4 h-4" />
                                    Inaktive Benutzer entfernen
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Sind Sie absolut sicher?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Diese Aktion löscht alle Benutzerkonten (und deren zugehörige Bestelldaten), die sich seit mehr als <strong>12 Monaten</strong> nicht mehr angemeldet haben. <br/><br/>
                                        Diese Aktion kann nicht rückgängig gemacht werden.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleUserDelete} disabled={isUserPending} className="bg-destructive hover:bg-destructive/90">
                                        {isUserPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Ja, unwiderruflich löschen
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-muted-foreground">
                        Ein Benutzer gilt als inaktiv, wenn sein letzter Login länger als der ausgewählte Zeitraum zurückliegt. Die Löschung umfasst den Auth-Account und alle zugehörigen Firestore-Daten wie Bestellungen.
                    </p>
                </CardFooter>
            </Card>
        </div>
    </>
  );
}
