
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchAPI } from "../../../../../services/api";
import { getCategories } from "@/services/categoryService";

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id;

  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= LOAD DATA =================
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [prod, cats] = await Promise.all([
          fetchAPI(`/products/${id}`),
          getCategories()
        ]);

        setProduct(prod);

        const allCats = Array.isArray(cats) ? cats : cats.categories || [];
        setCategories(allCats);

        // Set parentId and subCategory if possible
        if (prod?.category && allCats.length) {
          const catObj = allCats.find(c => c._id === prod.category._id || c._id === prod.category);
          if (catObj && Array.isArray(catObj.parent) && catObj.parent.length > 0) {
            setSubCategory(catObj._id);
            setParentId(catObj.parent[0]._id);
          } else if (catObj) {
            setParentId(catObj._id);
            setSubCategory("");
          }
        }

        // Image preview
        if (prod?.image) {
          const apiBase = process.env.NEXT_PUBLIC_API_URL;
          const apiOrigin = apiBase.replace(/\/api\/?$/i, "");

          let img = prod.image;
          if (img.startsWith("/uploads")) img = `${apiOrigin}/${img}`;

          setPreviewUrl(img);
        }

      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id]);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description || "");
    formData.append("price", product.price);
    formData.append("sellPrice", product.sellPrice);
    formData.append("countInStock", product.countInStock);
    // If subCategory selected, use it, else fallback to General
    if (subCategory) {
      formData.append("category", subCategory);
    } else {
      const generalCat = categories.find(cat => cat.name === "General");
      if (generalCat) formData.append("category", generalCat._id);
    }
    if (selectedFile) formData.append("image", selectedFile);

    await fetchAPI(`/products/${id}`, {
      method: "PUT",
      body: formData,
    });

    router.push("/admin/products/manage");
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  if (error)
    return (
      <div className="container py-5 text-center text-danger">
        {error}
      </div>
    );

  if (!product) return null;

  // Parent/child logic
  const parentCategories = categories.filter((c) => !c.parent || c.parent.length === 0);
  const childCategories = categories.filter((c) => Array.isArray(c.parent) && c.parent.length > 0);

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between mb-4">
        <h3>Edit Product</h3>
        <button
          className="btn btn-secondary"
          onClick={() => router.push("/admin/products/manage")}
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        {/* NAME */}
        <input
          className="form-control mb-3"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          placeholder="Product Name"
          required
        />
        {/* IMAGE */}
        <input
          type="file"
          className="form-control mb-3"
          onChange={(e) => {
            const file = e.target.files[0];
            setSelectedFile(file);
            if (file) setPreviewUrl(URL.createObjectURL(file));
          }}
        />
        {previewUrl && (
          <img src={previewUrl} style={{ height: 150 }} className="mb-3" />
        )}
        {/* DESCRIPTION */}
        <textarea
          className="form-control mb-3"
          value={product.description || ""}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          placeholder="Description"
        />
        {/* PRICE */}
        <input
          type="number"
          className="form-control mb-3"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          min={1}
          required
        />
        {/* SELL PRICE */}
        <input
          type="number"
          className="form-control mb-3"
          value={product.sellPrice || ""}
          onChange={(e) => setProduct({ ...product, sellPrice: e.target.value })}
          min={0}
          max={product.price ? product.price - 1 : undefined}
          placeholder="Sell Price (optional)"
        />
        {/* PARENT CATEGORY */}
        <div className="mb-3">
          <label>Parent Category</label>
          <select
            className="form-select"
            value={parentId}
            onChange={e => {
              setParentId(e.target.value);
              setSubCategory("");
            }}
          >
            <option value="">Select Parent (optional)</option>
            {parentCategories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        {/* SUB CATEGORY */}
        <div className="mb-3">
          <label>Sub Category</label>
          <select
            className="form-select"
            value={subCategory}
            onChange={e => setSubCategory(e.target.value)}
          >
            <option value="">Select Sub Category (optional)</option>
            {childCategories.filter(cat => Array.isArray(cat.parent) && cat.parent.some(p => p._id === parentId)).map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        {/* STOCK */}
        <input
          type="number"
          className="form-control mb-3"
          value={product.countInStock}
          onChange={(e) => setProduct({ ...product, countInStock: e.target.value })}
          min={1}
        />
        <button className="btn btn-dark">
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}

