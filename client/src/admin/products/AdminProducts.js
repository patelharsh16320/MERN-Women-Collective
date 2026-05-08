import React, { useEffect, useState } from "react";
import AdminSidebar from "../AdminSidebar";
import { fetchProducts } from "../../api";

const AdminProducts = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const getProducts = async () => {
			try {
				const data = await fetchProducts();
				console.log('Fetched products:', data);
				setProducts(data);
			} catch (err) {
				console.error('Fetch products error:', err);
				setError("Failed to fetch products");
			} finally {
				setLoading(false);
			}
		};
		getProducts();
	}, []);

	return (
		<div style={{ display: "flex" }}>
			<AdminSidebar />
			<main style={{ flex: 1, padding: 32 }}>
				<h2>Manage Products</h2>
				{loading ? (
					<div>Loading...</div>
				) : error ? (
					<div>{error}</div>
				) : (
					<table style={{ width: "100%", borderCollapse: "collapse" }}>
						<thead>
							<tr style={{ background: "#f6f6f6" }}>
								<th>Name</th>
								<th>Price</th>
								<th>Category</th>
								<th>Image</th>
							</tr>
						</thead>
						<tbody>
							{products.map((p, idx) => (
								<tr key={p._id || idx}>
									<td>{p.name}</td>
									<td>{p.price}</td>
									<td>{typeof p.category === 'object' && p.category ? p.category.name : p.category}</td>
									<td>{Array.isArray(p.image) && p.image.length > 0 ? <img src={p.image[0].url} alt="" style={{ width: 40, height: 40, objectFit: "cover" }} /> : "-"}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</main>
		</div>
	);
};

export default AdminProducts;
// ...existing code from src/AdminProducts.js...
