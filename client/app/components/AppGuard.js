"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// Public / user accessible routes
const USER_ALLOWED = [
  "/",
  "/about",
  "/contact",
  "/products",
  "/cart",
  "/orders",
  "/checkout",
  "/invoices",
  "/account/login",
  "/account/signup",
  "/account/logout"
];

// Editor routes
const EDITOR_ALLOWED = [
  "/",
  "/about"
];

// Author routes
const AUTHOR_ALLOWED = [
  "/",
  "/cart",
  "/contact",
  "/products"
];

// helper for dynamic routes
const isAllowedPath = (pathname, allowedRoutes) => {
  return allowedRoutes.some((route) => {
    return pathname === route || pathname.startsWith(route + "/");
  });
};

export default function AppGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
let user = null;

try {
  const raw = localStorage.getItem("user");
  if (raw && raw !== "undefined") {
    user = JSON.parse(raw);
  }
} catch (err) {
  console.warn("Invalid user in localStorage");
  localStorage.removeItem("user");
}

    // ✅ Admin → allow all
    if (user?.role === "admin") {
      setLoading(false);
      return;
    }

    // ✅ Editor
    if (user?.role === "editor") {
      if (!isAllowedPath(pathname, EDITOR_ALLOWED)) {
        router.replace("/");
        return;
      }
      setLoading(false);
      return;
    }

    // ✅ Author
    if (user?.role === "author") {
      if (!isAllowedPath(pathname, AUTHOR_ALLOWED)) {
        router.replace("/");
        return;
      }
      setLoading(false);
      return;
    }

    // ✅ Normal user / guest
    if (!isAllowedPath(pathname, USER_ALLOWED)) {
      router.replace("/");
      return;
    }

    setLoading(false);
  }, [pathname, router]);

  // Prevent flicker
  if (loading) {
    return (
      <div className="text-center mt-5">
        <h4>Loading...</h4>
      </div>
    );
  }

  return children;
}