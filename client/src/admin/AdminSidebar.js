import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => (
  <aside style={{ width: 220, background: "#f4f4f4", minHeight: "100vh", padding: 24 }}>
    <nav>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: 16 }}><Link to="/admin">Dashboard</Link></li>
        <li style={{ marginBottom: 16 }}><Link to="/admin/products">Products</Link></li>
        <li style={{ marginBottom: 16 }}><Link to="/admin/products/create">Create Product</Link></li>
        <li style={{ marginBottom: 16 }}><Link to="/admin/categories">Categories</Link></li>
        <li style={{ marginBottom: 16 }}><Link to="/admin/users">Users</Link></li>
      </ul>
    </nav>
  </aside>
);

export default AdminSidebar;
