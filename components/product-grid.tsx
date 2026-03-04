import { Product } from "@/types/product";
import { ProductCard } from "@/components/product-card";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductGrid({ products, emptyMessage }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-600 dark:text-zinc-400">
          {emptyMessage || "No products available."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
