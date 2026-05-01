"use client";

import { useEffect, useState } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/services/categoryService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toastMessage } from "@/utils/toastMessage";

export default function ParentPage() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const router = useRouter();

  const load = async () => {
    const data = await getCategories();
    setCategories(data.filter(c => !c.parent || c.parent.length === 0));
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    try {
      await createCategory(name, []);
      setName("");
      load();
    } catch (e) {
      toastMessage.error(e.message);
    }
  };

  // Select single
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Select all
  const toggleSelectAll = () => {
    if (selected.length === categories.length) {
      setSelected([]);
    } else {
      setSelected(categories.map((c) => c._id));
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    if (!confirm(`Delete ${selected.length} parent categories?`)) return;
    try {
      await Promise.all(selected.map((id) => deleteCategory(id)));
      setSelected([]);
      load();
    } catch (err) {
      alert(err.message || "Bulk delete failed");
    }
  };

  // Single delete
  const handleDelete = async (id) => {
    if (!confirm("Delete parent category?")) return;
    await deleteCategory(id);
    load();
  };

  // Edit logic for parent category
  const startEdit = (cat) => {
    setEditId(cat._id);
    setEditName(cat.name);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  const saveEdit = async () => {
    await updateCategory(editId, editName, []);
    setEditId(null);
    setEditName("");
    load();
    router.push("/admin/categories");
  };

  return (
    <div className="container py-4">
      <h3>Parent Categories</h3>

      <div className="d-flex gap-2 mb-3">
        <input value={name} onChange={(e)=>setName(e.target.value)} className="form-control"/>
        <button className="btn btn-dark" onClick={create}>Add</button>
      </div>

      <button
        className="btn btn-danger btn-sm mb-2"
        disabled={selected.length === 0}
        onClick={handleBulkDelete}
      >
        Delete Selected
      </button>

      <table className="table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selected.length === categories.length && categories.length > 0}
                onChange={toggleSelectAll}
              />
            </th>
            <th>Index</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c, index) => (
            <tr key={c._id}>              
              <td>
                <input
                  type="checkbox"
                  checked={selected.includes(c._id)}
                  onChange={() => toggleSelect(c._id)}
                />
              </td>
              <td>{index+1}</td>
              <td>
                {editId === c._id ? (
                  <input
                    className="form-control"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  c.name
                )}
              </td>
              <td>
                {editId === c._id ? (
                  <>
                    <button className="btn btn-sm btn-success me-2" onClick={saveEdit}>Save</button>
                    <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-sm btn-outline-dark me-2" onClick={() => startEdit(c)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c._id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}