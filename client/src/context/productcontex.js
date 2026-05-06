

import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";
import reducer from "../reducer/productReducer";

// Optionally, expose categories from localStorage for category filter
// (must be at very top-level, before any function or component)
export const getAdminCategories = () => {
  const adminCategories = JSON.parse(localStorage.getItem("adminCategories") || "null");
  if (adminCategories && Array.isArray(adminCategories) && adminCategories.length > 0) {
    return adminCategories.map(c => c.name);
  }
  // fallback: extract unique categories from DUMMY_PRODUCTS
  return [...new Set(DUMMY_PRODUCTS.map(p => p.category))];
};

const AppContext = createContext();


// Dummy products array
const DUMMY_PRODUCTS = [
  {
    id: "1",
    name: "Modern Chair",
    price: 2599,
    image: [ { url: "https://dummyjson.com/image/150" } ],
    company: "FurniCo",
    colors: ["#ff0000", "#00ff00"],
    featured: true,
    stock: 12,
    description: "A stylish modern chair for your living room.",
    category: "furniture"
  },
  {
    id: "2",
    name: "Classic Watch",
    price: 4999,
    image: [ { url: "https://dummyjson.com/image/150" } ],
    company: "TimeX",
    colors: ["#000000", "#ffffff"],
    featured: false,
    stock: 8,
    description: "Elegant classic watch for all occasions.",
    category: "accessories"
  },
  {
    id: "3",
    name: "Bluetooth Speaker",
    price: 1999,
    image: [ { url: "https://dummyjson.com/image/150" } ],
    company: "SoundPro",
    colors: ["#0000ff", "#ff00ff"],
    featured: true,
    stock: 20,
    description: "Portable Bluetooth speaker with high-quality sound.",
    category: "electronics"
  },
  {
    id: "4",
    name: "Yoga Mat",
    price: 799,
    image: [ { url: "https://dummyjson.com/image/150" } ],
    company: "FitLife",
    colors: ["#00ffff", "#ff9900"],
    featured: false,
    stock: 30,
    description: "Comfortable yoga mat for daily exercise.",
    category: "fitness"
  },
  {
    id: "5",
    name: "Desk Organizer",
    price: 1299,
    image: [ { url: "https://dummyjson.com/image/150" } ],
    company: "OfficePlus",
    colors: ["#654321", "#abcdef"],
    featured: false,
    stock: 18,
    description: "Keep your desk tidy with this organizer.",
    category: "office"
  },
  {
    id: "6",
    name: "Travel Backpack",
    price: 3499,
    image: [ { url: "https://dummyjson.com/image/150" } ],
    company: "AdventureGear",
    colors: ["#123456", "#654321"],
    featured: true,
    stock: 10,
    description: "Durable backpack for all your travels.",
    category: "bags"
  },
  {
    id: "7",
    name: "Coffee Maker",
    price: 2999,
    image: [ { url: "https://dummyjson.com/image/150" } ],
    company: "BrewMaster",
    colors: ["#222222", "#aaaaaa"],
    featured: false,
    stock: 7,
    description: "Brew perfect coffee every morning.",
    category: "kitchen"
  },
  {
    id: "8",
    name: "Wireless Mouse",
    price: 899,
    image: [ { url: "https://dummyjson.com/image/150" } ],
    company: "TechEase",
    colors: ["#888888", "#000000"],
    featured: false,
    stock: 25,
    description: "Smooth and responsive wireless mouse.",
    category: "electronics"
  },
  {
    id: "9",
    name: "Sunglasses",
    price: 1599,
    image: [ { url: "https://dummyjson.com/image/150" } ],
    company: "SunStyle",
    colors: ["#000000", "#ffcc00"],
    featured: true,
    stock: 15,
    description: "Trendy sunglasses for sunny days.",
    category: "accessories"
  },
  {
    id: "10",
    name: "Notebook Set",
    price: 499,
    image: [ { url: "https://dummyjson.com/image/150" } ],
    company: "PaperWorks",
    colors: ["#ffffff", "#000000"],
    featured: false,
    stock: 40,
    description: "Set of 3 notebooks for school or office.",
    category: "office"
  }
];


const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    isError: false,
    products: [],
    featureProducts: [],
    isSingleLoading: false,
    singleProduct: {},
  });

  // my 2nd api call for single product
  const getSingleProduct = async (url) => {
    dispatch({ type: "SET_SINGLE_LOADING" });
    try {
      const res = await axios.get(url);
      const singleProduct = await res.data;
      dispatch({ type: "SET_SINGLE_PRODUCT", payload: singleProduct });
    } catch (error) {
      dispatch({ type: "SET_SINGLE_ERROR" });
    }
  };



  // Load products from localStorage if available, else use dummy
  useEffect(() => {
    const adminProducts = JSON.parse(localStorage.getItem("adminProducts") || "null");
    if (adminProducts && Array.isArray(adminProducts) && adminProducts.length > 0) {
      dispatch({ type: "SET_API_DATA", payload: adminProducts });
    } else {
      dispatch({ type: "SET_API_DATA", payload: DUMMY_PRODUCTS });
    }
  }, []);



  return (
    <AppContext.Provider value={{ ...state, getSingleProduct }}>
      {children}
    </AppContext.Provider>
  );
};


// custom hooks
const useProductContext = () => {
  return useContext(AppContext);
};

export { AppProvider, AppContext, useProductContext };
