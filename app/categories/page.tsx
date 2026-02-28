import Link from "next/link";
import { getCategories } from "@/lib/api";
import type { Category } from "@/types/product";

export default async function CategoriesPage() {
  let categories: Category[];
  try {
    categories = await getCategories();
  } catch {
    categories = [];
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
              className="text-zinc-900 dark:text-zinc-50 font-medium"
            >
              Categories
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
          Categories
        </h2>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">
              No categories available. Make sure the backend is running.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6"
              >
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {category.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
