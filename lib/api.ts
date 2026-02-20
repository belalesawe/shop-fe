import { Product, ProductDetail, Category } from "@/types/product";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function fetchProducts(
  search?: string,
  categoryId?: number
): Promise<Product[]> {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (categoryId) params.set("categoryId", categoryId.toString());

  const query = params.toString();
  const endpoint = `/api/v1/products${query ? `?${query}` : ""}`;

  return fetchApi<Product[]>(endpoint);
}

export async function fetchProduct(id: number): Promise<ProductDetail> {
  return fetchApi<ProductDetail>(`/api/v1/products/${id}`);
}

export async function fetchCategories(): Promise<Category[]> {
  return fetchApi<Category[]>("/api/v1/categories");
}
