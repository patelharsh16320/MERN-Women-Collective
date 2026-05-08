import React, { useEffect, useState } from "react";
import { fetchUsers, fetchInvoices, fetchOrders, fetchWishlists } from "../api";

const AdminDataDemo = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersData, ordersData, wishlistsData, invoicesData] = await Promise.all([
          fetchUsers(),
          fetchOrders(),
          fetchWishlists(),
          fetchInvoices()
        ]);
        setUsers(usersData);
        setOrders(ordersData);
        setWishlists(wishlistsData);
        setInvoices(invoicesData);
      } catch (err) {
        setError("Failed to fetch admin data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: 32 }}>
      <h2>Admin Data Demo</h2>
      <h3>Users</h3>
      <ul>{users.map(u => <li key={u._id}>{u.name} ({u.email})</li>)}</ul>
      <h3>Orders</h3>
      <ul>{orders.map(o => <li key={o._id}>Order #{o._id} - User: {o.user?.name || o.user}</li>)}</ul>
      <h3>Wishlists</h3>
      <ul>{wishlists.map(w => <li key={w._id}>User: {w.user?.name || w.user} - Products: {w.products.length}</li>)}</ul>
      <h3>Invoices</h3>
      <ul>{invoices.map(i => <li key={i._id}>Invoice #{i._id} - User: {i.user?.name || i.user} - Total: ₹{i.total}</li>)}</ul>
    </div>
  );
};

export default AdminDataDemo;
