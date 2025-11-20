'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2, Save, Loader2, FileWarning } from 'lucide-react';
import { bulkImportWines, deleteAllWines } from '@/app/actions/wine-manager.actions';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/common/PageHeader';
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
} from "@/components/ui/alert-dialog"

export default function WineManagerPage() {
  const [inputList, setInputList] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    if (!inputList.trim()) {
        toast({ variant: "destructive", title: "Fehler", description: "Die Liste ist leer." });
        return;
    };
    setIsLoading(true);

    try {
      const wines = inputList.split('\n').filter(line => line.trim() !== '');
      await bulkImportWines(wines);
      
      toast({ title: "Erfolg", description: `${wines.length} Weine wurden importiert und analysiert.` });
      setInputList('');
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Fehler", description: "Import fehlgeschlagen." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAll = async () => {
      setIsLoading(true);
      try {
        await deleteAllWines();
        toast({ title: "Gelöscht", description: "Die Weinliste ist jetzt leer." });
      } catch (error) {
        console.error(error);
        toast({ variant: "destructive", title: "Fehler", description: "Löschen fehlgeschlagen." });
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <>
      <PageHeader title="Sommelier Inventar" description="Verwalten Sie hier die Datenbank für den AI-Sommelier." />

      <div className="grid md:grid-cols-2 gap-8">
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
              className="h-96 font-mono text-sm"
              value={inputList}
              onChange={(e) => setInputList(e.target.value)}
              disabled={isLoading}
            />
             <p className="text-xs text-muted-foreground flex items-start gap-2">
              <FileWarning className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Ihre Eingabe wird von einem KI-Dienst verarbeitet, um die Weine automatisch mit relevanten Tags anzureichern. Geben Sie keine sensiblen Daten ein.</span>
            </p>
            <Button onClick={handleImport} disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 w-4 h-4" />}
              Liste importieren & Analysieren
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-8">
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
                        <Button variant="destructive" disabled={isLoading} className="w-full">
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
            
            <Card>
                <CardHeader>
                    <CardTitle>Wie es funktioniert</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-2">
                        <li>Sie fügen nur Namen ein.</li>
                        <li>Unser System erkennt im Hintergrund automatisch, ob es Rot/Weiß ist und wozu es passt.</li>
                        <li>Der Kunde scannt sein Essen &rarr; Die App findet den passenden Wein aus dieser Liste.</li>
                    </ul>
              </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}
