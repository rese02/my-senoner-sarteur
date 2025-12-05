'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2, Save, Loader2, FileWarning } from 'lucide-react';
import { bulkImportWines, deleteAllWines, deleteWine } from '@/app/actions/wine-manager.actions';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';


export function SommelierClient({ initialWines }: { initialWines: Product[] }) {
  const [wines, setWines] = useState(initialWines);
  const [inputList, setInputList] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleImport = async () => {
    if (!inputList.trim()) {
        toast({ variant: "destructive", title: "Fehler", description: "Die Liste ist leer." });
        return;
    };
    
    startTransition(async () => {
        try {
            const wineNames = inputList.split('\n').filter(line => line.trim() !== '');
            const newWines = await bulkImportWines(wineNames);
            
            toast({ title: "Erfolg", description: `${newWines.length} Weine wurden importiert und analysiert.` });
            setInputList('');
            setWines(currentWines => [...currentWines, ...newWines]);
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Fehler", description: "Import fehlgeschlagen." });
        }
    });
  };

  const handleDeleteAll = async () => {
      startTransition(async () => {
          try {
            await deleteAllWines();
            setWines([]);
            toast({ title: "Gelöscht", description: "Die Weinliste ist jetzt leer." });
          } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Fehler", description: "Löschen fehlgeschlagen." });
          }
      });
  };

  const handleDeleteOne = async (wineId: string) => {
    startTransition(async () => {
        try {
            await deleteWine(wineId);
            setWines(current => current.filter(w => w.id !== wineId));
            toast({ title: "Wein entfernt" });
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Fehler", description: "Entfernen fehlgeschlagen." });
        }
    })
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Massen-Import</CardTitle>
            <CardDescription>
              Fügen Sie hier Ihre Weinliste ein. <strong>Ein Wein pro Zeile.</strong><br/>
              Nur der Name ist nötig (z.B. "St. Magdalener Nossing").
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="Lagrein Muri Gries&#10;Gewürztraminer Nussbaumer&#10;Santa Margherita Pinot Grigio..." 
              className="h-48 font-mono text-sm"
              value={inputList}
              onChange={(e) => setInputList(e.target.value)}
              disabled={isPending}
            />
             <p className="text-xs text-muted-foreground flex items-start gap-2">
              <FileWarning className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Ihre Eingabe wird von einem KI-Dienst verarbeitet, um die Weine automatisch mit relevanten Tags anzureichern. Geben Sie keine sensiblen Daten ein.</span>
            </p>
            <Button onClick={handleImport} disabled={isPending} className="w-full">
              {isPending ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 w-4 h-4" />}
              Liste importieren & Analysieren
            </Button>
          </CardContent>
        </Card>

        <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
                <CardTitle className="text-destructive">Gefahrenzone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-destructive/90">
                Möchten Sie die Liste komplett neu aufbauen? Hiermit werden alle Weine unwiderruflich aus dem Sommelier-System gelöscht.
                </p>
                 <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isPending} className="w-full">
                        <Trash2 className="mr-2 w-4 h-4" />
                        Alle Weine löschen
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Sind Sie absolut sicher?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Diese Aktion kann nicht rückgängig gemacht werden. Dadurch werden alle Weine aus der AI-Sommelier-Datenbank dauerhaft gelöscht.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAll}>Ja, alles löschen</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
      </div>

        <Card>
            <CardHeader>
                <CardTitle>Aktueller Weinkatalog</CardTitle>
                <CardDescription>
                    {wines.length} Weine sind derzeit im AI-Sommelier-System registriert.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg overflow-hidden max-h-[600px] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Wein</TableHead>
                                <TableHead>Tags</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {wines.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                        Der Weinkatalog ist leer.
                                    </TableCell>
                                </TableRow>
                            )}
                            {wines.map(wine => (
                                <TableRow key={wine.id}>
                                    <TableCell className="font-medium text-sm">{wine.name}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {wine.tags.map((tag: string) => (
                                                <Badge key={tag} variant="secondary">{tag}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteOne(wine.id)} disabled={isPending}>
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
