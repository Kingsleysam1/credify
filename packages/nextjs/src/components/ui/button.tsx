// packages/nextjs/components/ui/button.tsx
import * as React from "react";

export function Button({ className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`bg-blue-600 text-white py-2 px-4 rounded ${className}`} {...props} />;
}
