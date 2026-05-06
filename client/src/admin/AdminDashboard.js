import React from "react";
import AdminSidebar from "./AdminSidebar";

const AdminDashboard = () => {
  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: 32 }}>
        <h2>Admin Dashboard</h2>
        <p>Welcome to the admin dashboard. Use the sidebar to manage products, categories, and users.</p>
      </main>
    </div>
  );
};

export default AdminDashboard;
