const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new ApiError(res.status, body.detail || "Request failed");
  }

  return res.json();
}

// --- Products ---

import type { Product, Category } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  return request<Product[]>("/products");
}

export async function getProduct(id: number): Promise<Product> {
  return request<Product>(`/products/${id}`);
}

export async function getCategories(): Promise<Category[]> {
  return request<Category[]>("/categories");
}

// --- Users ---

import type { User, CreateUserInput } from "@/types/user";

export async function getUsers(): Promise<User[]> {
  return request<User[]>("/users");
}

export async function getUser(id: number): Promise<User> {
  return request<User>(`/users/${id}`);
}

export async function createUser(data: CreateUserInput): Promise<User> {
  return request<User>("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// --- Inventory ---

import type { Inventory } from "@/types/inventory";

export async function getInventory(productId: number): Promise<Inventory> {
  return request<Inventory>(`/inventory/${productId}`);
}

export async function getAllInventory(): Promise<Inventory[]> {
  // Fetch all products, then fetch inventory for each
  // In a real app you'd want a dedicated endpoint, but we work with what the API provides
  const products = await getProducts();
  const inventoryPromises = products.map(async (product) => {
    try {
      const inv = await getInventory(product.id);
      return { ...inv, productName: product.name };
    } catch {
      return null;
    }
  });
  const results = await Promise.all(inventoryPromises);
  return results.filter((inv): inv is Inventory => inv !== null);
}

export async function updateInventory(
  productId: number,
  quantity: number,
): Promise<Inventory> {
  return request<Inventory>(`/inventory/${productId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

export async function reserveInventory(
  productId: number,
  quantity: number,
): Promise<Inventory> {
  return request<Inventory>(`/inventory/${productId}/reserve`, {
    method: "POST",
    body: JSON.stringify({ quantity }),
  });
}

// SWR fetcher - used by SWR hooks for client-side data fetching
export const fetcher = <T>(path: string): Promise<T> => request<T>(path);
