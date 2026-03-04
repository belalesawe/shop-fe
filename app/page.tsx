import { Product } from "@/types/product";
import { Header } from "@/components/header";
import { ProductCard } from "@/components/product-card";

async function getProducts(): Promise<Product[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    const res = await fetch(`${apiUrl}/products`, {
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
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">
              No products available. Make sure the backend is running at{" "}
              {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
