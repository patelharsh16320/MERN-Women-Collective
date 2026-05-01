"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../../../services/api";
import { getCategories } from "../../../../services/categoryService";
import { toastMessage } from "../../../../utils/toastMessage";

const ITEMS_PER_PAGE = 10;

export default function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // ================= LOAD =================
  const load = async () => {
    try {
      setLoading(true);

      const [productsData, categoriesData] = await Promise.all([
        api.get("/products"),
        getCategories(),
      ]);

      setProducts(productsData || []);
      setCategories(
        Array.isArray(categoriesData)
          ? categoriesData
          : categoriesData?.categories || []
      );
    } catch (err) {
      console.error(err);
      toastMessage.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ================= SELECT =================
  const handleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(paginatedProducts.map((p) => p._id));
    } else {
      setSelectedProducts([]);
    }
  };

  // ================= DELETE =================
  const handleDeleteSelected = async () => {
    if (!selectedProducts.length) return;

    if (!window.confirm("Delete selected products?")) return;

    try {
      await Promise.all(
        selectedProducts.map((id) =>
          api.delete(`/products/${id}`)
        )
      );

      setProducts((prev) =>
        prev.filter((p) => !selectedProducts.includes(p._id))
      );

      setSelectedProducts([]);
      toastMessage.success("Deleted successfully");
    } catch {
      toastMessage.error("Delete failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);

      setProducts((prev) =>
        prev.filter((p) => p._id !== id)
      );

      toastMessage.success("Deleted");
    } catch {
      toastMessage.error("Delete failed");
    }
  };

  // ================= DUPLICATE =================
  const handleDuplicate = async (product) => {
    try {
      const baseName = product.name.replace(/\d{2}$/, "");

      const count = products.filter((p) =>
        p.name.startsWith(baseName)
      ).length;

      const newName = `${baseName}${String(count + 1).padStart(2, "0")}`;

      const formData = new FormData();
      formData.append("name", newName);
      formData.append("description", product.description || "");
      formData.append("price", product.price || 0);
      formData.append("sellPrice", product.sellPrice || 0);
      formData.append(
        "category",
        product.category?._id || product.category || ""
      );
      formData.append("countInStock", product.countInStock || 0);

      // 🔥 image duplicate
      if (product.image) {
        let imgUrl = product.image;

        const apiOrigin = process.env.NEXT_PUBLIC_API_URL.replace(
          /\/api$/,
          ""
        );

        if (imgUrl.startsWith("/uploads")) {
          imgUrl = apiOrigin + imgUrl;
        }

        const res = await fetch(imgUrl);
        if (res.ok) {
          const blob = await res.blob();
          formData.append("image", blob, "copy.jpg");
        }
      }

      await api.post("/products", formData);

      toastMessage.success("Duplicated");
      load();
    } catch (err) {
      console.error(err);
      toastMessage.error("Duplicate failed");
    }
  };

  // ================= PAGINATION =================
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const changePage = (p) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  // ================= UI =================
  return (
    <div className="container py-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between mb-3">
        <h4>Products ({products.length})</h4>

        <Link href="/admin/products/create" className="btn btn-dark">
          + Add
        </Link>
      </div>

      {loading && <p>Loading...</p>}

      {/* TABLE */}
      <div className="card">
        <div className="p-2">
          <button
            className="btn btn-danger"
            disabled={!selectedProducts.length}
            onClick={handleDeleteSelected}
          >
            Delete Selected
          </button>
        </div>

        <div className="table-responsive">
          <table className="table">

            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                  />
                </th>
                <th>#</th>
                <th>Name</th>
                <th>Image</th>
                <th>Price(Sell Price)</th>
                <th>Category</th>
                <th>Parent</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedProducts.map((p, i) => {
                const apiOrigin =
                  process.env.NEXT_PUBLIC_API_URL.replace("/api", "");

                const img = p.image?.startsWith("/uploads")
                  ? apiOrigin + p.image
                  : p.image;

                return (
                  <tr key={p._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(p._id)}
                        onChange={() =>
                          handleSelectProduct(p._id)
                        }
                      />
                    </td>

                    <td>{startIndex + i + 1}</td>

                    <td>{p.name}</td>

                    <td>
                      {img ? (
                        <img src={img} width={50} />
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>
                      ₹{p.price}
                      {p.sellPrice !== undefined && p.sellPrice !== null && p.sellPrice !== "" && Number(p.sellPrice) < Number(p.price) ? (
                        <span className="text-success ms-2">(₹{p.sellPrice})</span>
                      ) : null}
                    </td>

                    <td>
                      {p.category?.name || p.category || "-"}
                    </td>
                    <td>
                      {Array.isArray(p.parent) && p.parent.length > 0
                        ? p.parent.map(par => par.name).join(", ")
                        : "-"}
                    </td>

                    <td>
                      <Link
                        href={`/admin/products/${p._id}/edit`}
                        className="btn btn-sm btn-dark me-2"
                      >
                        Edit
                      </Link>

                      <button
                        className="btn btn-sm btn-danger me-2"
                        onClick={() => handleDelete(p._id)}
                      >
                        Delete
                      </button>

                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleDuplicate(p)}
                      >
                        Duplicate
                      </button>
                    </td>
                  </tr>
                );
              })}

              {!loading && !products.length && (
                <tr>
                  <td colSpan="7" className="text-center">
                    No products
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="p-3 d-flex justify-content-center">
            <button onClick={() => changePage(currentPage - 1)}>
              Prev
            </button>

            <span className="mx-3">
              {currentPage} / {totalPages}
            </span>

            <button onClick={() => changePage(currentPage + 1)}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}