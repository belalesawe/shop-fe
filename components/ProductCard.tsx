import Link from "next/link";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {product.name}
          </h2>
        </div>
        {product.category_name && (
          <span className="inline-block text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded px-2 py-1 mb-3">
            {product.category_name}
          </span>
        )}
        {product.description && (
          <p className="text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            ${typeof product.price === "number" ? product.price.toFixed(2) : product.price}
          </span>
        </div>
      </div>
    </Link>
  );
}
