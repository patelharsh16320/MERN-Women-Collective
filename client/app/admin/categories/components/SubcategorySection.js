"use client";

import Link from "next/link";
import { deleteCategory } from "@/services/categoryService";

export default function SubcategorySection({ categories, reload }) {
  const handleDelete = async (id) => {
    if (!confirm("Delete subcategory?")) return;
    await deleteCategory(id);
    reload();
  };

  return (
    <div>
      <h5 className="mb-3">Sub Categories</h5>

      <table className="table">
        <tbody>
          {categories.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.parent?.name || "-"}</td>
              <td>
                <Link href={`/admin/categories/${c._id}/edit`} className="btn btn-sm btn-outline-dark me-2">
                  Edit
                </Link>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}