import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("userData"));
  const navigate = useNavigate();
  const addresses = JSON.parse(localStorage.getItem("myAddresses") || "[]");
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || ""
  });
  const [success, setSuccess] = useState(false);
  const [defaultAddrIdx, setDefaultAddrIdx] = useState(() => {
    if (!addresses.length) return "new";
    const idx = addresses.findIndex(a => `${a.street}, ${a.city}, ${a.state}, ${a.zip}, ${a.country}` === form.address);
    return idx >= 0 ? idx : "new";
  });
  const [newAddr, setNewAddr] = useState({ street: "", city: "", state: "", zip: "", country: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleDefaultAddrChange = (e) => {
    const val = e.target.value;
    setDefaultAddrIdx(val);
    if (val === "new") {
      setForm(f => ({ ...f, address: `${newAddr.street}, ${newAddr.city}, ${newAddr.state}, ${newAddr.zip}, ${newAddr.country}` }));
    } else {
      const addr = addresses[val];
      if (addr) {
        setForm(f => ({ ...f, address: `${addr.street}, ${addr.city}, ${addr.state}, ${addr.zip}, ${addr.country}` }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userData", JSON.stringify(form));
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      navigate("/my-account");
    }, 1200);
  };

  if (!user) return <Wrapper><h2>Not logged in</h2></Wrapper>;

  return (
    <Wrapper>
      <h2>My Dashboard</h2>
      <form className="dashboard-form" onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group">
          <label>Set Default Address</label>
          <select value={defaultAddrIdx} onChange={handleDefaultAddrChange} style={{marginBottom:8}}>
            {addresses.map((addr, idx) => (
              <option value={idx} key={idx}>{addr.street}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}</option>
            ))}
            <option value="new">Create New Address</option>
          </select>
        </div>
        {defaultAddrIdx === "new" && (
          <div className="form-group">
            <label>New Address</label>
            <input type="text" placeholder="Street" value={newAddr.street} onChange={e => setNewAddr(a => ({...a, street: e.target.value}))} required />
            <input type="text" placeholder="City" value={newAddr.city} onChange={e => setNewAddr(a => ({...a, city: e.target.value}))} required />
            <input type="text" placeholder="State" value={newAddr.state} onChange={e => setNewAddr(a => ({...a, state: e.target.value}))} required />
            <input type="text" placeholder="Zip" value={newAddr.zip} onChange={e => setNewAddr(a => ({...a, zip: e.target.value.replace(/[^0-9]/g,"")}))} required maxLength={10} pattern="[0-9]*" inputMode="numeric" />
            <input type="text" placeholder="Country" value={newAddr.country} onChange={e => setNewAddr(a => ({...a, country: e.target.value}))} required />
            <button type="button" onClick={() => {
              const updated = [...addresses, newAddr];
              localStorage.setItem("myAddresses", JSON.stringify(updated));
              setDefaultAddrIdx(updated.length - 1);
              setForm(f => ({ ...f, address: `${newAddr.street}, ${newAddr.city}, ${newAddr.state}, ${newAddr.zip}, ${newAddr.country}` }));
              setNewAddr({ street: "", city: "", state: "", zip: "", country: "" });
            }}>Save Address</button>
          </div>
        )}
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="text" name="phone" value={form.phone} onChange={handleChange} required maxLength={15} />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input type="text" name="address" value={form.address} onChange={handleChange} required />
        </div>
        <button type="submit">Update Details</button>
        {success && <div className="success-msg">Details updated!</div>}
      </form>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  max-width: 500px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 2rem;
  h2 {
    margin-bottom: 1.5rem;
  }
  .dashboard-form {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .success-msg {
    color: green;
    margin-top: 1rem;
    font-weight: 500;
  }
`;

export default Dashboard;
