import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
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
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </Link>
  );
}
