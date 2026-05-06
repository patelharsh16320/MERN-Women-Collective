import React from "react";
import { useWishlistContext } from "./context/wishlist_context";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlistContext();

  if (wishlist.length === 0) {
    return <Wrapper><h2>Your wishlist is empty.</h2></Wrapper>;
  }

  return (
    <Wrapper>
      <h2>Your Wishlist</h2>
      <div className="wishlist-grid">
        {wishlist.map((item) => (
          <div className="wishlist-card" key={item.id}>
            <NavLink to={`/singleproduct/${item.id}`}>
              <img src={item.image && item.image[0] ? item.image[0].url : ""} alt={item.name} />
              <h3>{item.name}</h3>
            </NavLink>
            <button onClick={() => removeFromWishlist(item.id)}>Remove</button>
          </div>
        ))}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  padding: 2rem;
  h2 {
    margin-bottom: 2rem;
  }
  .wishlist-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
  }
  .wishlist-card {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
    background: #fff;
  }
  .wishlist-card img {
    width: 100%;
    max-width: 150px;
    height: 150px;
    object-fit: cover;
    margin-bottom: 1rem;
  }
  .wishlist-card button {
    margin-top: 1rem;
    background: #e11d48;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }
`;

export default Wishlist;
