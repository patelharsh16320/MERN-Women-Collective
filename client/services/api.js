const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAPI = async (endpoint, options = {}) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || "API Error");
  }

  return data;
};

/* CLEAN METHODS */
const api = {
  get: (url) => fetchAPI(url, { method: "GET" }),
  post: (url, body) =>
    fetchAPI(url, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: (url, body) =>
    fetchAPI(url, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: (url) => fetchAPI(url, { method: "DELETE" }),
};

export default api;