

'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, Edit, Loader2, Plus, MoreVertical } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useTransition, useEffect } from "react";
import type { Product, Category, PackageItem, MultilingualText } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ImageUploader } from "@/components/custom/ImageUploader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createCategory, deleteCategory, updateProduct, createProduct, deleteProduct, toggleProductAvailability } from "@/app/actions/product.actions";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { getLang, getEmptyMultilingualText, sanitizeMultilingualText } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";


export function ProductsClient({ initialProducts, initialCategories }: { initialProducts: Product[], initialCategories: Category[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const { lang, t } = useLanguage();
  const fallbackImageUrl = PlaceHolderImages.find(p => p.id === 'placeholder-general')?.imageUrl || 'https://placehold.co/400x300';


  // This effect ensures that if the parent Server Component re-fetches data,
  // the client state is updated accordingly.
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState<MultilingualText>(getEmptyMultilingualText());

  const [isProductSheetOpen, setIsProductSheetOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);

  const [tempItem, setTempItem] = useState<MultilingualText>(getEmptyMultilingualText());
  const [tempAmount, setTempAmount] = useState('');

  const handleAvailabilityToggle = (productId: string, currentStatus: boolean) => {
    startTransition(async () => {
        try {
            await toggleProductAvailability(productId, !currentStatus);
            setProducts(prods => prods.map(p => p.id === productId ? {...p, isAvailable: !currentStatus} : p));
            toast({ title: "Verfügbarkeit geändert!"});
        } catch (error) {
            toast({ variant: 'destructive', title: 'Update fehlgeschlagen' });
        }
    });
  };

  const handleCreateCategory = () => {
      if (!newCategoryName.de && !newCategoryName.it && !newCategoryName.en) {
        toast({ variant: 'destructive', title: 'Kategoriename ist erforderlich' });
        return;
      }
      startTransition(async () => {
        try {
          const newCategory = await createCategory(newCategoryName);
          setCategories(cats => [...cats, newCategory]);
          toast({ title: 'Kategorie erstellt!' });
          setNewCategoryName(getEmptyMultilingualText());
          setIsCategoryModalOpen(false);
        } catch (error: any) {
          toast({ variant: "destructive", title: "Fehler", description: error.message || "Kategorie konnte nicht erstellt werden."});
        }
      });
  };
  
  const handleDeleteCategory = (categoryId: string) => {
      startTransition(async () => {
        try {
          await deleteCategory(categoryId);
          setCategories(cats => cats.filter(c => c.id !== categoryId));
          setProducts(prods => prods.filter(p => p.categoryId !== categoryId));
          toast({ title: 'Kategorie gelöscht' });
        } catch(error: any) {
          toast({ variant: "destructive", title: "Fehler", description: error.message || "Kategorie konnte nicht gelöscht werden."});
        }
      });
  };

  const handleOpenProductModal = (product: Product | null, categoryId: string) => {
      const initialProductState: Partial<Product> = product 
        ? { ...product, name: sanitizeMultilingualText(product.name), description: sanitizeMultilingualText(product.description) } 
        : { name: getEmptyMultilingualText(), price: 0, unit: '', imageUrl: '', imageHint: '', description: getEmptyMultilingualText(), type: 'product', packageContent: [] };
      setEditingProduct(initialProductState);
      setCurrentCategoryId(categoryId);
      setIsProductSheetOpen(true);
  };

  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldLang?: keyof MultilingualText) => {
    if (!editingProduct) return;

    const { name, value } = e.target;
    
    if (fieldLang && (name === 'name' || name === 'description')) {
        setEditingProduct(prev => {
            if (!prev) return null;
            const currentField = prev[name] ? sanitizeMultilingualText(prev[name]) : getEmptyMultilingualText();
            const updatedField = { ...currentField, [fieldLang]: value };
            return { ...prev, [name]: updatedField };
        });
    } else {
        setEditingProduct({ ...editingProduct, [name]: value });
    }
  };

   const handleProductTypeChange = (value: 'product' | 'package') => {
      if (!editingProduct) return;
      setEditingProduct({ ...editingProduct, type: value });
    };

  const handleImageUpload = (url: string) => {
      if (!editingProduct) return;
      setEditingProduct({ ...editingProduct, imageUrl: url });
  };
  
  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      if (!editingProduct || !getLang(editingProduct.name, 'de') || !editingProduct.price) {
          toast({ variant: 'destructive', title: 'Name (DE) und Preis sind erforderlich' });
          return;
      }

      startTransition(async () => {
          try {
            const productToSave: Partial<Product> = {
                ...editingProduct,
                name: sanitizeMultilingualText(editingProduct.name),
                description: sanitizeMultilingualText(editingProduct.description),
            };

            if (productToSave.id) {
                const updatedProduct = await updateProduct(productToSave as Product);
                setProducts(prods => prods.map(p => p.id === updatedProduct.id ? updatedProduct : p));
            } else {
                const newProductData = {
                  ...productToSave,
                  categoryId: currentCategoryId!,
                  isAvailable: true,
                  price: Number(productToSave.price),
                  type: productToSave.type || 'product'
                } as Omit<Product, 'id'>;
                const created = await createProduct(newProductData);
                setProducts(prods => [...prods, created]);
            }
            setIsProductSheetOpen(false);
            setEditingProduct(null);
            toast({ title: productToSave.id ? 'Produkt aktualisiert!' : 'Produkt erstellt!' });
          } catch(error: any) {
            toast({ variant: "destructive", title: "Fehler beim Speichern", description: error.message || "Produkt konnte nicht gespeichert werden." });
          }
      });
  };

  const handleDeleteProduct = (productId: string) => {
      startTransition(async () => {
        try {
          await deleteProduct(productId);
          setProducts(prods => prods.filter(p => p.id !== productId));
          toast({ title: 'Produkt gelöscht' });
        } catch(error: any) {
          toast({ variant: "destructive", title: "Fehler", description: error.message || "Produkt konnte nicht gelöscht werden." });
        }
      });
  };

    const addPackageItem = () => {
        if ((!tempItem.de && !tempItem.it && !tempItem.en) || !tempAmount || !editingProduct) return;
        const newItem: PackageItem = { item: tempItem, amount: tempAmount };
        const currentContent = editingProduct.packageContent || [];
        setEditingProduct({ ...editingProduct, packageContent: [...currentContent, newItem] });
        setTempItem(getEmptyMultilingualText());
        setTempAmount('');
    };

    const removePackageItem = (index: number) => {
        if (!editingProduct || !editingProduct.packageContent) return;
        const newContent = [...editingProduct.packageContent];
        newContent.splice(index, 1);
        setEditingProduct({ ...editingProduct, packageContent: newContent });
    };

  return (
    <>
      <div className="flex justify-end items-start mb-6">
        <Button onClick={() => setIsCategoryModalOpen(true)} className="hidden md:flex" size="sm"><PlusCircle className="mr-2 h-4 w-4"/>Neue Kategorie</Button>
      </div>
      
        <div className="space-y-8">
          {categories.map((category) => {
            const productsInCategory = products.filter(p => p.categoryId === category.id);
            return (
              <Card key={category.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{getLang(category.name, lang)}</CardTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="hidden md:flex" onClick={() => handleOpenProductModal(null, category.id)}><PlusCircle className="mr-2 h-4 w-4" />Produkt</Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8 hidden md:flex"><Trash2 className="w-4 h-4" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Möchten Sie die Kategorie '{getLang(category.name, lang)}' wirklich löschen? Alle darin enthaltenen Produkte werden ebenfalls entfernt. Diese Aktion kann nicht rückgängig gemacht werden.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCategory(category.id)} disabled={isPending} className="bg-destructive hover:bg-destructive/90">Löschen</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {productsInCategory.map(product => (
                        <Card key={product.id} className="overflow-hidden flex flex-col group transition-all hover:shadow-lg bg-background">
                          <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                            <Image src={product.imageUrl || fallbackImageUrl} alt={getLang(product.name, lang)} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={product.imageHint} />
                              {product.type === 'package' && <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground border-none" variant="secondary">PAKET</Badge>}
                          </div>
                          <CardContent className="p-4 flex flex-col flex-grow">
                              <h3 className="font-semibold text-base leading-tight flex-grow">{getLang(product.name, lang)}</h3>
                              <div className="flex items-baseline justify-between mt-1">
                                  <p className="text-lg font-bold text-primary">€{(product.price || 0).toFixed(2)}</p>
                                  <span className="text-xs text-muted-foreground">/ {product.unit}</span>
                              </div>
                            </CardContent>
                            <CardFooter className="pt-0 p-4 flex items-center justify-between gap-4">
                                <div className="flex items-center space-x-2">
                                    <Switch 
                                        id={`availability-${product.id}`} 
                                        checked={product.isAvailable} 
                                        onCheckedChange={() => handleAvailabilityToggle(product.id, product.isAvailable)}
                                        disabled={isPending}
                                    />
                                    <Label htmlFor={`availability-${product.id}`} className="text-xs text-muted-foreground">
                                        {product.isAvailable ? "Aktiv" : "Inaktiv"}
                                    </Label>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <MoreVertical className="h-4 w-4" />
                                      </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleOpenProductModal(product, category.id)}>
                                          <Edit className="mr-2 h-4 w-4" /> Bearbeiten
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10">
                                                  <Trash2 className="mr-2 h-4 w-4" /> Löschen
                                              </DropdownMenuItem>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                              <AlertDialogHeader>
                                                  <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                                                  <AlertDialogDescription>Möchten Sie '{getLang(product.name, lang)}' wirklich löschen?</AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                                  <AlertDialogAction onClick={() => handleDeleteProduct(product.id)} className="bg-destructive hover:bg-destructive/90">Löschen</AlertDialogAction>
                                              </AlertDialogFooter>
                                          </AlertDialogContent>
                                      </AlertDialog>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                            </CardFooter>
                        </Card>
                      ))}
                    </div>
                    {productsInCategory.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-xl">
                          <p className="text-sm">Noch keine Produkte in dieser Kategorie.</p>
                          <Button variant="link" size="sm" className="mt-1" onClick={() => handleOpenProductModal(null, category.id)}>Fügen Sie das erste Produkt hinzu</Button>
                        </div>
                    )}
                </CardContent>
              </Card>
            )
          })}
        </div>

       <div className="md:hidden fixed bottom-24 right-4 z-20">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="lg" className="rounded-full h-14 w-14 shadow-lg">
                        <Plus className="h-6 w-6" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mb-2">
                    <DropdownMenuItem onSelect={() => setIsCategoryModalOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>Neue Kategorie</span>
                    </DropdownMenuItem>
                     {categories.map((cat) => (
                         <DropdownMenuItem key={cat.id} onSelect={() => handleOpenProductModal(null, cat.id)}>
                            <Plus className="mr-2 h-4 w-4" />
                            <span>Produkt zu '{getLang(cat.name, lang)}'</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
      </div>

      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Neue Kategorie erstellen</DialogTitle>
            <DialogDescription>Geben Sie einen Namen für die neue Produktkategorie in allen Sprachen ein.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
              <div className="space-y-1.5">
                  <Label htmlFor="category-name-de">Name (Deutsch)</Label>
                  <Input id="category-name-de" value={newCategoryName.de} onChange={e => setNewCategoryName(v => ({...v, de: e.target.value}))} />
              </div>
              <div className="space-y-1.5">
                  <Label htmlFor="category-name-it">Name (Italienisch)</Label>
                  <Input id="category-name-it" value={newCategoryName.it} onChange={e => setNewCategoryName(v => ({...v, it: e.target.value}))} />
              </div>
              <div className="space-y-1.5">
                  <Label htmlFor="category-name-en">Name (Englisch)</Label>
                  <Input id="category-name-en" value={newCategoryName.en} onChange={e => setNewCategoryName(v => ({...v, en: e.target.value}))} />
              </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Abbrechen</Button></DialogClose>
            <Button onClick={handleCreateCategory} disabled={isPending}>
                {isPending && <Loader2 className="mr-2 animate-spin" />}
                Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Sheet open={isProductSheetOpen} onOpenChange={setIsProductSheetOpen}>
        <SheetContent className="sm:max-w-2xl p-0">
            <SheetHeader className="p-6 pb-0">
                <SheetTitle>{editingProduct?.id ? 'Produkt bearbeiten' : 'Neues Produkt erstellen'}</SheetTitle>
                <SheetDescription>
                    {editingProduct?.id ? 'Aktualisieren Sie die Details dieses Produkts.' : 'Fügen Sie ein neues Produkt zu dieser Kategorie hinzu.'}
                </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSaveProduct}>
              <ScrollArea className="h-[calc(100vh-140px)]">
                <div className="space-y-6 p-6">
                    <Tabs defaultValue="de">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="de">Deutsch</TabsTrigger>
                            <TabsTrigger value="it">Italienisch</TabsTrigger>
                            <TabsTrigger value="en">Englisch</TabsTrigger>
                        </TabsList>
                        <TabsContent value="de" className="space-y-4 pt-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name-de">Name (DE)</Label>
                                <Input id="name-de" name="name" value={getLang(editingProduct?.name, 'de')} onChange={(e) => handleProductFormChange(e, 'de')} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="description-de">Beschreibung (DE)</Label>
                                <Textarea id="description-de" name="description" value={getLang(editingProduct?.description, 'de')} onChange={(e) => handleProductFormChange(e, 'de')} />
                            </div>
                        </TabsContent>
                         <TabsContent value="it" className="space-y-4 pt-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name-it">Name (IT)</Label>
                                <Input id="name-it" name="name" value={getLang(editingProduct?.name, 'it')} onChange={(e) => handleProductFormChange(e, 'it')} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="description-it">Beschreibung (IT)</Label>
                                <Textarea id="description-it" name="description" value={getLang(editingProduct?.description, 'it')} onChange={(e) => handleProductFormChange(e, 'it')} />
                            </div>
                        </TabsContent>
                         <TabsContent value="en" className="space-y-4 pt-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name-en">Name (EN)</Label>
                                <Input id="name-en" name="name" value={getLang(editingProduct?.name, 'en')} onChange={(e) => handleProductFormChange(e, 'en')} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="description-en">Beschreibung (EN)</Label>
                                <Textarea id="description-en" name="description" value={getLang(editingProduct?.description, 'en')} onChange={(e) => handleProductFormChange(e, 'en')} />
                            </div>
                        </TabsContent>
                    </Tabs>

                  <div className="space-y-1.5">
                      <Label htmlFor="type">Produkttyp</Label>
                      <Select value={editingProduct?.type} onValueChange={handleProductTypeChange}>
                          <SelectTrigger>
                              <SelectValue placeholder="Typ auswählen" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="product">Einzelnes Produkt</SelectItem>
                              <SelectItem value="package">Paket</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                          <Label htmlFor="price">Preis (€)</Label>
                          <Input id="price" name="price" type="number" step="0.01" value={editingProduct?.price || ''} onChange={handleProductFormChange} required/>
                      </div>
                      <div className="space-y-1.5">
                          <Label htmlFor="unit">Einheit</Label>
                          <Input id="unit" name="unit" value={editingProduct?.unit || ''} onChange={handleProductFormChange} placeholder="z.B. kg, stück, paket"/>
                      </div>
                  </div>
                  <div className="space-y-1.5">
                      <Label>Produktbild</Label>
                      <ImageUploader 
                          onUploadComplete={handleImageUpload}
                          currentImageUrl={editingProduct?.imageUrl}
                          folder="products"
                      />
                  </div>
                  <div className="space-y-1.5">
                      <Label htmlFor="imageHint">Bild-Hinweis für KI</Label>
                      <Input id="imageHint" name="imageHint" value={editingProduct?.imageHint || ''} onChange={handleProductFormChange} placeholder="z.B. sushi box" />
                  </div>
                  
                  {editingProduct?.type === 'package' && (
                      <div className="space-y-4 border p-4 rounded-xl bg-secondary/50">
                        <h3 className="font-semibold text-primary text-sm">Paket-Inhalt definieren</h3>
                         <Tabs defaultValue="de-pkg">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="de-pkg">DE</TabsTrigger>
                                <TabsTrigger value="it-pkg">IT</TabsTrigger>
                                <TabsTrigger value="en-pkg">EN</TabsTrigger>
                            </TabsList>
                             <TabsContent value="de-pkg" className="pt-2">
                                <Input placeholder="Produktname (DE)" value={tempItem.de} onChange={e => setTempItem(v => ({...v, de: e.target.value}))} />
                             </TabsContent>
                             <TabsContent value="it-pkg" className="pt-2">
                                <Input placeholder="Produktname (IT)" value={tempItem.it} onChange={e => setTempItem(v => ({...v, it: e.target.value}))} />
                             </TabsContent>
                              <TabsContent value="en-pkg" className="pt-2">
                                <Input placeholder="Produktname (EN)" value={tempItem.en} onChange={e => setTempItem(v => ({...v, en: e.target.value}))} />
                             </TabsContent>
                        </Tabs>
                        
                        <div className="flex gap-2 items-end">
                            <div className="flex-1 space-y-1.5">
                                <Label htmlFor="package-amount">Menge (z.B. 200g)</Label>
                                <Input 
                                id="package-amount"
                                placeholder="Menge" 
                                className="bg-background"
                                value={tempAmount}
                                onChange={e => setTempAmount(e.target.value)} 
                                />
                            </div>
                            <Button onClick={addPackageItem} type="button" variant="secondary" size="icon" className="h-10 w-10 shrink-0"><Plus className="h-4 w-4"/></Button>
                        </div>

                        <ul className="space-y-2 pt-2">
                            {editingProduct.packageContent?.map((content, idx) => (
                            <li key={idx} className="flex justify-between items-center bg-background p-2 rounded border shadow-sm text-sm">
                                <div>
                                    <span className="font-semibold">{getLang(content.item, lang)}</span>
                                    <span className="text-muted-foreground text-xs ml-2">({content.amount})</span>
                                </div>
                                <button onClick={() => removePackageItem(idx)} type="button" className="text-destructive hover:text-destructive/80 p-1">
                                <Trash2 size={14} />
                                </button>
                            </li>
                            ))}
                            {(!editingProduct.packageContent || editingProduct.packageContent.length === 0) && (
                                <p className="text-xs text-center text-muted-foreground py-2">Noch keine Artikel im Paket.</p>
                            )}
                        </ul>
                      </div>
                  )}
                </div>
              </ScrollArea>
                <SheetFooter className="p-6 pt-4 border-t sticky bottom-0 bg-card">
                    <SheetClose asChild><Button type="button" variant="outline">Abbrechen</Button></SheetClose>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 animate-spin h-4 w-4" />}
                        Speichern
                    </Button>
                </SheetFooter>
            </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
