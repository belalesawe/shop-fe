import { Product } from "@/types/product";
import { Header } from "@/components/header";
import { ProductGrid } from "@/components/product-grid";
import { env } from "@/lib/env";

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch products:", res.status);
      return [];
    }

    return res.json();
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
