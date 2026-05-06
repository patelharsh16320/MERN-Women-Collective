
import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import styled from "styled-components";
import { useCartContext } from "./context/cart_context";
import { useInvoiceContext } from "./context/invoice_context";
import { useNavigate } from "react-router-dom";
import FormatPrice from "./Helpers/FormatPrice";

// Demo shipping fee tables for dropdown
const COUNTRY_SHIPPING_FEES = [
  { country: "India", fee: 60000 }, // ₹600
  { country: "USA", fee: 60000 },
  { country: "UK", fee: 60000 },
  { country: "Canada", fee: 60000 },
  { country: "Australia", fee: 60000 },
  { country: "Other", fee: 60000 },
];
const INDIAN_STATES = [
  { state: "Gujarat", fee: 0 },
  { state: "Maharashtra", fee: 10000 }, // ₹100
  { state: "Delhi", fee: 10000 },
  { state: "Karnataka", fee: 10000 },
  { state: "Tamil Nadu", fee: 10000 },
  { state: "Other", fee: 10000 },
];


// --- State-wise shipping fee logic ---
function getShippingFee(state, country) {
  if (!state) return 10000; // fallback (₹100)
  const st = state.trim().toLowerCase();
  const ctry = (country || "").trim().toLowerCase();
  if (st === "gujarat") return 0;
  if (ctry !== "india" && ctry !== "in") return 100000; // 1000 for outside India
  return 10000; // 100 for other states in India
}

