import { fetchAPI } from "./api";

export const getProducts = () => fetchAPI("/products");

export const getProductById = (id) =>
  fetchAPI(`/products/${id}`);