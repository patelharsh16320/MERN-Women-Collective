"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchAPI } from "@/services/api";
import { updateCategory, getCategories } from "@/services/categoryService";

export default function EditPage() {
  const { id } = useParams();

  const [name, setName] = useState("");
  const [parents, setParents] = useState([]);
  const [selected, setSelected] = useState([]);

  const router = useRouter();
  useEffect(() => {
    const load = async () => {
      const [cat, all] = await Promise.all([
        fetchAPI(`/categories/${id}`),
        getCategories()
      ]);

      setName(cat.name);
      setSelected(cat.parent?.map(p => p._id) || []);
      setParents(all.filter(c => !c.parent || c.parent.length === 0));
    };

    load();
  }, [id]);

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const update = async () => {
    await updateCategory(id, name, selected);
    router.push("/admin/categories");
  };

  return (
    <div className="container py-4">

      <h3>Edit Category</h3>

      <input value={name} onChange={(e)=>setName(e.target.value)} className="form-control mb-3"/>

      {parents.map(p => (
        <div key={p._id}>
          <input type="checkbox"
            checked={selected.includes(p._id)}
            onChange={()=>toggle(p._id)}
          />
          {p.name}
        </div>
      ))}

      <button className="btn btn-dark mt-3" onClick={update}>
        Update
      </button>

    </div>
  );
}