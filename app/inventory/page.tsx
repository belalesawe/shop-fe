import type { Product } from "@/types/product";
import type { Inventory } from "@/types/inventory";
import InventoryTable from "@/components/inventory/InventoryTable";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getInventoryForProducts(products: Product[]): Promise<Inventory[]> {
  const results = await Promise.all(
    products.map(async (product) => {
      try {
        const res = await fetch(`${API_URL}/inventory/${product.id}`, {
          cache: "no-store",
        });
        if (!res.ok) return null;
        return res.json() as Promise<Inventory>;
      } catch {
        return null;
      }
    }),
  );
  return results.filter((inv): inv is Inventory => inv !== null);
}

export default async function InventoryPage() {
  const products = await getProducts();
  const inventory = await getInventoryForProducts(products);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Inventory
          </h1>
          <a
            href="/"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            Back to Shop
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <InventoryTable
          initialProducts={products}
          initialInventory={inventory}
        />
      </main>
    </div>
  );
}
