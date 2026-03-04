import { Product } from "@/types/product";
import { Card } from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card hover>
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
    </Card>
  );
}
