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
  'Electronics',
  'Clothing',
  'Books',
  'Services',
  'Food',
  'Software',
  'Consultation',
  'Other'
];

export default function ProductFormDialog({ open, onClose, product, onSubmitSuccess }: ProductFormDialogProps) {
  const isEditMode = !!product;
  
  const [formData, setFormData] = useState<Partial<Product> & { name: string, type: string, category: string, price: number, cost: number }>({
    name: '',
    type: 'product',
    category: 'Other',
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
      }
    } else {
      resetForm();
    }
  }, [product]);

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'product',
      category: 'Other',
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
    
    // Convert numeric values
    if (['price', 'cost', 'stock'].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
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
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    
    // Clear error when field is edited
    if (errors['image']) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.category?.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (formData.price === undefined || formData.price < 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (formData.cost === undefined || formData.cost < 0) {
      newErrors.cost = 'Cost must be a positive number';
    }
    
    if (formData.type === 'product' && (formData.stock === undefined || formData.stock < 0)) {
      newErrors.stock = 'Stock must be a non-negative number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!image) return formData.image_url || null;
    
    try {
      setUploading(true);
      
      // Delete old image if exists in edit mode
      if (isEditMode && formData.image_url) {
        const oldImagePath = formData.image_url.split('/').pop();
        if (oldImagePath) {
          await supabase.storage.from('products').remove([oldImagePath]);
        }
      }
      
      // Upload new image
      const fileExt = image.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, image);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to upload image: ${error.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use custom category if selected
    if (formData.category === 'Other' && customCategory) {
      setFormData(prev => ({ ...prev, category: customCategory }));
    }
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      // Upload image if selected
      let imageUrl = null;
      if (image || formData.image_url) {
        imageUrl = await uploadImage();
      }
      
      const productData = {
        ...formData,
        image_url: imageUrl,
        category: formData.category === 'Other' && customCategory ? customCategory : formData.category,
        user_id: isEditMode ? product!.user_id : (await supabase.auth.getUser()).data.user?.id,
      };
      
      if (isEditMode) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product!.id);
          
        if (error) throw error;
        
        toast({ title: 'Success', description: 'Product updated successfully' });
      } else {
        // Add new product
        const { error } = await supabase
          .from('products')
          .insert(productData);
          
        if (error) throw error;
        
        toast({ title: 'Success', description: 'Product added successfully' });
      }
      
      onSubmitSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save product',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate profit margin for display
  const calculateProfit = (): number => {
    if (!formData.price || !formData.cost) return 0;
    return formData.price - formData.cost;
  };
  
  const calculateProfitMargin = (): string => {
    if (!formData.price) return '0%';
    const margin = ((calculateProfit() / formData.price) * 100);
    return `${margin.toFixed(1)}%`;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.category === 'Other' && (
                  <Input
                    className="mt-2"
                    placeholder="Enter custom category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                  />
                )}
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price || 0}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
                
                <div>
                  <Label htmlFor="cost">Cost *</Label>
                  <Input
                    id="cost"
                    name="cost"
                    type="number"
                    value={formData.cost || 0}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={errors.cost ? 'border-red-500' : ''}
                  />
                  {errors.cost && <p className="text-red-500 text-xs mt-1">{errors.cost}</p>}
                </div>
              </div>
              
              <div>
                <Label>Profit Margin</Label>
                <div className="flex items-center gap-2 border rounded-md p-2">
                  <div className="text-lg font-medium">{calculateProfitMargin()}</div>
                  <div className="text-sm text-muted-foreground">
                    ({calculateProfit().toLocaleString('en-US', { style: 'currency', currency: 'USD' })})
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column */}
            <div className="space-y-4">
              {formData.type === 'product' && (
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock || 0}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                    className={errors.stock ? 'border-red-500' : ''}
                  />
                  {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                </div>
              )}
              
              <div>
                <Label htmlFor="image">Product Image</Label>
                <div className="mt-1 flex items-center">
                  {imagePreview ? (
                    <div className="relative w-full">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-md border"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, image_url: undefined }));
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="status">Active</Label>
                <Switch
                  id="status"
                  checked={formData.status}
                  onCheckedChange={(checked) => handleSwitchChange('status', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="is_best_seller">Best Seller</Label>
                <Switch
                  id="is_best_seller"
                  checked={formData.is_best_seller}
                  onCheckedChange={(checked) => handleSwitchChange('is_best_seller', checked)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={submitting || uploading}>
              {(submitting || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
