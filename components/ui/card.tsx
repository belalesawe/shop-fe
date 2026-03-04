import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({
  hover = false,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 ${
        hover ? "hover:shadow-lg transition-shadow" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
