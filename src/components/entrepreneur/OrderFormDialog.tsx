import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Customer, Order, OrderProduct, Product } from '@/types/entrepreneur';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { v4 as uuidv4 } from 'uuid';
import { OrderFormHeader } from './order/OrderFormHeader';
import { CustomerSelection } from './order/CustomerSelection';
import { PaymentMethodSelection } from './order/PaymentMethodSelection';
import { OrderProductsTable } from './order/OrderProductsTable';
import { OrderStatusSelection } from './order/OrderStatusSelection';
import { PaymentProofUploader } from './order/PaymentProofUploader';
import { updateProductStock } from '@/utils/inventoryUtils';

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
  
  const [formData, setFormData] = useState<Partial<Order> & { customer_id: string, payment_method: string, total: number }>({
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
        [field]: String(value), // Ensure product_id is always a string
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
        payment_proof_url: proofUrl,
        user_id: isEditMode ? order!.user_id : (await supabase.auth.getUser()).data.user?.id,
      };
      
      if (isEditMode) {
        // Get original order to check status change
        const { data: originalOrder } = await supabase
          .from('orders')
          .select('status, products')
          .eq('id', order!.id)
          .single();
        
        // Update existing order
        const { error } = await supabase
          .from('orders')
          .update(orderData)
          .eq('id', order!.id);
          
        if (error) throw error;

        // Handle stock changes based on status change
        if (originalOrder) {
          const previousStatus = originalOrder.status;
          const newStatus = formData.status;
          
          // If order was canceled and is now marked as paid, reduce stock
          if (previousStatus === 'Canceled' && newStatus === 'Paid') {
            await updateProductStock(productsData, true);
          }
          // If order was paid and is now canceled, restore stock
          else if (previousStatus === 'Paid' && newStatus === 'Canceled') {
            await updateProductStock(productsData, false);
          }
        }
        
        toast({ title: 'Success', description: 'Order updated successfully' });
      } else {
        // Add new order
        const { error, data } = await supabase
          .from('orders')
          .insert(orderData)
          .select();
          
        if (error) throw error;

        // Only reduce stock if order status is Paid
        if (formData.status === 'Paid') {
          await updateProductStock(productsData, true);
        }
        
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
        <OrderFormHeader isEditMode={isEditMode} />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Selection */}
            <CustomerSelection
              customers={customers}
              selectedCustomerId={formData.customer_id}
              onCustomerChange={(value) => handleSelectChange('customer_id', value)}
              error={errors.customer_id}
            />
            
            {/* Payment Method */}
            <PaymentMethodSelection 
              value={formData.payment_method}
              onChange={(value) => handleSelectChange('payment_method', value)}
            />
          </div>
          
          {/* Products Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Products/Services *</label>
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
            
            <OrderProductsTable
              products={products}
              orderProducts={orderProducts}
              onProductChange={handleProductChange}
              onRemoveProduct={handleRemoveProduct}
            />
            
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
            <OrderStatusSelection
              value={formData.status || 'Pending'}
              onChange={(value) => handleSelectChange('status', value)}
            />
            
            <PaymentProofUploader
              previewUrl={paymentProofPreview}
              onFileChange={handlePaymentProofChange}
              onRemove={() => {
                setPaymentProof(null);
                setPaymentProofPreview(null);
                setFormData(prev => ({ ...prev, payment_proof_url: undefined }));
              }}
            />
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
