import { fetchAPI } from "./api";

export const createInvoice = (payload) =>
  fetchAPI("/invoices", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getInvoices = () =>
  fetchAPI("/invoices");

export const getInvoiceById = (id) =>
  fetchAPI(`/invoices/${id}`);