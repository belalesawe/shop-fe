import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  if (isNaN(productId)) {
    notFound();
  }

  let product;
  try {
    product = await getProduct(productId);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Shop
            </h1>
          </Link>
          <nav className="flex gap-6">
            <Link
              href="/"
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              Categories
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            &larr; Back to Products
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            {product.name}
          </h2>

          {product.description && (
            <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-6">
              {product.description}
            </p>
          )}

          <div className="flex items-center gap-6 mb-6">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 text-sm text-zinc-500 dark:text-zinc-400">
            <p>Added {formatDate(product.created_at)}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
