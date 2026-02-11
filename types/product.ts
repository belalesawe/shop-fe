export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  category_id: number | null;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
}
