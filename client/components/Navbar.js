"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const loadUser = () => {
    try {
      const raw = localStorage.getItem("user");
      const parsed = raw ? JSON.parse(raw) : null;
      setUser(parsed);

      const cartKey = parsed?.email ? `cart_${parsed.email}` : "cart";
      const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
      setCartCount(cart.reduce((a, b) => a + (b.qty || 1), 0));
    } catch {
      setUser(null);
      setCartCount(0);
    }
  };

  useEffect(() => {
    loadUser();

    window.addEventListener("userChanged", loadUser);
    window.addEventListener("cartUpdated", loadUser);

    return () => {
      window.removeEventListener("userChanged", loadUser);
      window.removeEventListener("cartUpdated", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userChanged"));
    window.location.href = "/account/login";
  };

  return (
    <header className="header">
      <div className="container d-flex justify-content-between align-items-center py-3">
        
        {/* LOGO */}
        <Link href="/" className="fw-bold fs-4">
          Women Hub
        </Link>

        {/* NAV */}
        <div className="d-flex align-items-center gap-4">

          <Link href="/products" className="nav-link">
            Products
          </Link>

          <Link href="/cart" className="nav-link position-relative">
            <i className="fas fa-shopping-cart"></i>
            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link href="/account" className="nav-link">
                <i className="fas fa-user"></i>
              </Link>
              <button
                className="btn-theme"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/account/signup" className="btn-theme">
              Signup
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}