"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toastMessage } from "../../../utils/toastMessage";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Notify app
    window.dispatchEvent(new Event("userChanged"));

    // Toast
    toastMessage.success("Logged out successfully");

    // Redirect to login
    router.replace("/account/login");

  }, [router]);

  return (
    <div className="text-center mt-5">
      <h3>Logging out...</h3>
    </div>
  );
}