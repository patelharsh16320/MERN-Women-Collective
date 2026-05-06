import React, { useState } from "react";
import AdminSidebar from "../AdminSidebar";

const initialCategory = { name: "" };

const AdminCategories = () => {
	const [categories, setCategories] = useState(() => JSON.parse(localStorage.getItem("adminCategories") || "[]"));
	const [form, setForm] = useState(initialCategory);
	const [editIdx, setEditIdx] = useState(null);

	const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = e => {
		e.preventDefault();
		let updated = [...categories];
		if (editIdx !== null) {
			updated[editIdx] = form;
		} else {
			updated.push({ ...form });
		}
		setCategories(updated);
		localStorage.setItem("adminCategories", JSON.stringify(updated));
		setForm(initialCategory);
		setEditIdx(null);
	};

	const handleEdit = idx => {
		setForm(categories[idx]);
		setEditIdx(idx);
	};

	const handleDelete = idx => {
		const updated = categories.filter((_, i) => i !== idx);
		setCategories(updated);
		localStorage.setItem("adminCategories", JSON.stringify(updated));
		setForm(initialCategory);
		setEditIdx(null);
	};

	return (
		<div style={{ display: "flex" }}>
			<AdminSidebar />
			<main style={{ flex: 1, padding: 32 }}>
				<h2>Manage Categories</h2>
				<form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
					<input name="name" value={form.name} onChange={handleChange} placeholder="Category Name" required style={{ marginRight: 8 }} />
					<button type="submit">{editIdx !== null ? "Update" : "Add"} Category</button>
				</form>
				<table style={{ width: "100%", borderCollapse: "collapse" }}>
					<thead>
						<tr style={{ background: "#f6f6f6" }}>
							<th>Name</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{categories.map((c, idx) => (
							<tr key={idx}>
								<td>{c.name}</td>
								<td>
									<button onClick={() => handleEdit(idx)} style={{ marginRight: 8 }}>Edit</button>
									<button onClick={() => handleDelete(idx)}>Delete</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</main>
		</div>
	);
};

export default AdminCategories;
// ...existing code from src/AdminCategories.js...
