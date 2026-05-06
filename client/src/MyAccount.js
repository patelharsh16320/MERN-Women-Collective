import React from "react";
import styled from "styled-components";

const userDemoData = {
  "user@example.com": {
    name: "Demo User",
    email: "user@example.com",
    address: "123 Main St, City, Country",
    phone: "1234567890"
  },
  "harsh@gmail.com": {
    name: "Harsh",
    email: "harsh@gmail.com",
    address: "456 Demo Lane, City, Country",
    phone: "9876543210"
  }
};

const MyAccount = () => {
  const user = JSON.parse(localStorage.getItem("userData"));
  const [addresses, setAddresses] = React.useState(JSON.parse(localStorage.getItem("myAddresses") || "[]"));
  const [newAddr, setNewAddr] = React.useState({ street: "", city: "", state: "", zip: "", country: "" });
  const [editIdx, setEditIdx] = React.useState(null);
  const [editAddr, setEditAddr] = React.useState({ street: "", city: "", state: "", zip: "", country: "" });
  if (!user) return <Wrapper><h2>Not logged in</h2></Wrapper>;
  return (
    <Wrapper>
      <h2>My Account</h2>
      <div className="account-section">
        <h3>Dashboard</h3>
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Phone:</b> {user.phone}</p>
        <div style={{marginTop:8}}>
          <a href="/dashboard" style={{marginRight:12}}>Edit Personal Details</a>
          <a href="/change-password">Change Password</a>
        </div>
      </div>
      <div className="account-section">
        <h3>My Addresses</h3>
        {addresses.length === 0 && <p>No saved addresses.</p>}
        {addresses.length > 0 && (
          <table style={{width:'100%', borderCollapse:'collapse', marginBottom:16}}>
            <thead>
              <tr style={{background:'#f6f6f6'}}>
                <th style={{padding:4, border:'1px solid #eee'}}>Street</th>
                <th style={{padding:4, border:'1px solid #eee'}}>City</th>
                <th style={{padding:4, border:'1px solid #eee'}}>State</th>
                <th style={{padding:4, border:'1px solid #eee'}}>Zip</th>
                <th style={{padding:4, border:'1px solid #eee'}}>Country</th>
                <th style={{padding:4, border:'1px solid #eee'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map((addr, idx) => (
                <tr key={idx}>
                  {editIdx === idx ? (
                    <>
                      <td style={{padding:4, border:'1px solid #eee'}}><input type="text" value={editAddr.street} onChange={e => setEditAddr(a => ({...a, street: e.target.value}))} required style={{width:'90%'}} placeholder="Street" /></td>
                      <td style={{padding:4, border:'1px solid #eee'}}><input type="text" value={editAddr.city} onChange={e => setEditAddr(a => ({...a, city: e.target.value}))} required style={{width:'90%'}} placeholder="City" /></td>
                      <td style={{padding:4, border:'1px solid #eee'}}><input type="text" value={editAddr.state} onChange={e => setEditAddr(a => ({...a, state: e.target.value}))} required style={{width:'90%'}} placeholder="State" /></td>
                      <td style={{padding:4, border:'1px solid #eee'}}><input type="text" value={editAddr.zip} onChange={e => setEditAddr(a => ({...a, zip: e.target.value.replace(/[^0-9]/g,"")}))} required style={{width:'90%'}} placeholder="Zip" maxLength={10} pattern="[0-9]*" inputMode="numeric" /></td>
                      <td style={{padding:4, border:'1px solid #eee'}}><input type="text" value={editAddr.country} onChange={e => setEditAddr(a => ({...a, country: e.target.value}))} required style={{width:'90%'}} placeholder="Country" /></td>
                      <td style={{padding:4, border:'1px solid #eee'}}>
                        <button onClick={e => {
                          e.preventDefault();
                          const updated = addresses.map((a, i) => i === idx ? editAddr : a);
                          setAddresses(updated);
                          localStorage.setItem("myAddresses", JSON.stringify(updated));
                          setEditIdx(null);
                        }}>Save</button>
                        <button onClick={() => setEditIdx(null)} style={{marginLeft:4}}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{padding:4, border:'1px solid #eee'}}>{addr.street}</td>
                      <td style={{padding:4, border:'1px solid #eee'}}>{addr.city}</td>
                      <td style={{padding:4, border:'1px solid #eee'}}>{addr.state}</td>
                      <td style={{padding:4, border:'1px solid #eee'}}>{addr.zip}</td>
                      <td style={{padding:4, border:'1px solid #eee'}}>{addr.country}</td>
                      <td style={{padding:4, border:'1px solid #eee'}}>
                        <button onClick={() => { setEditIdx(idx); setEditAddr(addr); }}>Edit</button>
                        <button onClick={() => {
                          const updated = addresses.filter((_, i) => i !== idx);
                          setAddresses(updated);
                          localStorage.setItem("myAddresses", JSON.stringify(updated));
                        }} style={{marginLeft:4, color:'red'}}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <form onSubmit={e => {
          e.preventDefault();
          const updated = [...addresses, newAddr];
          setAddresses(updated);
          localStorage.setItem("myAddresses", JSON.stringify(updated));
          setNewAddr({ street: "", city: "", state: "", zip: "", country: "" });
        }} style={{marginTop:8}}>
          <input type="text" placeholder="Street" value={newAddr.street} onChange={e => setNewAddr(a => ({...a, street: e.target.value}))} required />
          <input type="text" placeholder="City" value={newAddr.city} onChange={e => setNewAddr(a => ({...a, city: e.target.value}))} required />
          <input type="text" placeholder="State" value={newAddr.state} onChange={e => setNewAddr(a => ({...a, state: e.target.value}))} required />
          <input type="text" placeholder="Zip" value={newAddr.zip} onChange={e => setNewAddr(a => ({...a, zip: e.target.value.replace(/[^0-9]/g,"")}))} required maxLength={10} pattern="[0-9]*" inputMode="numeric" />
          <input type="text" placeholder="Country" value={newAddr.country} onChange={e => setNewAddr(a => ({...a, country: e.target.value}))} required />
          <button type="submit">Add Address</button>
        </form>
      </div>
      <div className="account-section">
        <h3>My Orders</h3>
        <a href="/order">Go to My Orders</a>
      </div>
      <div className="account-section">
        <h3>My Downloads</h3>
        <p>Download your <a href="/invoice">invoices</a>.</p>
      </div>
      <div className="account-section">
        <h3>Customer Service</h3>
        <p>Contact us at <b>support@example.com</b> for help.</p>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  max-width: 600px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 2rem;
  h2 {
    margin-bottom: 1.5rem;
  }
  .account-section {
    margin-bottom: 2rem;
    h3 {
      margin-bottom: 0.5rem;
    }
  }
`;

export default MyAccount;
export { userDemoData };
