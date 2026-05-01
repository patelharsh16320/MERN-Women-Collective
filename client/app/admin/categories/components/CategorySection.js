"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteCategory } from "@/services/categoryService";

export default function CategorySection({ categories = [], reload }) {

  const [selected, setSelected] = useState([]);

  // ✅ Only parent categories
  const parentCategories = categories.filter((c) => !c.parent);

  // ✅ Select single
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  // ✅ Select all
  const toggleSelectAll = () => {
    if (selected.length === parentCategories.length) {
      setSelected([]);
    } else {
      setSelected(parentCategories.map((c) => c._id));
    }
  };

  // ✅ Delete single (SAFE)
  const handleDelete = async (id) => {
    if (!confirm("Delete category?")) return;

    try {
      await deleteCategory(id);
      reload && reload(); // ✅ FIX: safe call
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  // ✅ Bulk delete (SAFE + FAST)
  const handleBulkDelete = async () => {
    if (selected.length === 0) return;

    if (!confirm(`Delete ${selected.length} categories?`)) return;

    try {
      // 🔥 Faster than loop
      await Promise.all(selected.map((id) => deleteCategory(id)));

      setSelected([]);
      reload && reload(); // ✅ FIX
    } catch (err) {
      alert(err.message || "Bulk delete failed");
    }
  };

  return (
    <div className="mb-5">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Parent Categories</h5>

        <div className="d-flex gap-2">
          <button
            className="btn btn-danger btn-sm"
            disabled={selected.length === 0}
            onClick={handleBulkDelete}
          >
            Delete Selected
          </button>

          <Link href="/admin/categories/create" className="btn btn-dark btn-sm">
            + Add
          </Link>
        </div>
      </div>

      {/* Table */}
      <table className="table align-middle">

        <thead className="table-light">
          <tr>
            <th>
              <input
                type="checkbox"
                checked={
                  selected.length === parentCategories.length &&
                  parentCategories.length > 0
                }
                onChange={toggleSelectAll}
              />
            </th>
            <th>Name</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>

        <tbody>

          {parentCategories.length > 0 ? (
            parentCategories.map((c) => (
              <tr key={c._id}>

                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(c._id)}
                    onChange={() => toggleSelect(c._id)}
                  />
                </td>

                <td>{c.name}</td>

                <td className="text-end">
                  <Link
                    href={`/admin/categories/${c._id}/edit`}
                    className="btn btn-sm btn-outline-dark me-2"
                  >
                    Edit
                  </Link>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center text-muted py-4">
                No categories found
              </td>
            </tr>
          )}

        </tbody>
      </table>
    </div>
  );
}