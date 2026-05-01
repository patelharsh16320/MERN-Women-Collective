const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAPI = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  const isForm =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  // Get token (if login system che to future ready)
  let token = null;
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    token = user?.token;
  } catch {}

  const fetchOptions = {
    cache: "no-store",
    ...options,
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  };

  try {
    const res = await fetch(url, fetchOptions);

    const contentType = res.headers.get("content-type");

    // Handle non-JSON safely
    const data = contentType?.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      console.error("API ERROR:", res.status, data);

      throw new Error(
        data?.message || data || `Error ${res.status}`
      );
    }

    return data;
  } catch (err) {
    console.error("Fetch failed:", err.message);
    throw err;
  }
};

/* ===== CLEAN API METHODS ===== */

const api = {
  get: (endpoint, options = {}) =>
    fetchAPI(endpoint, { ...options, method: "GET" }),

  post: (endpoint, body, options = {}) =>
    fetchAPI(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: (endpoint, body, options = {}) =>
    fetchAPI(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: (endpoint, options = {}) =>
    fetchAPI(endpoint, { ...options, method: "DELETE" }),
};

export default api;