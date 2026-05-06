import React, { useState } from "react";
import styled from "styled-components";

// Helper for price formatting
import FormatPrice from "./Helpers/FormatPrice";

// List of demo countries and their shipping fees (in paise)
const COUNTRY_SHIPPING_FEES = [
  { country: "India", fee: 60000 },
  { country: "USA", fee: 60000 },
  { country: "UK", fee: 60000 },
  { country: "Canada", fee: 60000 },
  { country: "Australia", fee: 60000 },
  { country: "Other", fee: 60000 },
];
const INDIAN_STATES = [
  { state: "Gujarat", fee: 0 },
  { state: "Maharashtra", fee: 60000 },
  { state: "Delhi", fee: 60000 },
  { state: "Karnataka", fee: 60000 },
  { state: "Tamil Nadu", fee: 60000 },
  { state: "Other", fee: 60000 },
];

const Order = () => {
  // Load all orders from localStorage (simulate order history)
  // Orders are stored as an array in localStorage under "orderHistory"
  const orders = JSON.parse(localStorage.getItem("orderHistory") || "[]");
  const user = JSON.parse(localStorage.getItem("userData"));

  const [expanded, setExpanded] = useState(null);
  const [showAllCountries, setShowAllCountries] = useState(false);
  return (
    <Wrapper>
      <h2>Your Orders</h2>
      {orders.length === 0 && <div>No orders found.</div>}
      {/* Shipping Charges Table (Demo) */}
      <div className="shipping-fee-table">
        <h4>Shipping Charges by Country</h4>
        <table style={{ borderCollapse: 'collapse', marginBottom: 16 }}>
          <thead>
            <tr style={{ background: '#f6f6f6' }}>
              <th style={{ padding: '4px 12px', border: '1px solid #eee' }}>Country</th>
              <th style={{ padding: '4px 12px', border: '1px solid #eee' }}>Shipping Fee</th>
            </tr>
          </thead>
          <tbody>
            {(showAllCountries ? COUNTRY_SHIPPING_FEES : COUNTRY_SHIPPING_FEES.slice(0, 5))
              .sort((a, b) => a.fee - b.fee)
              .map((row, idx) => (
                <tr key={row.country}>
                  <td style={{ padding: '4px 12px', border: '1px solid #eee' }}>{row.country}</td>
                  <td style={{ padding: '4px 12px', border: '1px solid #eee' }}><FormatPrice price={row.fee} /></td>
                </tr>
              ))}
          </tbody>
        </table>
        {!showAllCountries && COUNTRY_SHIPPING_FEES.length > 5 && (
          <button style={{ marginBottom: 16 }} onClick={() => setShowAllCountries(true)}>Show All Countries</button>
        )}
        <h4>Shipping Charges by Indian State</h4>
        <table style={{ borderCollapse: 'collapse', marginBottom: 16 }}>
          <thead>
            <tr style={{ background: '#f6f6f6' }}>
              <th style={{ padding: '4px 12px', border: '1px solid #eee' }}>State</th>
              <th style={{ padding: '4px 12px', border: '1px solid #eee' }}>Shipping Fee</th>
            </tr>
          </thead>
          <tbody>
            {INDIAN_STATES.sort((a, b) => a.fee - b.fee).map((row, idx) => (
              <tr key={row.state}>
                <td style={{ padding: '4px 12px', border: '1px solid #eee' }}>{row.state}</td>
                <td style={{ padding: '4px 12px', border: '1px solid #eee' }}><FormatPrice price={row.fee} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.map((order, idx) => (
        <div className="order-card" key={order.id || idx}>
          <div className="order-header" style={{cursor:'pointer'}} onClick={() => setExpanded(expanded === idx ? null : idx)}>
            <span>Order ID: {order.id}</span>
            <span>Date: {order.date}</span>
            <span>Status: {order.status || "Placed"}</span>
            <span style={{color:'#4f46e5', fontWeight:500}}>{expanded === idx ? 'Hide Details ▲' : 'Show Details ▼'}</span>
          </div>
          {expanded === idx && (
            <div className="order-details-expanded">
              <div className="order-user-details">
                <h4>User Details</h4>
                <div><b>Name:</b> {order.customer || user?.name}</div>
                <div><b>Email:</b> {order.email || user?.email}</div>
              </div>
              <div className="order-address-details">
                <h4>Shipping Address</h4>
                <div>{order.address}</div>
              </div>
              <div className="order-items">
                <div className="order-item order-item-header">
                  <span style={{fontWeight:'bold'}}>Product</span>
                  <span style={{fontWeight:'bold'}}>Qty</span>
                  <span style={{fontWeight:'bold'}}>Price</span>
                </div>
                {order.items.map((item, i) => (
                  <div key={i} className="order-item">
                    <span>{item.name}</span>
                    <span>{item.qty}</span>
                    <span>₹{item.price}</span>
                  </div>
                ))}
              </div>
              <div className="order-total">Total: ₹{order.total}</div>
              <div className="order-payment">Payment Method: {order.payment}</div>
            </div>
          )}
        </div>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.section`
  padding: 2rem;
  h2 {
    margin-bottom: 2rem;
  }
  .order-user-details, .order-address-details {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
    background: #fafbfc;
    max-width: 500px;
  }
  .order-user-details h3, .order-address-details h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
  .order-card {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 2rem;
    background: #fff;
  }
  .order-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    font-weight: bold;
  }
  .order-items {
    margin-bottom: 1rem;
  }
  .order-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  .order-item-header {
    background: #f6f6f6;
    border-radius: 4px;
    padding: 0.3rem 0.5rem;
    margin-bottom: 0.5rem;
  }
  .order-total {
    font-weight: bold;
    text-align: right;
  }
`;

export default Order;
