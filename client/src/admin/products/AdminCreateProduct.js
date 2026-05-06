import React, { useState } from "react";
import AdminSidebar from "../AdminSidebar";

const initialProduct = {
	id: "",
	name: "",
	price: "",
	image: [],
	company: "",
	colors: "",
	featured: false,
	stock: "",
	description: "",
	category: ""
};

const AdminCreateProduct = () => {
	const [form, setForm] = useState(initialProduct);
	const [imageFile, setImageFile] = useState(null);
	const [imageUrl, setImageUrl] = useState("");
	const [preview, setPreview] = useState("");
	const [categories, setCategories] = useState(() => {
		const cats = JSON.parse(localStorage.getItem("adminCategories") || "[]");
		return Array.isArray(cats) && cats.length > 0 ? cats : [];
	});

	const handleChange = e => {
		const { name, value, type, checked } = e.target;
		setForm({
			...form,
			[name]: type === "checkbox" ? checked : value
		});
	};

	const handleImageFile = e => {
		const file = e.target.files[0];
		setImageFile(file);
		setImageUrl("");
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => setPreview(reader.result);
			reader.readAsDataURL(file);
		} else {
			setPreview("");
		}
	};

	const handleImageUrl = e => {
		setImageUrl(e.target.value);
		setImageFile(null);
		setPreview(e.target.value);
	};

	const handleSubmit = e => {
		e.preventDefault();
		const products = JSON.parse(localStorage.getItem("adminProducts") || "[]");
		const newProduct = {
			...form,
			id: Date.now().toString(),
			image: imageFile ? [{ url: preview }] : imageUrl ? [{ url: imageUrl }] : [],
			colors: form.colors.split(",").map(c => c.trim()),
			price: Number(form.price),
			stock: Number(form.stock)
		};
		products.push(newProduct);
		localStorage.setItem("adminProducts", JSON.stringify(products));
		setForm(initialProduct);
		setImageFile(null);
		setImageUrl("");
		setPreview("");
		alert("Product created!");
	};

	return (
		<div style={{ display: "flex" }}>
			<AdminSidebar />
			<main style={{ flex: 1, padding: 32 }}>
				<h2>Create Product</h2>
				<form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
					<input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" required style={{ marginBottom: 8, width: '100%' }} />
					<input name="price" value={form.price} onChange={handleChange} placeholder="Price" required type="number" style={{ marginBottom: 8, width: '100%' }} />
					<input name="company" value={form.company} onChange={handleChange} placeholder="Company" required style={{ marginBottom: 8, width: '100%' }} />
					<input name="colors" value={form.colors} onChange={handleChange} placeholder="Colors (comma separated)" required style={{ marginBottom: 8, width: '100%' }} />
					<input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" required type="number" style={{ marginBottom: 8, width: '100%' }} />
					{categories.length > 0 ? (
						<select name="category" value={form.category} onChange={handleChange} required style={{ marginBottom: 8, width: '100%' }}>
							<option value="">Select Category</option>
							{categories.map((c, idx) => (
								<option key={idx} value={c.name}>{c.name}</option>
							))}
						</select>
					) : (
						<input name="category" value={form.category} onChange={handleChange} placeholder="Category" required style={{ marginBottom: 8, width: '100%' }} />
					)}
					<textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required style={{ marginBottom: 8, width: '100%' }} />
					<label style={{ display: 'block', marginBottom: 4 }}>Featured: <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} /></label>
					<div style={{ marginBottom: 8 }}>
						<div>Image:</div>
						<input type="file" accept="image/*" onChange={handleImageFile} style={{ marginBottom: 4 }} />
						<div>or</div>
						<input type="text" value={imageUrl} onChange={handleImageUrl} placeholder="Image URL" style={{ width: '100%' }} />
						{preview && <img src={preview} alt="preview" style={{ width: 80, height: 80, objectFit: 'cover', marginTop: 8 }} />}
					</div>
					<button type="submit">Create Product</button>
				</form>
			</main>
		</div>
	);
};

export default AdminCreateProduct;
// ...existing code from src/AdminCreateProduct.js...
