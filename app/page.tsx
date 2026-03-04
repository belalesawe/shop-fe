import { Header } from "@/components/header";
import { ProductGrid } from "@/components/product-grid";
import { api } from "@/lib/api/client";
import { env } from "@/lib/env";
import type { Product } from "@/types/product";

export const dynamic = "force-dynamic";

async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await api.GET("/products", {
      cache: "no-store",
    });

    if (error) {
      console.error("Failed to fetch products:", error);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <ProductGrid
          products={products}
          emptyMessage={`No products available. Make sure the backend is running at ${env.NEXT_PUBLIC_API_URL}`}
        />
      </main>
    </div>
  );
}