const Checkout = () => {
  const { cart, total_price, shipping_fee, clearCart } = useCartContext();
  const { setInvoice } = useInvoiceContext();
  const navigate = useNavigate();
  // Prefill email if user is logged in
  const user = JSON.parse(localStorage.getItem("userData"));
  // Load addresses from localStorage
  const savedAddresses = JSON.parse(localStorage.getItem("myAddresses") || "[]");
  // Find default address index from user.address
  let defaultAddressIdx = "custom";
  if (user && user.address && savedAddresses.length) {
    defaultAddressIdx = savedAddresses.findIndex(a => `${a.street}, ${a.city}, ${a.state}, ${a.zip}, ${a.country}` === user.address);
    if (defaultAddressIdx === -1) defaultAddressIdx = "custom";
  } else if (savedAddresses.length) {
    defaultAddressIdx = 0;
  }
  const [addresses, setAddresses] = useState(savedAddresses);
  const [selectedAddress, setSelectedAddress] = useState(defaultAddressIdx);
  const [form, setForm] = useState(() => {
    let addr = {};
    if (defaultAddressIdx !== "custom" && savedAddresses[defaultAddressIdx]) {
      addr = savedAddresses[defaultAddressIdx];
    }
    return {
      email: user?.email || "",
      fullName: user?.name || "",
      street: addr.street || "",
      city: addr.city || "",
      state: addr.state || "",
      zip: addr.zip || "",
      country: addr.country || "",
      payment: "cod"
    };
  });

  // Update form when address selection changes
  useEffect(() => {
    if (selectedAddress === "custom") return;
    const addr = addresses[selectedAddress];
    if (addr) {
      setForm(f => ({ ...f, ...addr }));
    }
  }, [selectedAddress]);
  const stripe = useStripe();
  const elements = useElements();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Save new address
  const handleSaveAddress = () => {
    const addr = {
      street: form.street,
      city: form.city,
      state: form.state,
      zip: form.zip,
      country: form.country
    };
    const updated = [...addresses, addr];
    setAddresses(updated);
    localStorage.setItem("myAddresses", JSON.stringify(updated));
    setSelectedAddress(updated.length - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let paymentSuccess = false;
    if (form.payment === "card") {
      if (!stripe || !elements) {
        alert("Stripe not loaded");
        return;
      }
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        alert("Please enter card details");
        return;
      }
      // Simulate Stripe payment success (demo only)
      paymentSuccess = true;
    } else {
      // COD always succeeds in demo
      paymentSuccess = true;
    }
    if (paymentSuccess) {
      // Prepare invoice data
      const invoiceData = {
        id: "INV" + Math.floor(Math.random() * 1000000),
        date: new Date().toISOString().slice(0, 10),
        customer: form.fullName,
        email: form.email,
        address: `${form.street}, ${form.city}, ${form.state}, ${form.zip}, ${form.country}`,
        items: cart.map(item => ({ name: item.name, qty: item.amount, price: item.price })),
        total: total_price + shipping_fee,
        payment: form.payment === "card" ? "Stripe (Test Card)" : "Cash on Delivery",
        status: "Placed"
      };
      // Save order to orderHistory in localStorage
      const orderHistory = JSON.parse(localStorage.getItem("orderHistory") || "[]");
      orderHistory.unshift(invoiceData); // newest first
      localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
      setInvoice(invoiceData);
      clearCart();
      navigate("/invoice");
    }
  };

  return (
    <Wrapper>
      <h2>Checkout</h2>
      <div className="checkout-grid">
        {/* LEFT SIDE: Shipping & Payment */}
        <form className="checkout-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label>Choose Address</label>
            <select value={selectedAddress} onChange={e => setSelectedAddress(e.target.value)}>
              {addresses.map((addr, idx) => (
                <option value={idx} key={idx}>
                  {addr.street}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}
                </option>
              ))}
              <option value="custom">Add New Address</option>
            </select>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required readOnly={!!user?.email} />
          </div>
          <h3>Shipping Address</h3>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
          </div>
          {selectedAddress === "custom" && (
            <>
              <div className="form-group">
                <label>Street Address</label>
                <input type="text" name="street" value={form.street} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" name="city" value={form.city} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <select name="state" value={form.state} onChange={handleChange} required>
                    <option value="">Select State</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Zip Code</label>
                  <input type="text" name="zip" value={form.zip} onChange={e => {
                    // Only allow numbers
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setForm({ ...form, zip: val });
                  }} required maxLength={10} pattern="[0-9]*" inputMode="numeric" />
                </div>
              </div>
              <div className="form-group">
                <label>Country</label>
                <select name="country" value={form.country} onChange={handleChange} required>
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <button type="button" onClick={handleSaveAddress} style={{marginBottom:8}}>Save Address</button>
            </>
          )}
          {/* ...existing code... (city, state, zip, country fields now inside custom address block) */}
          <h3>Payment Info</h3>
          <div className="form-group">
            <input type="radio" id="cod" name="payment" value="cod" checked={form.payment === "cod"} onChange={handleChange} />
            <label htmlFor="cod">Cash on Delivery (COD)</label>
          </div>
          <div className="form-group">
            <input type="radio" id="card" name="payment" value="card" checked={form.payment === "card"} onChange={handleChange} />
            <label htmlFor="card">Card (Stripe)</label>
            {form.payment === "card" && (
              <>
                <div style={{ color: '#4f46e5', fontSize: '0.95rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                  <span role="img" aria-label="info">ℹ️</span> Test mode: Use card <b>4242 4242 4242 4242</b> (any future date, any CVC)
                </div>
                <div style={{ marginTop: "0.5rem", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}>
                  <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
                </div>
              </>
            )}
          </div>
          <button type="submit">Place Order</button>
        </form>

        {/* RIGHT SIDE: Order Details */}
        <div className="order-summary">
          <h3>Order Details</h3>
          {cart.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            <>
              <div className="order-items">
                {cart.map((item) => (
                  <div className="order-item" key={item.id}>
                    <img src={item.image && item.image[0]?.url ? item.image[0].url : item.image?.url || "https://dummyjson.com/image/150"} alt={item.name} style={{width:60,height:60,objectFit:'cover',borderRadius:4,background:'#f6f6f6'}} />
                    <div>
                      <div>{item.name}</div>
                      <div>Qty: {item.amount}</div>
                    </div>
                    <div>₹{item.price}</div>
                  </div>
                ))}
              </div>
              <div className="order-discount">
                <span>Discount:</span> <span>₹0</span>
              </div>
              <div className="order-subtotal">
                <span>Subtotal:</span> <span><FormatPrice price={total_price} /></span>
              </div>
              <div className="order-shipping">
                <span>Shipping:</span> <span><FormatPrice price={getShippingFee(form.state, form.country)} /></span>
              </div>
              <div className="order-total">
                <span>Total:</span> <span><FormatPrice price={total_price + getShippingFee(form.state, form.country)} /></span>
              </div>

                {/* Shipping Fee Breakdown Dropdown */}
                <details style={{marginTop: '1.5rem'}}>
                  <summary style={{fontWeight: 500, color: '#4f46e5', cursor: 'pointer', fontSize: '1.1rem'}}>Shipping Fee Breakdown</summary>
                  <div style={{marginTop: 12}}>
                    <div style={{marginBottom: 8, fontWeight: 500}}>By Country:</div>
                    <table style={{ borderCollapse: 'collapse', marginBottom: 16, width: '100%' }}>
                      <thead>
                        <tr style={{ background: '#f6f6f6' }}>
                          <th style={{ padding: '4px 12px', border: '1px solid #eee', textAlign: 'left' }}>Country</th>
                          <th style={{ padding: '4px 12px', border: '1px solid #eee', textAlign: 'left' }}>Shipping Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        {COUNTRY_SHIPPING_FEES.map(row => (
                          <tr key={row.country}>
                            <td style={{ padding: '4px 12px', border: '1px solid #eee' }}>{row.country}</td>
                            <td style={{ padding: '4px 12px', border: '1px solid #eee' }}><FormatPrice price={row.fee} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{marginBottom: 8, fontWeight: 500}}>By Indian State:</div>
                    <table style={{ borderCollapse: 'collapse', marginBottom: 8, width: '100%' }}>
                      <thead>
                        <tr style={{ background: '#f6f6f6' }}>
                          <th style={{ padding: '4px 12px', border: '1px solid #eee', textAlign: 'left' }}>State</th>
                          <th style={{ padding: '4px 12px', border: '1px solid #eee', textAlign: 'left' }}>Shipping Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        {INDIAN_STATES.map(row => (
                          <tr key={row.state}>
                            <td style={{ padding: '4px 12px', border: '1px solid #eee' }}>{row.state}</td>
                            <td style={{ padding: '4px 12px', border: '1px solid #eee' }}><FormatPrice price={row.fee} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
};


const Wrapper = styled.section`
  padding: 2rem;
  max-width: 1100px;
  margin: 0 auto;
  h2 {
    margin-bottom: 2rem;
  }
  .checkout-grid {
    display: flex;
    gap: 3rem;
    align-items: flex-start;
  }
  .checkout-form {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    background: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .form-row {
    display: flex;
    gap: 1rem;
  }
  button {
    background: #4f46e5;
    color: #fff;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 1.5rem;
  }
  .order-summary {
    flex: 1;
    background: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .order-items {
    margin-bottom: 1.5rem;
  }
  .order-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
  }
  .order-item img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    background: #f6f6f6;
  }
  .order-discount, .order-subtotal, .order-shipping, .order-total {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }
  .order-total {
    font-weight: bold;
    font-size: 1.2rem;
    color: #4f46e5;
  }
`;

export default Checkout;
