
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, Edit, Loader2, Plus, MoreVertical } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useTransition, useEffect } from "react";
import type { Product, Category, PackageItem } from "@/lib/types";
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

export function ProductsClient({ initialProducts, initialCategories }: { initialProducts: Product[], initialCategories: Category[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

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
  const [newCategoryName, setNewCategoryName] = useState('');

  const [isProductSheetOpen, setIsProductSheetOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);

  const [tempItem, setTempItem] = useState('');
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
      if (!newCategoryName) {
        toast({ variant: 'destructive', title: 'Kategoriename ist erforderlich' });
        return;
      }
      startTransition(async () => {
        try {
          const newCategory = await createCategory(newCategoryName);
          setCategories(cats => [...cats, newCategory]);
          toast({ title: 'Kategorie erstellt!' });
          setNewCategoryName('');
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
        ? { ...product } 
        : { name: '', price: 0, unit: '', imageUrl: '', imageHint: '', type: 'product', packageContent: [] };
      setEditingProduct(initialProductState);
      setCurrentCategoryId(categoryId);
      setIsProductSheetOpen(true);
  };

  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!editingProduct) return;
      const { name, value } = e.target;
      setEditingProduct({ ...editingProduct, [name]: value });
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
      
      if (!editingProduct || !editingProduct.name || !editingProduct.price) {
          toast({ variant: 'destructive', title: 'Name und Preis sind erforderlich' });
          return;
      }

      startTransition(async () => {
          try {
            if (editingProduct.id) {
                const updatedProduct = await updateProduct(editingProduct as Product);
                setProducts(prods => prods.map(p => p.id === updatedProduct.id ? updatedProduct : p));
            } else {
                const newProductData = {
                  ...editingProduct,
                  categoryId: currentCategoryId!,
                  isAvailable: true,
                  price: Number(editingProduct.price),
                  type: editingProduct.type || 'product'
                } as Omit<Product, 'id'>;
                const created = await createProduct(newProductData);
                setProducts(prods => [...prods, created]);
            }
            setIsProductSheetOpen(false);
            setEditingProduct(null);
            toast({ title: editingProduct.id ? 'Produkt aktualisiert!' : 'Produkt erstellt!' });
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
        if (!tempItem || !tempAmount || !editingProduct) return;
        const newItem: PackageItem = { item: tempItem, amount: tempAmount };
        const currentContent = editingProduct.packageContent || [];
        setEditingProduct({ ...editingProduct, packageContent: [...currentContent, newItem] });
        setTempItem('');
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
                    <CardTitle>{category.name}</CardTitle>
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
                                Möchten Sie die Kategorie '{category.name}' wirklich löschen? Alle darin enthaltenen Produkte werden ebenfalls entfernt. Diese Aktion kann nicht rückgängig gemacht werden.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCategory(category.id)} disabled={isPending}>Löschen</AlertDialogAction>
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
                            <Image src={product.imageUrl || fallbackImageUrl} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={product.imageHint} />
                              {product.type === 'package' && <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground border-none" variant="secondary">PAKET</Badge>}
                          </div>
                          <CardContent className="p-4 flex flex-col flex-1">
                              <h3 className="font-semibold text-base leading-tight flex-grow">{product.name}</h3>
                              <div className="flex items-baseline justify-between mt-1">
                                  <p className="text-lg font-bold text-primary">€{(product.price || 0).toFixed(2)}</p>
                                  <span className="text-xs text-muted-foreground">/ {product.unit}</span>
                              </div>
                              <div className="mt-auto pt-4 flex items-center justify-between gap-4 border-t mt-4">
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
                                                      <AlertDialogDescription>Möchten Sie '{product.name}' wirklich löschen?</AlertDialogDescription>
                                                  </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                                      <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                                      <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>Löschen</AlertDialogAction>
                                                  </AlertDialogFooter>
                                              </AlertDialogContent>
                                          </AlertDialog>
                                      </DropdownMenuContent>
                                  </DropdownMenu>
                              </div>
                          </CardContent>
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
                            <span>Produkt zu '{cat.name}'</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
      </div>

      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neue Kategorie erstellen</DialogTitle>
            <DialogDescription>Geben Sie einen Namen für die neue Produktkategorie ein.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
              <div className="space-y-1.5">
                  <Label htmlFor="category-name">Name</Label>
                  <Input id="category-name" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
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
        <SheetContent className="sm:max-w-lg p-0">
            <SheetHeader className="p-6 pb-0">
                <SheetTitle>{editingProduct?.id ? 'Produkt bearbeiten' : 'Neues Produkt erstellen'}</SheetTitle>
                <SheetDescription>
                    {editingProduct?.id ? 'Aktualisieren Sie die Details dieses Produkts.' : 'Fügen Sie ein neues Produkt zu dieser Kategorie hinzu.'}
                </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSaveProduct}>
              <ScrollArea className="h-[calc(100vh-140px)]">
                <div className="grid gap-4 p-6">
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

                  <div className="space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" value={editingProduct?.name || ''} onChange={handleProductFormChange} required />
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
                  <div className="space-y-1.5">
                    <Label htmlFor="description">Beschreibung</Label>
                    <Textarea id="description" name="description" value={editingProduct?.description || ''} onChange={handleProductFormChange} placeholder="Eine kurze Beschreibung des Produkts." />
                  </div>
                  
                  {editingProduct?.type === 'package' && (
                      <div className="space-y-4 border p-4 rounded-xl bg-secondary/50">
                        <h3 className="font-semibold text-primary text-sm">Paket-Inhalt definieren</h3>
                        
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
                            <div className="flex-1 space-y-1.5">
                                 <Label htmlFor="package-item">Produktname</Label>
                                <Input 
                                id="package-item"
                                placeholder="Produktname" 
                                className="bg-background" 
                                value={tempItem}
                                onChange={e => setTempItem(e.target.value)}
                                />
                            </div>
                            <Button onClick={addPackageItem} type="button" variant="secondary" size="icon" className="h-10 w-10 shrink-0"><Plus className="h-4 w-4"/></Button>
                        </div>

                        <ul className="space-y-2 pt-2">
                            {editingProduct.packageContent?.map((content, idx) => (
                            <li key={idx} className="flex justify-between items-center bg-background p-2 rounded border shadow-sm text-sm">
                                <div>
                                    <span className="font-semibold">{content.item}</span>
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
