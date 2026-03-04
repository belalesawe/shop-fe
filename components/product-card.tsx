import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
        {product.name}
      </h2>
      {product.description && (
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          {product.description}
        </p>
      )}
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          ${product.price}
        </span>
      </div>
    </div>
  );
}
