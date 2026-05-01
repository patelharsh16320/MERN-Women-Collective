"use client";

import AddToCartButton from "./AddToCartButton";

export default function ProductActionsClient({ product }) {
  return (
    <div className="mt-3">
      <AddToCartButton product={product} />
    </div>
  );
}