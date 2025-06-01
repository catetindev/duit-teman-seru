
export interface Product {
  id: string;
  name: string;
  type: 'product' | 'service';
  category: string;
  price: number;
  cost: number;
  stock: number;
  status: boolean;
  is_best_seller: boolean;
  image_url?: string;
  created_at: string;
  user_id: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  tags?: string[];
  last_order_date?: string;
  created_at: string;
  user_id: string;
}

export interface Order {
  id: string;
  order_date: string;
  customer_id: string;
  products: OrderProduct[];
  total: number;
  status: 'Pending' | 'Paid' | 'Canceled';
  payment_method: 'Cash' | 'Transfer' | 'QRIS';
  payment_proof_url?: string;
  created_at: string;
  user_id: string;
  customer?: Customer;
}

export interface OrderProduct {
  product_id: string;
  quantity: number;
  price?: number;
  name?: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  items: any[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: string;
  payment_method?: string;
  payment_due_date: string;
  payment_proof_url?: string;
  notes?: string;
  created_at: string;
  user_id: string;
}
