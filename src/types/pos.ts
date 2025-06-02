export interface PosProduct {
  id: string;
  nama: string;
  harga: number;
  kategori: string;
  stok: number;
  qty: number;
  image?: string;
  description?: string;
}

export interface PosCartItem extends PosProduct {
  quantity: number;
  subtotal: number;
}

export interface PosTransaction {
  id?: string;
  tanggal?: Date;
  produk: PosProduct[];
  total: number;
  metode_pembayaran: 'Cash' | 'Bank Transfer' | 'QRIS';
  nama_pembeli?: string;
  uang_diterima?: number;
  kembalian?: number;
  user_id?: string;
}
