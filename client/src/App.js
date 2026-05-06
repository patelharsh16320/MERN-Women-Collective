import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./About";
import Home from "./Home";
import Products from "./Products";
import Contact from "./Contact";
import Cart from "./Cart";
import SingleProduct from "./SingleProduct";
import ErrorPage from "./ErrorPage";
import Login from "./Login";
import Signup from "./Signup";
import { GlobalStyle } from "./GlobalStyle";
import { ThemeProvider } from "styled-components";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Wishlist from "./Wishlist";
import Checkout from "./Checkout";
import StripeWrapper from "./StripeWrapper";
import Order from "./Order";
import Invoice from "./Invoice";
import MyAccount from "./MyAccount";
import { WishlistProvider } from "./context/wishlist_context";
import { InvoiceProvider } from "./context/invoice_context";
import Dashboard from "./Dashboard";
import ChangePassword from "./ChangePassword";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/products/AdminProducts";
import AdminCreateProduct from "./admin/products/AdminCreateProduct";
import AdminCategories from "./admin/categories/AdminCategories";
import AdminUsers from "./admin/users/AdminUsers";

const App = () => {
  const theme = {
    colors: {
      heading: "rgb(24 24 29)",
      text: "rgba(29 ,29, 29, .8)",
      white: "#fff",
      black: " #212529",
      helper: "#8490ff",

      bg: "#F6F8FA",
      footer_bg: "#0a1435",
      btn: "rgb(98 84 243)",
      border: "rgba(98, 84, 243, 0.5)",
      hr: "#ffffff",
      gradient:
        "linear-gradient(0deg, rgb(132 144 255) 0%, rgb(98 189 252) 100%)",
      shadow:
        "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;",
      shadowSupport: " rgba(0, 0, 0, 0.16) 0px 1px 4px",
    },
    media: {
      mobile: "768px",
      tab: "998px",
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <WishlistProvider>
        <InvoiceProvider>
          <Router>
            <GlobalStyle />
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/singleproduct/:id" element={<SingleProduct />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<StripeWrapper><Checkout /></StripeWrapper>} />
              <Route path="/order" element={<Order />} />
              <Route path="/invoice" element={<Invoice />} />
              <Route path="/my-account" element={<MyAccount />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/create" element={<AdminCreateProduct />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
            <Footer />
          </Router>
        </InvoiceProvider>
      </WishlistProvider>
    </ThemeProvider>
  );
};

export default App;
