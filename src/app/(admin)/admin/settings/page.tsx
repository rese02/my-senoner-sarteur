'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { deleteOldOrders } from '@/app/actions/admin-cleanup.actions';
import { Loader2, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/common/PageHeader';

export default function AdminSettingsPage() {
  const [months, setMonths] = useState("6"); // Standard: Älter als 6 Monate
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleBulkDelete = async () => {
    if (!confirm(`WARNUNG: Möchten Sie wirklich ALLE abgeschlossenen Bestellungen löschen, die älter als ${months} Monate sind?`)) return;
    
    setIsLoading(true);
    try {
      const result = await deleteOldOrders(parseInt(months));
      toast({ 
        title: "Aufräumen erfolgreich", 
        description: `${result.count} alte Bestellungen wurden gelöscht.`,
      });
    } catch (e: any) {
      toast({ title: "Fehler", description: e.message || "Konnte nicht löschen.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Einstellungen & Wartung" description="Halten Sie Ihre App schnell und sauber." />

      <Card className="border-destructive/20 max-w-xl">
        <CardHeader className="bg-destructive/5">
          <CardTitle className="text-destructive flex items-center gap-2 text-xl">
            <Trash className="w-5 h-5" /> Datenbank bereinigen
          </CardTitle>
          <CardDescription className="!text-destructive/90">
            Löschen Sie alte Bestellungen (Status "Abgeholt", "Storniert"), um die App schnell zu halten.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-end">
            <div className="w-full sm:w-1/2 space-y-1.5">
              <label className="text-sm font-medium text-foreground">Löschen, wenn älter als:</label>
              <Select value={months} onValueChange={setMonths}>
                <SelectTrigger>
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

            <Button 
              variant="destructive" 
              onClick={handleBulkDelete} 
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Trash className="mr-2 w-4 h-4" />}
              Jetzt bereinigen
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
