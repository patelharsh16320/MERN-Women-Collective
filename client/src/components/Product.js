
import React from "react";
import { NavLink } from "react-router-dom";
import FormatPrice from "../Helpers/FormatPrice";
import { useCartContext } from "../context/cart_context";
import { useWishlistContext } from "../context/wishlist_context";
import { FaHeart, FaCartPlus } from "react-icons/fa";


const Product = (curElem) => {
  const { id, name, image, price, category } = curElem;
  const { addToCart } = useCartContext();
  const { addToWishlist } = useWishlistContext();
  const handleWishlist = () => {
    addToWishlist(curElem);
  };
  return (
    <div className="card">
      <NavLink to={`/singleproduct/${id}`}>
        <figure>
          <img src={image && image[0] ? image[0].url : ""} alt={name} />
          <figcaption className="caption">{category}</figcaption>
        </figure>
      </NavLink>
      <div className="card-data">
        <div className="card-data-flex">
          <h3>{name}</h3>
          <p className="card-data--price">{<FormatPrice price={price} />}</p>
        </div>
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
          <button
            title="Add to Cart"
            style={{ background: "none", border: "none", cursor: "pointer" }}
            onClick={() => addToCart(id, curElem.colors?.[0] || "#000", 1, curElem)}
          >
            <FaCartPlus size={22} color="#4f46e5" />
          </button>
          <button
            title="Add to Wishlist"
            style={{ background: "none", border: "none", cursor: "pointer" }}
            onClick={handleWishlist}
          >
            <FaHeart size={22} color="#e11d48" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
