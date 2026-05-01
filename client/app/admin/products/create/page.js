"use client";

import { useState, useEffect } from "react";
import { getCategories } from "@/services/categoryService";
import { toastMessage } from "../../../../utils/toastMessage";
import { useRouter } from "next/navigation";
import { fetchAPI } from "../../../../services/api";

export default function CreateProduct() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    sellPrice: "",
    category: "",
    countInStock: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [parentId, setParentId] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories();
        const cats = Array.isArray(res) ? res : res.categories || [];
        setCategories(cats);
      } catch (err) {
        toastMessage.error("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
      const price = Math.max(Number(value), 1);

      setFormData((prev) => ({
        ...prev,
        price,
        sellPrice:
          prev.sellPrice && Number(prev.sellPrice) >= price
            ? ""
            : prev.sellPrice,
      }));
    }

    else if (name === "sellPrice") {
      const sell = Number(value);

      setFormData((prev) => {
        // ❌ negative not allowed
        if (sell < 0) return { ...prev, sellPrice: 0 };

        // ❌ greater than price not allowed
        if (sell >= Number(prev.price)) {
          return { ...prev, sellPrice: "" }; // reset
        }

        return { ...prev, sellPrice: sell };
      });
    }

    else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const price = Math.max(Number(formData.price), 1);

      let sellPrice = formData.sellPrice === ""
        ? null
        : Number(formData.sellPrice);

      // ✅ enforce rules again
      if (sellPrice !== null) {
        if (sellPrice < 0) sellPrice = 0;
        if (sellPrice >= price) sellPrice = null;
      }

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "sellPrice") {
          if (sellPrice !== null) data.append("sellPrice", sellPrice);
        } else {
          data.append(key, formData[key]);
        }
      });

      if (image) data.append("image", image);


      // If no category selected, set to General
      if (!formData.category) {
        const generalCat = categories.find(cat => cat.name === "General");
        if (generalCat) {
          data.set("category", generalCat._id);
        }
      }

      await fetchAPI("/products", {
        method: "POST",
        body: data,
      });

      toastMessage.success("Product created!");
      router.push("/admin/products/manage");

    } catch (err) {
      toastMessage.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">

      <h3 className="mb-4">Create Product</h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">

        <div className="mb-3">
          <label>Name</label>
          <input
            name="name"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea
            name="description"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label>Price</label>
            <input
              type="number"
              name="price"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Sell Price</label>
            <input
              type="number"
              name="sellPrice"f
              className="form-control"
              min={0}
              max={formData.price ? formData.price - 1 : undefined}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Stock</label>
            <input
              type="number"
              name="countInStock"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label>Parent Category</label>
          <select
            className="form-select"
            value={parentId}
            onChange={e => {
              setParentId(e.target.value);
              setFormData(prev => ({ ...prev, category: "" }));
            }}
          >
            <option value="">Select Parent (optional)</option>
            {categories.filter(cat => !cat.parent || cat.parent.length === 0).map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Child Category</label>
          <select
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select Child (optional)</option>
            {categories.filter(cat => Array.isArray(cat.parent) && cat.parent.some(p => p._id === parentId)).map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImage}
            required
          />

          {preview && (
            <img src={preview} width="100" className="mt-2" />
          )}
        </div>

        <button className="btn btn-dark w-100" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </button>

      </form>
    </div>
  );
}