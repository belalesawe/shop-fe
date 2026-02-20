export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category_id: number | null;
  category_name: string | null;
  created_at: string;
}

export interface ProductDetail extends Product {
  stock_quantity: number;
  stock_reserved: number;
  stock_available: number;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
}
