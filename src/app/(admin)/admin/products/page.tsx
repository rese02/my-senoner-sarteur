'use client';
import { PageHeader } from "@/components/common/PageHeader";
import { mockCategories, mockProducts } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, Edit, Loader2, XCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import type { Product, Category } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ImageUploader } from "@/components/custom/ImageUploader";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);


  const handleAvailabilityToggle = (productId: string) => {
    startTransition(() => {
        const originalProducts = [...products];
        setProducts(prevProducts =>
            prevProducts.map(p =>
                p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p
            )
        );
        // Mock server action
        new Promise<boolean>((resolve) => {
            setTimeout(() => {
                const success = Math.random() > 0.1; // 90% success rate
                resolve(success);
            }, 300);
        }).then(success => {
            if (!success) {
                setProducts(originalProducts);
                toast({ variant: 'destructive', title: 'Update failed' });
            }
        });
    });
  };

  const handleCreateCategory = () => {
      if (!newCategoryName) {
        toast({ variant: 'destructive', title: 'Category name is required' });
        return;
      }
      startTransition(() => {
        const newCategory: Category = {
            id: `cat-${Date.now()}`,
            name: newCategoryName,
        };
        setCategories(prev => [...prev, newCategory]);
        toast({ title: 'Category created!' });
        setNewCategoryName('');
        setIsCategoryModalOpen(false);
      });
  };
  
  const handleDeleteCategory = (categoryId: string) => {
      startTransition(() => {
        setCategories(prev => prev.filter(c => c.id !== categoryId));
        setProducts(prev => prev.filter(p => p.categoryId !== categoryId));
        toast({ title: 'Category deleted' });
      });
  };

  const handleOpenProductModal = (product: Product | null, categoryId: string) => {
      setEditingProduct(product ? { ...product } : { name: '', price: 0, unit: '', imageUrl: '', imageHint: ''});
      setCurrentCategoryId(categoryId);
      setIsProductModalOpen(true);
  };

  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!editingProduct) return;
      const { name, value } = e.target;
      setEditingProduct({ ...editingProduct, [name]: value });
  };

  const handleImageUpload = (url: string) => {
      if (!editingProduct) return;
      setEditingProduct({ ...editingProduct, imageUrl: url });
  };
  
  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      if (!editingProduct || !editingProduct.name || !editingProduct.price) {
          toast({ variant: 'destructive', title: 'Name and Price are required' });
          return;
      }

      startTransition(() => {
          if (editingProduct.id) {
              // Update existing product
              setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...editingProduct } as Product : p));
              toast({ title: 'Product updated!' });
          } else {
              // Create new product
              const newProduct: Product = {
                  ...editingProduct,
                  id: `prod-${Date.now()}`,
                  categoryId: currentCategoryId!,
                  isAvailable: true,
                  price: Number(editingProduct.price)
              } as Product;
              setProducts(prev => [...prev, newProduct]);
              toast({ title: 'Product created!' });
          }
          setIsProductModalOpen(false);
          setEditingProduct(null);
      });
  };

  const handleDeleteProduct = (productId: string) => {
      startTransition(() => {
        setProducts(prev => prev.filter(p => p.id !== productId));
        toast({ title: 'Product deleted' });
      });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <PageHeader title="Produkte" description="Verwalten Sie Ihre Produktkategorien und Artikel." className="mb-0" />
        <Button onClick={() => setIsCategoryModalOpen(true)}><PlusCircle className="mr-2"/>Neue Kategorie</Button>
      </div>
      
      <div className="space-y-8">
        {categories.map((category) => {
          const productsInCategory = products.filter(p => p.categoryId === category.id);
          return (
            <Card key={category.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{category.name}</CardTitle>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenProductModal(null, category.id)}><PlusCircle className="mr-2" />Produkt hinzufügen</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {productsInCategory.map(product => (
                       <Card key={product.id} className="overflow-hidden flex flex-col group relative">
                        <div className="relative aspect-[4/3] bg-muted">
                           <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" data-ai-hint={product.imageHint} />
                        </div>
                        <CardContent className="p-4 flex flex-col flex-1">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <div className="flex items-baseline justify-between mt-2">
                                <p className="text-xl font-bold text-primary">€{product.price.toFixed(2)}</p>
                                <span className="text-sm text-muted-foreground">/ {product.unit}</span>
                            </div>
                            {product.availabilityDay && <Badge variant="secondary" className="mt-2 w-fit">{product.availabilityDay} only</Badge>}
                            <div className="mt-4 text-xs text-muted-foreground">
                                <span>Bestellt (30T): </span>
                                <span className="font-bold">{product.timesOrderedLast30Days ?? 0}</span>
                            </div>
                             <div className="mt-auto pt-4 flex items-center justify-between gap-4">
                                <div className="flex items-center space-x-2">
                                    <Switch 
                                        id={`availability-${product.id}`} 
                                        checked={product.isAvailable} 
                                        onCheckedChange={() => handleAvailabilityToggle(product.id)}
                                        disabled={isPending}
                                    />
                                    <Label htmlFor={`availability-${product.id}`} className="text-xs">
                                        {product.isAvailable ? "Verfügbar" : "Inaktiv"}
                                    </Label>
                                </div>
                                <div className="flex items-center gap-1">
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
                  <div className="text-center py-8 text-muted-foreground bg-secondary/50 rounded-md">
                    <p>Noch keine Produkte in dieser Kategorie.</p>
                    <Button variant="link" className="mt-2" onClick={() => handleOpenProductModal(null, category.id)}>Fügen Sie das erste Produkt hinzu</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
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
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>{editingProduct?.id ? 'Produkt bearbeiten' : 'Neues Produkt erstellen'}</DialogTitle>
                <DialogDescription>
                    {editingProduct?.id ? 'Aktualisieren Sie die Details dieses Produkts.' : 'Fügen Sie ein neues Produkt zu dieser Kategorie hinzu.'}
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveProduct} className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={editingProduct?.name || ''} onChange={handleProductFormChange} required />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="price">Preis (€)</Label>
                        <Input id="price" name="price" type="number" step="0.01" value={editingProduct?.price || ''} onChange={handleProductFormChange} required/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="unit">Einheit</Label>
                        <Input id="unit" name="unit" value={editingProduct?.unit || ''} onChange={handleProductFormChange} placeholder="z.B. kg, stück"/>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Produktbild</Label>
                    <ImageUploader 
                        onUploadComplete={handleImageUpload}
                        currentImageUrl={editingProduct?.imageUrl}
                        folder="products"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="imageHint">Bild-Hinweis für KI</Label>
                    <Input id="imageHint" name="imageHint" value={editingProduct?.imageHint || ''} onChange={handleProductFormChange} placeholder="z.B. sushi box" />
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Abbrechen</Button></DialogClose>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 animate-spin" />}
                        Speichern
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>

    </>
  );
}
