import React from "react";
import { useInvoiceContext } from "./context/invoice_context";
import styled from "styled-components";

const Invoice = () => {
  const { invoice } = useInvoiceContext();
  // Fallback dummy data if no invoice in context
  const fallback = {
    id: "INV123456",
    date: "2026-05-05",
    customer: "John Doe",
    address: "123 Main St, City, Country",
    items: [
      { name: "Modern Chair", qty: 1, price: 2599 }
    ],
    total: 2599,
    payment: "Cash on Delivery"
  };
  const data = invoice || fallback;

  return (
    <Wrapper>
      <h2>Invoice</h2>
      <div className="invoice-box">
        <div className="invoice-header">
          <span>Invoice ID: {data.id}</span>
          <span>Date: {data.date}</span>
        </div>
        <div className="invoice-customer">
          <span>Customer: {data.customer}</span>
          {data.email && <span>Email: {data.email}</span>}
          <span>Address: {data.address}</span>
        </div>
        <div className="invoice-items">
          <div className="invoice-item header">
            <span>Item</span>
            <span>Qty</span>
            <span>Price</span>
          </div>
          {data.items.map((item, idx) => (
            <div key={idx} className="invoice-item">
              <span>{item.name}</span>
              <span>{item.qty}</span>
              <span>₹{item.price}</span>
            </div>
          ))}
        </div>
        <div className="invoice-total">Total: ₹{data.total}</div>
        <div className="invoice-payment">Payment Method: {data.payment}</div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  padding: 2rem;
  h2 {
    margin-bottom: 2rem;
  }
  .invoice-box {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 1.5rem;
    background: #fff;
    max-width: 600px;
    margin: 0 auto;
  }
  .invoice-header, .invoice-customer {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  .invoice-items {
    margin-bottom: 1rem;
  }
  .invoice-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  .invoice-item.header {
    font-weight: bold;
    border-bottom: 1px solid #eee;
    margin-bottom: 0.5rem;
  }
  .invoice-total, .invoice-payment {
    font-weight: bold;
    text-align: right;
    margin-top: 1rem;
  }
`;

export default Invoice;
