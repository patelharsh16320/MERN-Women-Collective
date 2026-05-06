import React, { useState } from "react";
import AdminSidebar from "../AdminSidebar";

const ROLES = ["admin", "user", "author", "subscriber"];

const AdminUsers = () => {
	const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem("adminUsers") || "[]"));
	const [form, setForm] = useState({ name: "", email: "", password: "", role: ROLES[1] });

	const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = e => {
		e.preventDefault();
		const updated = [...users, { ...form }];
		setUsers(updated);
		localStorage.setItem("adminUsers", JSON.stringify(updated));
		setForm({ name: "", email: "", password: "", role: ROLES[1] });
	};

	return (
		<div style={{ display: "flex" }}>
			<AdminSidebar />
			<main style={{ flex: 1, padding: 32 }}>
				<h2>All Users</h2>
				<form onSubmit={handleSubmit} style={{ marginBottom: 32, display: 'flex', gap: 8, alignItems: 'center' }}>
					<input name="name" value={form.name} onChange={handleChange} placeholder="Name" required style={{ marginRight: 8 }} />
					<input name="email" value={form.email} onChange={handleChange} placeholder="Email" required type="email" style={{ marginRight: 8 }} />
					<input name="password" value={form.password} onChange={handleChange} placeholder="Password" required type="password" style={{ marginRight: 8 }} />
					<select name="role" value={form.role} onChange={handleChange} required style={{ marginRight: 8 }}>
						{ROLES.map(r => <option key={r} value={r}>{r}</option>)}
					</select>
					<button type="submit">Add User</button>
				</form>
				<table style={{ width: "100%", borderCollapse: "collapse" }}>
					<thead>
						<tr style={{ background: "#f6f6f6" }}>
							<th>Name</th>
							<th>Email</th>
							<th>Role</th>
						</tr>
					</thead>
					<tbody>
						{users.length === 0 && (
							<tr><td colSpan={3} style={{textAlign:'center'}}>No users found.</td></tr>
						)}
						{users.map((u, idx) => (
							<tr key={idx}>
								<td>{u.name}</td>
								<td>{u.email}</td>
								<td>{u.role || "user"}</td>
							</tr>
						))}
					</tbody>
				</table>
			</main>
		</div>
	);
};

export default AdminUsers;
// ...existing code from src/AdminUsers.js...
