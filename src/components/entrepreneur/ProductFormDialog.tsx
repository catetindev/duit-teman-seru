import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/entrepreneur';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Loader2 } from 'lucide-react';

interface ProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onSubmitSuccess: () => void;
}

type FormErrors = {
  [key: string]: string;
};

const PREDEFINED_CATEGORIES = [
  'Elektronik',
  'Pakaian',
  'Buku',
  'Jasa',
  'Makanan & Minuman',
  'Software',
  'Konsultasi',
  'Lainnya'
];

export default function ProductFormDialog({ open, onClose, product, onSubmitSuccess }: ProductFormDialogProps) {
  const isEditMode = !!product;
  
  const [formData, setFormData] = useState<Partial<Product> & { name: string, type: string, category: string, price: number, cost: number }>({
    name: '',
    type: 'product',
    category: 'Lainnya',
    price: 0,
    cost: 0,
    stock: 0,
    status: true,
    is_best_seller: false,
  });
  
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        type: product.type,
        category: product.category,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
        status: product.status,
        is_best_seller: product.is_best_seller,
        image_url: product.image_url,
      });
      
      if (product.image_url) {
        setImagePreview(product.image_url);
      }
      
      // Check if category is custom
      if (!PREDEFINED_CATEGORIES.includes(product.category)) {
        setCustomCategory(product.category);
        setFormData(prev => ({ ...prev, category: 'Lainnya' }));
      } else {
        setCustomCategory('');
      }
    } else {
      resetForm();
    }
  }, [product, open]); // Added `open` to dependencies to reset form when dialog reopens for new product

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'product',
      category: 'Lainnya',
      price: 0,
      cost: 0,
      stock: 0,
      status: true,
      is_best_seller: false,
    });
    setImage(null);
    setImagePreview(null);
    setCustomCategory('');
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (['price', 'cost', 'stock'].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'category' && value !== 'Lainnya') {
      setCustomCategory('');
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setImage(null);
      setImagePreview(null);
      return;
    }
    
    const file = e.target.files[0];
    setImage(file);
    
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    
    if (errors['image']) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Nama produk wajib diisi';
    if (formData.category === 'Lainnya' && !customCategory.trim()) {
      newErrors.category = 'Kategori custom wajib diisi kalau pilih Lainnya';
    } else if (!formData.category?.trim()) {
      newErrors.category = 'Kategori wajib dipilih';
    }
    if (formData.price === undefined || formData.price <= 0) newErrors.price = 'Harga jual harus lebih dari 0';
    if (formData.cost === undefined || formData.cost < 0) newErrors.cost = 'Modal awal nggak boleh minus';
    if (formData.type === 'product' && (formData.stock === undefined || formData.stock < 0)) {
      newErrors.stock = 'Stok nggak boleh minus';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!image) return formData.image_url || null;
    
    try {
      setUploading(true);
      if (isEditMode && formData.image_url) {
        const oldImagePath = formData.image_url.split('/').pop();
        if (oldImagePath) await supabase.storage.from('products').remove([oldImagePath]);
      }
      
      const fileExt = image.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('products').upload(fileName, image);
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error: any) {
      toast({ title: 'Error Upload Gambar', description: `Gagal upload: ${error.message}`, variant: 'destructive' });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      let imageUrl = formData.image_url || null;
      if (image) { // If a new image is selected, upload it
        imageUrl = await uploadImage();
      } else if (!image && isEditMode && !formData.image_url) { // If image was removed
        imageUrl = null;
      }

      const finalCategory = formData.category === 'Lainnya' && customCategory ? customCategory : formData.category;
      
      const productData = {
        ...formData,
        category: finalCategory,
        image_url: imageUrl,
        user_id: isEditMode ? product!.user_id : (await supabase.auth.getUser()).data.user?.id,
      };
      
      if (isEditMode) {
        const { error } = await supabase.from('products').update(productData).eq('id', product!.id);
        if (error) throw error;
        toast({ title: 'Hore!', description: 'Produk berhasil diupdate!' });
      } else {
        const { error } = await supabase.from('products').insert(productData);
        if (error) throw error;
        toast({ title: 'Sip!', description: 'Produk baru berhasil ditambahin!' });
      }
      
      onSubmitSuccess();
      resetForm(); // Reset form after successful submission
    } catch (error: any) {
      toast({ title: 'Oops!', description: error.message || 'Gagal simpan produk, coba lagi ya', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const calculateProfit = (): number => (formData.price || 0) - (formData.cost || 0);
  const calculateProfitMargin = (): string => {
    const price = formData.price || 0;
    if (price === 0) return '0%';
    const margin = ((calculateProfit() / price) * 100);
    return `${margin.toFixed(1)}%`;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) { onClose(); resetForm(); } }}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Produk Lama' : 'Tambah Produk Baru'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name">Nama Produk Kerenmu *</Label>
              <Input id="name" name="name" value={formData.name || ''} onChange={handleInputChange} className={errors.name ? 'border-red-500' : ''} placeholder="Contoh: Kaos Oversize Gaul"/>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Jenisnya Apa Nih?</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                  <SelectTrigger><SelectValue placeholder="Pilih tipe" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Produk</SelectItem>
                    <SelectItem value="service">Layanan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="category">Masuk Kategori Apa? *</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
                {formData.category === 'Lainnya' && (
                  <Input className="mt-2" placeholder="Ketik kategori custom..." value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} />
                )}
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Harga Jual (Rp) *</Label>
                <Input id="price" name="price" type="number" value={formData.price || ''} onChange={handleInputChange} min="0" className={errors.price ? 'border-red-500' : ''} placeholder="150000"/>
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>
              <div>
                <Label htmlFor="cost">Modal Awal (Rp) *</Label>
                <Input id="cost" name="cost" type="number" value={formData.cost || ''} onChange={handleInputChange} min="0" className={errors.cost ? 'border-red-500' : ''} placeholder="75000"/>
                {errors.cost && <p className="text-red-500 text-xs mt-1">{errors.cost}</p>}
              </div>
            </div>

            <div>
              <Label>Cuan Kamu Nih!</Label>
              <div className="flex items-center gap-2 border rounded-md p-2 bg-muted">
                <div className="text-lg font-medium">{calculateProfitMargin()}</div>
                <div className="text-sm text-muted-foreground">(Rp {calculateProfit().toLocaleString('id-ID')})</div>
              </div>
            </div>

            {formData.type === 'product' && (
              <div>
                <Label htmlFor="stock">Stok Barang (kalau ada)</Label>
                <Input id="stock" name="stock" type="number" value={formData.stock || ''} onChange={handleInputChange} min="0" className={errors.stock ? 'border-red-500' : ''} placeholder="100"/>
                {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
              </div>
            )}
            
            <div>
              <Label htmlFor="image">Foto Produk (opsional)</Label>
              <div className="mt-1 flex flex-col items-start gap-2">
                {imagePreview && (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="h-24 w-24 object-cover rounded-md border"/>
                    <Button type="button" variant="destructive" size="sm" className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full" onClick={() => { setImage(null); setImagePreview(null); setFormData(prev => ({ ...prev, image_url: undefined })); }}>X</Button>
                  </div>
                )}
                <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} className="max-w-xs"/>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="status" className="text-sm">Masih Dijual?</Label>
              <Switch id="status" checked={formData.status} onCheckedChange={(checked) => handleSwitchChange('status', checked)}/>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="is_best_seller" className="text-sm">Lagi Hits Banget?</Label>
              <Switch id="is_best_seller" checked={formData.is_best_seller} onCheckedChange={(checked) => handleSwitchChange('is_best_seller', checked)}/>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => { onClose(); resetForm(); }}>Nggak Jadi Deh</Button>
            <Button type="submit" disabled={submitting || uploading} className="bg-amber-500 hover:bg-amber-600">
              {(submitting || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? 'Simpan Perubahan' : 'Gaskeun Tambah!'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}