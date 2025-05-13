
import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ProductList from '@/components/entrepreneur/ProductList';
import ProductFormDialog from '@/components/entrepreneur/ProductFormDialog';
import { Product } from '@/types/entrepreneur';
import { Filter, Plus, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Products() {
  const { isPremium } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  // Memoize fetchProducts to prevent it from being recreated on every render
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;

      if (data) {
        const typedProducts = data.map(item => ({
          ...item,
          type: item.type === 'product' ? 'product' : 'service' 
        } as Product));
        
        setProducts(typedProducts);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(typedProducts.map(product => product.category))];
        setCategories(uniqueCategories);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // Include fetchProducts in the dependency array

  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Check if product has an image, delete it first
      const productToDelete = products.find(p => p.id === id);
      if (productToDelete?.image_url) {
        const imagePath = productToDelete.image_url.split('/').pop();
        if (imagePath) {
          await supabase.storage.from('products').remove([imagePath]);
        }
      }
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setProducts(products.filter(product => product.id !== id));
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitSuccess = () => {
    fetchProducts();
    setIsFormOpen(false);
  };

  // Filter products based on search query, category and status
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && product.status) || 
                         (statusFilter === 'inactive' && !product.status);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Produk & Layanan</h1>
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Tambah Produk Baru
          </Button>
        </div>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>{categoryFilter === 'all' ? 'Semua Kategori' : categoryFilter}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>
                  {statusFilter === 'all' ? 'Semua Status' : 
                   statusFilter === 'active' ? 'Aktif Saja' : 'Nonaktif Saja'}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="active">Aktif Saja</SelectItem>
              <SelectItem value="inactive">Nonaktif Saja</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Product List */}
        <ProductList 
          products={filteredProducts} 
          loading={loading} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />

        {/* Product Form Dialog */}
        <ProductFormDialog 
          open={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          product={selectedProduct} 
          onSubmitSuccess={handleSubmitSuccess}
        />
      </div>
    </DashboardLayout>
  );
}
