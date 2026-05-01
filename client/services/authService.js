import { fetchAPI } from "./api";

export async function signupUser(data) {
  return fetchAPI("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(data) {
  const res = await fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  // ✅ Save token
  if (typeof window !== "undefined") {
    localStorage.setItem("token", res.token);
  }

  return res;
}

export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userChanged"));
  }
}