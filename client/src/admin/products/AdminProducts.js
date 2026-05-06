import React, { useState } from "react";
import AdminSidebar from "../AdminSidebar";

const AdminProducts = () => {
	const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem("adminProducts") || "[]"));

	const handleDelete = idx => {
		const updated = products.filter((_, i) => i !== idx);
		setProducts(updated);
		localStorage.setItem("adminProducts", JSON.stringify(updated));
	};

	return (
		<div style={{ display: "flex" }}>
			<AdminSidebar />
			<main style={{ flex: 1, padding: 32 }}>
				<h2>Manage Products</h2>
				<table style={{ width: "100%", borderCollapse: "collapse" }}>
					<thead>
						<tr style={{ background: "#f6f6f6" }}>
							<th>Name</th>
							<th>Price</th>
							<th>Category</th>
							<th>Image</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{products.map((p, idx) => (
							<tr key={idx}>
								<td>{p.name}</td>
								<td>{p.price}</td>
								<td>{p.category}</td>
								<td>{p.image ? <img src={p.image} alt="" style={{ width: 40, height: 40, objectFit: "cover" }} /> : "-"}</td>
								<td>
									{/* Edit button removed with form */}
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

export default AdminProducts;
// ...existing code from src/AdminProducts.js...
