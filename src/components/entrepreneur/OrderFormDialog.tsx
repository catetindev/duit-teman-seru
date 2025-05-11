
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Customer, Order, OrderProduct, Product } from '@/types/entrepreneur';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/utils/formatUtils';
import { v4 as uuidv4 } from 'uuid';

interface OrderFormDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  onSubmitSuccess: () => void;
  customers: Customer[];
  products: Product[];
}

type FormErrors = {
  [key: string]: string;
};

export default function OrderFormDialog({ 
  open, 
  onClose, 
  order, 
  onSubmitSuccess,
  customers,
  products
}: OrderFormDialogProps) {
  const isEditMode = !!order;
  
  const [formData, setFormData] = useState<Partial<Order>>({
    customer_id: '',
    products: [],
    total: 0,
    payment_method: 'Cash',
    status: 'Pending'
  });
  
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (order) {
      setFormData({
        customer_id: order.customer_id,
        products: order.products,
        total: order.total,
        payment_method: order.payment_method,
        status: order.status,
        payment_proof_url: order.payment_proof_url
      });
      
      if (order.payment_proof_url) {
        setPaymentProofPreview(order.payment_proof_url);
      }
      
      // Enhance order products with names
      const enhancedProducts = order.products.map(item => ({
        ...item,
        name: products.find(p => p.id === item.product_id)?.name,
        price: products.find(p => p.id === item.product_id)?.price
      }));
      
      setOrderProducts(enhancedProducts);
    } else {
      resetForm();
    }
  }, [order, products]);

  const resetForm = () => {
    setFormData({
      customer_id: '',
      products: [],
      total: 0,
      payment_method: 'Cash',
      status: 'Pending'
    });
    setOrderProducts([]);
    setPaymentProof(null);
    setPaymentProofPreview(null);
    setErrors({});
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setPaymentProof(null);
      setPaymentProofPreview(null);
      return;
    }
    
    const file = e.target.files[0];
    setPaymentProof(file);
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPaymentProofPreview(objectUrl);
  };

  const handleAddProduct = () => {
    setOrderProducts(prev => [
      ...prev,
      {
        product_id: '',
        quantity: 1
      }
    ]);
  };

  const handleRemoveProduct = (index: number) => {
    const newProducts = [...orderProducts];
    newProducts.splice(index, 1);
    setOrderProducts(newProducts);
    updateTotalAmount(newProducts);
  };

  const handleProductChange = (index: number, field: keyof OrderProduct, value: string | number) => {
    const newProducts = [...orderProducts];
    
    if (field === 'product_id') {
      const selectedProduct = products.find(p => p.id === value);
      newProducts[index] = {
        ...newProducts[index],
        [field]: value,
        name: selectedProduct?.name,
        price: selectedProduct?.price
      };
    } else {
      newProducts[index] = {
        ...newProducts[index],
        [field]: value
      };
    }
    
    setOrderProducts(newProducts);
    updateTotalAmount(newProducts);
  };

  const updateTotalAmount = (items: OrderProduct[]) => {
    let total = 0;
    
    items.forEach(item => {
      const productPrice = products.find(p => p.id === item.product_id)?.price || 0;
      total += productPrice * (item.quantity || 0);
    });
    
    setFormData(prev => ({
      ...prev,
      total
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.customer_id) {
      newErrors.customer_id = 'Customer is required';
    }
    
    if (!orderProducts.length) {
      newErrors.products = 'At least one product is required';
    } else {
      // Check if all products have valid selections
      const invalidProduct = orderProducts.findIndex(item => !item.product_id);
      if (invalidProduct !== -1) {
        newErrors.products = `Product #${invalidProduct + 1} is not selected`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadPaymentProof = async (): Promise<string | null> => {
    if (!paymentProof) return formData.payment_proof_url || null;
    
    try {
      setUploading(true);
      
      // Delete old file if exists in edit mode
      if (isEditMode && formData.payment_proof_url) {
        const oldFilePath = formData.payment_proof_url.split('/').pop();
        if (oldFilePath) {
          await supabase.storage.from('products').remove([oldFilePath]);
        }
      }
      
      // Upload new file
      const fileExt = paymentProof.name.split('.').pop();
      const fileName = `payment_${uuidv4()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, paymentProof);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to upload payment proof: ${error.message}`,
        variant: 'destructive',
      });
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
      // Upload payment proof if selected
      let proofUrl = null;
      if (paymentProof || formData.payment_proof_url) {
        proofUrl = await uploadPaymentProof();
      }
      
      // Prepare products data for storage
      const productsData = orderProducts.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      }));
      
      const orderData = {
        ...formData,
        products: productsData,
        payment_proof_url: proofUrl
      };
      
      if (isEditMode) {
        // Update existing order
        const { error } = await supabase
          .from('orders')
          .update(orderData)
          .eq('id', order.id);
          
        if (error) throw error;
        
        toast({ title: 'Success', description: 'Order updated successfully' });
      } else {
        // Add new order
        const { error } = await supabase
          .from('orders')
          .insert(orderData);
          
        if (error) throw error;
        
        toast({ title: 'Success', description: 'Order added successfully' });
      }
      
      // Update customer's last order date
      await supabase
        .from('customers')
        .update({ last_order_date: new Date().toISOString() })
        .eq('id', formData.customer_id);
      
      onSubmitSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save order',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Order' : 'Create New Order'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Selection */}
            <div>
              <Label htmlFor="customer">Customer *</Label>
              <Select
                value={formData.customer_id}
                onValueChange={(value) => handleSelectChange('customer_id', value)}
              >
                <SelectTrigger className={errors.customer_id ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.customer_id && <p className="text-red-500 text-xs mt-1">{errors.customer_id}</p>}
            </div>
            
            {/* Payment Method */}
            <div>
              <Label htmlFor="payment_method">Payment Method</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value) => handleSelectChange('payment_method', value as Order['payment_method'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Transfer">Transfer</SelectItem>
                  <SelectItem value="QRIS">QRIS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Products Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Products/Services *</Label>
              <Button 
                type="button" 
                onClick={handleAddProduct} 
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            </div>
            
            {errors.products && <p className="text-red-500 text-xs mb-2">{errors.products}</p>}
            
            {orderProducts.length === 0 ? (
              <div className="text-center p-4 border rounded-md bg-muted/20">
                No products added yet. Click "Add Product" to begin.
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="w-24">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderProducts.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Select
                            value={item.product_id}
                            onValueChange={(value) => handleProductChange(index, 'product_id', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map(product => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} ({product.type})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 1)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {item.price ? formatCurrency(item.price) : '-'}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {item.price ? formatCurrency(item.price * (item.quantity || 0)) : '-'}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveProduct(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {/* Order Total */}
            <div className="flex justify-end mt-2">
              <div className="bg-muted/20 p-2 rounded-md">
                <span className="mr-2">Order Total:</span>
                <span className="font-bold">
                  {formatCurrency(formData.total || 0)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Payment Status & Proof */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Payment Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value as Order['status'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="payment_proof">Payment Proof (Optional)</Label>
              <div className="mt-1">
                {paymentProofPreview ? (
                  <div className="relative">
                    <img
                      src={paymentProofPreview}
                      alt="Payment Proof"
                      className="h-32 object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        setPaymentProof(null);
                        setPaymentProofPreview(null);
                        setFormData(prev => ({ ...prev, payment_proof_url: undefined }));
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <Input
                    id="payment_proof"
                    name="payment_proof"
                    type="file"
                    accept="image/*"
                    onChange={handlePaymentProofChange}
                  />
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={submitting || uploading}>
              {(submitting || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? 'Update Order' : 'Create Order'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
