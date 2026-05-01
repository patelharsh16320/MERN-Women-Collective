export function getCartKey(user) {
  return user?.email ? `cart_${user.email}` : "cart";
}

export function getUserCart(user) {
  try {
    const raw = localStorage.getItem(getCartKey(user));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setUserCart(user, cart) {
  localStorage.setItem(getCartKey(user), JSON.stringify(cart));
  window.dispatchEvent(
    new CustomEvent("cartUpdated", { detail: { cart } })
  );
}

export function clearUserCart(user) {
  localStorage.removeItem(getCartKey(user));
  window.dispatchEvent(
    new CustomEvent("cartUpdated", { detail: { cart: [] } })
  );
}