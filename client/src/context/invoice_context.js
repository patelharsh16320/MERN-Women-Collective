// src/context/invoice_context.js
import React, { createContext, useContext, useState } from "react";

const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
  const [invoice, setInvoice] = useState(null);
  return (
    <InvoiceContext.Provider value={{ invoice, setInvoice }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoiceContext = () => useContext(InvoiceContext);
