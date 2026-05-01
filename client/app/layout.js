import Header from "./components/Header";
import Footer from "../components/Footer";
import BootstrapClient from "./components/BootstrapClient";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppGuard from "./components/AppGuard";

export const metadata = {
  title: "Women Hub",
  description: "Women Hub shop",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="app-body">
        
        <BootstrapClient />

        <AppGuard>
          {/* HEADER */}
          <Header />

          {/* MAIN CONTENT */}
          <main className="main-content">
            <div className="container py-4">
              {children}
            </div>
          </main>

          {/* FOOTER */}
          <Footer />
        </AppGuard>

        {/* TOAST */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="colored"
        />

      </body>
    </html>
  );
}