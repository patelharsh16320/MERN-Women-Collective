"use client";

import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { useState, useEffect } from "react";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../services/wishlistService";

function resolveImageUrl(imagePath) {
  if (!imagePath) return "";

  if (imagePath.startsWith("http")) return imagePath;

  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const apiOrigin = apiBase.replace(/\/api\/?$/i, "");

  if (imagePath.startsWith("/uploads")) return `${apiOrigin}${imagePath}`;
  if (imagePath.startsWith("uploads")) return `${apiOrigin}/${imagePath}`;

  return imagePath;
}

export default function ProductCard({ product }) {
  const imgSrc = resolveImageUrl(product?.image || "");

  const hasDiscount =
    product.sellPrice &&
    Number(product.sellPrice) < Number(product.price);

  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getWishlist()
      .then((res) => {
        const wishlist = res.data?.wishlist || [];
        setInWishlist(
          wishlist.some((item) => item._id === product._id)
        );
      })
      .catch(() => setInWishlist(false));
  }, [product._id]);

  const handleWishlist = async () => {
    setLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(product._id);
        setInWishlist(false);
      } else {
        await addToWishlist(product._id);
        setInWishlist(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col">
      <div className="product-card">

        {/* IMAGE */}
        <Link href={`/products/${product._id}`}>
          <div className="product-img">
            <img src={imgSrc} alt={product.name} />
          </div>
        </Link>

        {/* CONTENT */}
        <div className="product-body">
          <Link href={`/products/${product._id}`}>
            <h6 className="product-title">{product.name}</h6>
          </Link>

          {/* PRICE */}
          <div className="product-price">
            {hasDiscount ? (
              <>
                <span className="old">₹{product.price}</span>
                <span className="new">₹{product.sellPrice}</span>
              </>
            ) : (
              <span>₹{product.price}</span>
            )}
          </div>

          {/* RATING */}
          <p className="product-rating">
            ⭐ {product.rating || 0} ({product.numReviews || 0})
          </p>

          {/* ACTIONS */}
          <div className="product-actions">
            <AddToCartButton
              product={{
                _id: product._id,
                name: product.name,
                price: product.price,
                image: imgSrc,
              }}
              redirectToCart={false}
            />

            <button
              className="wishlist-btn"
              onClick={handleWishlist}
              disabled={loading}
            >
              {inWishlist ? "♥" : "♡"}
            </button>

            <Link
              href={`/products/${product._id}`}
              className="btn-theme"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}