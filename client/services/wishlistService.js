import api from "./api";

export const addToWishlist = (productId) =>
  api.post("/wishlist/add", { productId });

export const removeFromWishlist = (productId) =>
  api.post("/wishlist/remove", { productId });

export const getWishlist = () =>
  api.get("/wishlist");
