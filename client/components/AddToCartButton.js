"use client";

import { useState } from "react";
import { toastMessage } from "../utils/toastMessage";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ product, redirectToCart = true }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    try {
      setAdding(true);

      const user = (() => {
        try {
          return JSON.parse(localStorage.getItem("user"));
        } catch {
          return null;
        }
      })();

      if (!user) {
        window.location.href = "/account/login";
        return;
      }

      const cartKey = user?.email ? `cart_${user.email}` : "cart";
      const raw = localStorage.getItem(cartKey);
      let cart = raw ? JSON.parse(raw) : [];

      const id = product._id || product.id;

      const existing = cart.find(
        (i) => i._id === id || i.id === id
      );

      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
      } else {
        cart.push({
          _id: id,
          name: product.name,
          price: Number(product.price) || 0,
          image: product.image || product.img || "",
          qty: 1,
        });
      }

      localStorage.setItem(cartKey, JSON.stringify(cart));

      // notify header/cart
      window.dispatchEvent(
        new CustomEvent("cartUpdated", { detail: { cart } })
      );

      toastMessage.success("Added to cart");

      if (redirectToCart) {
        router.push("/cart");
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      toastMessage.error("Something went wrong");
    } finally {
      setAdding(false);
    }
  };

  return (
    <button
      onClick={handleAdd}
      disabled={adding}
      className={`add-cart-btn ${adding ? "loading" : ""}`}
    >
      {adding ? (
        <>
          <span className="spinner"></span> Adding...
        </>
      ) : (
        <>
          <i className="fas fa-shopping-cart me-2"></i>
          Add to Cart
        </>
      )}
    </button>
  );
}