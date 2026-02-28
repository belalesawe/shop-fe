"use client";

interface StockBadgeProps {
  quantity: number;
  reserved: number;
}

export default function StockBadge({ quantity, reserved }: StockBadgeProps) {
  const available = quantity - reserved;

  if (available <= 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
        Out of Stock
      </span>
    );
  }

  if (available <= 10) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
        Low Stock
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
      In Stock
    </span>
  );
}
