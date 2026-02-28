"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import type { Inventory } from "@/types/inventory";
import type { Product } from "@/types/product";
import StockBadge from "./StockBadge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

interface InventoryTableProps {
  initialProducts: Product[];
  initialInventory: Inventory[];
}

export default function InventoryTable({
  initialProducts,
  initialInventory,
}: InventoryTableProps) {
  const { data: products } = useSWR<Product[]>(
    `${API_URL}/products`,
    fetcher,
    { fallbackData: initialProducts },
  );

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Build a map of product ID to inventory, using initial data as fallback
  const inventoryMap = new Map<number, Inventory>();
  initialInventory.forEach((inv) => inventoryMap.set(inv.productId, inv));

  // Use SWR for each inventory item individually
  const inventoryItems = (products || []).map((product) => {
    const initial = inventoryMap.get(product.id);
    return { product, inventory: initial };
  });

  const startEdit = (productId: number, currentQuantity: number) => {
    setEditingId(productId);
    setEditValue(String(currentQuantity));
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
    setError(null);
  };

  const saveEdit = async (productId: number) => {
    const quantity = parseInt(editValue, 10);
    if (isNaN(quantity) || quantity < 0) {
      setError("Please enter a valid non-negative number");
      return;
    }

    setUpdating(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/inventory/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ detail: "Update failed" }));
        throw new Error(body.detail || "Update failed");
      }

      // Invalidate the SWR cache for products to trigger re-render
      await mutate(`${API_URL}/products`);

      // Update our local inventory map
      const updated = await res.json();
      inventoryMap.set(productId, updated);

      setEditingId(null);
      setEditValue("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
      {error && (
        <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm border-b border-red-200 dark:border-red-800">
          {error}
        </div>
      )}
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
            <th className="text-left px-6 py-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Product
            </th>
            <th className="text-left px-6 py-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Quantity
            </th>
            <th className="text-left px-6 py-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Reserved
            </th>
            <th className="text-left px-6 py-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Available
            </th>
            <th className="text-left px-6 py-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Status
            </th>
            <th className="text-right px-6 py-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {inventoryItems.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400"
              >
                No inventory data available
              </td>
            </tr>
          ) : (
            inventoryItems.map(({ product, inventory }) => {
              const qty = inventory?.quantity ?? 0;
              const reserved = inventory?.reserved ?? 0;
              const available = qty - reserved;
              const isEditing = editingId === product.id;

              return (
                <tr
                  key={product.id}
                  className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <td className="px-6 py-4 text-zinc-900 dark:text-zinc-50 font-medium">
                    {product.name}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24 px-2 py-1 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={updating}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(product.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                      />
                    ) : (
                      <span className="text-zinc-900 dark:text-zinc-50">
                        {qty}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                    {reserved}
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                    {available}
                  </td>
                  <td className="px-6 py-4">
                    <StockBadge quantity={qty} reserved={reserved} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isEditing ? (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => saveEdit(product.id)}
                          disabled={updating}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                          {updating ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={updating}
                          className="px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(product.id, qty)}
                        className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
