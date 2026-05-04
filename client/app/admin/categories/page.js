"use client";

import { useEffect, useState } from "react";
import { getCategories, updateCategory } from "@/services/categoryService";
import { useRouter } from "next/navigation";
import CategorySection from "./components/CategorySection";
import SubcategorySection from "./components/SubcategorySection";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const router = useRouter();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getCategories();
    const all = Array.isArray(data) ? data : data.categories || [];
    setCategories(all);
  };

  // Group categories by parent
  // Remove duplicate 'General' if present
  const uniqueCategories = categories.filter((cat, idx, arr) =>
    arr.findIndex(c => c._id === cat._id) === idx
  );
  const parentCategories = uniqueCategories.filter((c) => !c.parent || c.parent.length === 0);
  const childCategories = uniqueCategories.filter((c) => Array.isArray(c.parent) && c.parent.length > 0);

  // Build tree: parent -> children
  const categoryTree = parentCategories.map((parent) => ({
    ...parent,
    children: childCategories.filter((child) =>
      Array.isArray(child.parent) && child.parent.some((p) => p._id === parent._id)
    ),
  }));

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setEditName(cat.name);
  };

  const saveEdit = async () => {
    await updateCategory(editId, editName, []);
    setEditId(null);
    setEditName("");
    load();
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">All Categories</h3>
      <ul>
        {categoryTree.map((parent) => (
          <li key={parent._id}>
            {editId === parent._id ? (
              <>
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="form-control d-inline w-auto"
                />
                <button className="btn btn-sm btn-success ms-2" onClick={saveEdit}>Save</button>
                <button className="btn btn-sm btn-secondary ms-2" onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <strong>{parent.name}</strong>
                {parent.name === "General" ? (
                  <button className="btn btn-sm btn-outline-dark ms-2" onClick={() => handleEdit(parent)}>Edit</button>
                ) : null}
              </>
            )}
            {parent.children.length > 0 && (
              <ul>
                {parent.children.map((child) => (
                  <li key={child._id}>{child.name}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
