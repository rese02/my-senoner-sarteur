'use client';
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, Edit, Loader2, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useTransition, useEffect } from "react";
import type { Product, Category, PackageItem } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ImageUploader } from "@/components/custom/ImageUploader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createCategory, deleteCategory, updateProduct, createProduct, deleteProduct, toggleProductAvailability } from "@/app/actions/product.actions";
import { useRouter } from "next/navigation";


export function ProductsClient({ initialProducts, initialCategories }: { initialProducts: Product[], initialCategories: Category[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const router = useRouter();

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

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);

  const [tempItem, setTempItem] = useState('');
  const [tempAmount, setTempAmount] = useState('');

  const refreshData = () => {
    router.refresh();
  };

  const handleAvailabilityToggle = (productId: string, currentStatus: boolean) => {
    startTransition(async () => {
        try {
            await toggleProductAvailability(productId, !currentStatus);
            // Refresh data from server to ensure consistency
            refreshData();
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
          await createCategory(newCategoryName);
          toast({ title: 'Kategorie erstellt!' });
          setNewCategoryName('');
          setIsCategoryModalOpen(false);
          refreshData();
        } catch (error: any) {
          toast({ variant: "destructive", title: "Fehler", description: error.message || "Kategorie konnte nicht erstellt werden."});
        }
      });
  };
  
  const handleDeleteCategory = (categoryId: string) => {
      startTransition(async () => {
        try {
          await deleteCategory(categoryId);
          toast({ title: 'Kategorie gelöscht' });
          refreshData();
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
      setIsProductModalOpen(true);
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
                await updateProduct(editingProduct as Product);
            } else {
                const newProductData = {
                  ...editingProduct,
                  categoryId: currentCategoryId!,
                  isAvailable: true,
                  price: Number(editingProduct.price),
                  type: editingProduct.type || 'product'
                } as Omit<Product, 'id'>;

                await createProduct(newProductData);
            }
            setIsProductModalOpen(false);
            setEditingProduct(null);
            refreshData(); 
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
          toast({ title: 'Produkt gelöscht' });
          refreshData();
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
      <div className="flex justify-between items-start mb-6">
        <PageHeader title="Produkte" description="Verwalten Sie Ihre Produktkategorien und Artikel." className="mb-0" />
        <Button onClick={() => setIsCategoryModalOpen(true)} className="hidden md:flex" size="sm"><PlusCircle className="mr-2 h-4 w-4"/>Neue Kategorie</Button>
      </div>
      
        <div className="space-y-6">
          {categories.map((category) => {
            const productsInCategory = products.filter(p => p.categoryId === category.id);
            return (
              <Card key={category.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{category.name}</CardTitle>
                  <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="hidden md:flex" onClick={() => handleOpenProductModal(null, category.id)}><PlusCircle className="mr-2 h-4 w-4" />Produkt hinzufügen</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive h-8 w-8 hidden md:flex"><Trash2 className="w-4 h-4" /></Button>
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
                            <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>Löschen</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {productsInCategory.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {productsInCategory.map(product => (
                         <Card key={product.id} className="overflow-hidden flex flex-col group relative transition-all hover:shadow-lg">
                          <div className="relative aspect-[4/3] bg-muted">
                             <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" data-ai-hint={product.imageHint} />
                              {product.type === 'package' && <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground" variant="secondary">PAKET</Badge>}
                          </div>
                          <CardContent className="p-3 flex flex-col flex-1">
                              <h3 className="font-semibold text-base leading-tight">{product.name}</h3>
                              <div className="flex items-baseline justify-between mt-1">
                                  <p className="text-lg font-bold text-primary">€{(product.price || 0).toFixed(2)}</p>
                                  <span className="text-xs text-muted-foreground">/ {product.unit}</span>
                              </div>
                              {product.availabilityDay && <Badge variant="secondary" className="mt-1 w-fit text-xs">{product.availabilityDay} only</Badge>}
                              <div className="mt-2 text-xs text-muted-foreground">
                                  <span>Bestellt (30T): </span>
                                  <span className="font-bold">{product.timesOrderedLast30Days ?? 0}</span>
                              </div>
                               <div className="mt-auto pt-3 flex items-center justify-between gap-4 border-t mt-3">
                                  <div className="flex items-center space-x-2">
                                      <Switch 
                                          id={`availability-${product.id}`} 
                                          checked={product.isAvailable} 
                                          onCheckedChange={() => handleAvailabilityToggle(product.id, product.isAvailable)}
                                          disabled={isPending}
                                      />
                                      <Label htmlFor={`availability-${product.id}`} className="text-xs">
                                          {product.isAvailable ? "Verfügbar" : "Inaktiv"}
                                      </Label>
                                  </div>
                                  <div className="flex items-center">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenProductModal(product, category.id)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                     <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                          <Trash2 className="w-4 h-4"/>
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Möchten Sie das Produkt '{product.name}' wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>Löschen</AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                              </div>
                          </CardContent>
                         </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground bg-secondary/30 rounded-md">
                      <p className="text-sm">Noch keine Produkte in dieser Kategorie.</p>
                      <Button variant="link" size="sm" className="mt-1" onClick={() => handleOpenProductModal(null, category.id)}>Fügen Sie das erste Produkt hinzu</Button>
                    </div>
                  )}
                   <Button variant="outline" size="sm" className="flex md:hidden w-full mt-4" onClick={() => handleOpenProductModal(null, category.id)}><PlusCircle className="mr-2 h-4 w-4" />Produkt hinzufügen</Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

       <div className="md:hidden fixed bottom-20 right-4 z-20">
          <Button size="lg" className="rounded-full h-14 w-14 shadow-lg" onClick={() => setIsCategoryModalOpen(true)}>
              <Plus className="h-6 w-6" />
          </Button>
      </div>

      {/* Create/Edit Category Modal */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neue Kategorie erstellen</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category-name" className="text-right">Name</Label>
                  <Input id="category-name" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="col-span-3"/>
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
      
      {/* Create/Edit Product Modal */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>{editingProduct?.id ? 'Produkt bearbeiten' : 'Neues Produkt erstellen'}</DialogTitle>
                <DialogDescription>
                    {editingProduct?.id ? 'Aktualisieren Sie die Details dieses Produkts.' : 'Fügen Sie ein neues Produkt zu dieser Kategorie hinzu.'}
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveProduct} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
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
                
                 {/* Nur sichtbar wenn type === 'package' */}
                {editingProduct?.type === 'package' && (
                    <div className="space-y-3 border p-3 rounded-lg bg-secondary/50">
                    <h3 className="font-semibold text-primary text-sm">Paket-Inhalt definieren</h3>
                    
                    <div className="flex gap-2">
                        <Input 
                        placeholder="Menge (z.B. 200g)" 
                        className="w-1/3 bg-background"
                        value={tempAmount}
                        onChange={e => setTempAmount(e.target.value)} 
                        />
                        <Input 
                        placeholder="Produktname" 
                        className="w-2/3 bg-background" 
                        value={tempItem}
                        onChange={e => setTempItem(e.target.value)}
                        />
                        <Button onClick={addPackageItem} type="button" variant="secondary" size="icon" className="h-10 w-10 shrink-0"><Plus className="h-4 w-4"/></Button>
                    </div>

                    <ul className="space-y-2 mt-2">
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
                
                <DialogFooter className="mt-4 sticky bottom-0 bg-background py-4">
                    <DialogClose asChild><Button type="button" variant="outline">Abbrechen</Button></DialogClose>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 animate-spin h-4 w-4" />}
                        Speichern
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
    </>
  );
}
