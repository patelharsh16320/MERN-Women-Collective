import { fetchAPI } from "./api";

// GET
export const getCategories = () => fetchAPI("/categories");

// CREATE
export const createCategory = (name, parent = []) =>
  fetchAPI("/categories", {
    method: "POST",
    body: JSON.stringify({ name, parent }),
  });

// UPDATE
export const updateCategory = (id, name, parent = []) =>
  fetchAPI(`/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, parent: Array.isArray(parent) ? parent : [] }),
  });

// DELETE
export const deleteCategory = (id) =>
  fetchAPI(`/categories/${id}`, { method: "DELETE" });