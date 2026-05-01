"use client";

import { useEffect, useState } from "react";
import { getCategories, createCategory, deleteCategory } from "@/services/categoryService";
import Link from "next/link";

export default function ChildPage() {
  const [name, setName] = useState("");
  const [parents, setParents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [children, setChildren] = useState([]);
  const [selectedChildren, setSelectedChildren] = useState([]);

  const load = async () => {
    const data = await getCategories();
    setParents(data.filter(c => !c.parent || c.parent.length === 0));
    setChildren(data.filter(c => Array.isArray(c.parent) && c.parent.length > 0));
  };

  useEffect(()=>{ load(); }, []);

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const create = async () => {
    await createCategory(name, selected);
    setName("");
    setSelected([]);
    load();
  };

  // Select child for bulk delete
  const toggleChildSelect = (id) => {
    setSelectedChildren((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Select all children
  const toggleSelectAllChildren = () => {
    if (selectedChildren.length === children.length) {
      setSelectedChildren([]);
    } else {
      setSelectedChildren(children.map((c) => c._id));
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedChildren.length === 0) return;
    if (!confirm(`Delete ${selectedChildren.length} child categories?`)) return;
    try {
      await Promise.all(selectedChildren.map((id) => deleteCategory(id)));
      setSelectedChildren([]);
      load();
    } catch (err) {
      alert(err.message || "Bulk delete failed");
    }
  };

  // Single delete
  const handleDelete = async (id) => {
    if (!confirm("Delete child category?")) return;
    await deleteCategory(id);
    load();
  };

  return (
    <div className="container py-4">
      <h3>Child Categories</h3>

      <div className="mb-3">
        <input
          className="form-control mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Child category name"
        />
        <div className="mb-2">Select Parent(s):</div>
        <div className="mb-2">
          {parents.map((p) => (
            <label key={p._id} className="me-3">
              <input
                type="checkbox"
                checked={selected.includes(p._id)}
                onChange={() => toggle(p._id)}
              />
              {" "}{p.name}
            </label>
          ))}
        </div>
        <button className="btn btn-dark" onClick={create}>
          Add Child
        </button>
      </div>

      {/* List of existing child categories */}
      <hr className="my-4" />
      <h5>Existing Child Categories</h5>
      <button
        className="btn btn-danger btn-sm mb-2"
        disabled={selectedChildren.length === 0}
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
                checked={selectedChildren.length === children.length && children.length > 0}
                onChange={toggleSelectAllChildren}
              />
            </th>
            <th>Index</th>
            <th>Name</th>
            <th>Parents</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {children.map((child, index) => (
            <tr key={child._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedChildren.includes(child._id)}
                  onChange={() => toggleChildSelect(child._id)}
                />
              </td>
              <td>{index+1}</td>
              <td>{child.name}</td>
              <td>
                {Array.isArray(child.parent) && child.parent.length > 0
                  ? child.parent.map((p) => p?.name || p).join(", ")
                  : "-"}
              </td>
              <td>
                <Link href={`/admin/categories/${child._id}/edit`} className="btn btn-sm btn-outline-dark me-2">
                  Edit
                </Link>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(child._id)}>
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

// services/categoryService.js
export async function updateCategory(id, name, parent) {
  return fetchAPI(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      name,
      parent: parent || [], // always send an array
    }),
    headers: { "Content-Type": "application/json" },
  });
}