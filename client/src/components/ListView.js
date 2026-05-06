
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import FormatPrice from "../Helpers/FormatPrice";
import { Button } from "../styles/Button";
import { useCartContext } from "../context/cart_context";

const ListView = ({ products }) => {
  const { addToCart } = useCartContext();
  return (
    <Wrapper className="section">
      <div className="container grid">
        {products.map((curElem) => {
          const { id, name, image, price, description, colors } = curElem;
          return (
            <div className="card grid grid-two-column" key={id}>
              <figure>
                <img src={image && image[0] ? image[0].url : ""} alt={name} />
              </figure>

              <div className="card-data">
                <h3>{name}</h3>
                <p>
                  <FormatPrice price={price} />
                </p>
                <p>{description.slice(0, 90)}...</p>

                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <NavLink to={`/singleproduct/${id}`} className="btn-main">
                    <Button className="btn">Read More</Button>
                  </NavLink>
                  <button
                    title="Add to Cart"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                    onClick={() => addToCart(id, colors?.[0] || "#000", 1, curElem)}
                  >
                    <svg width="22" height="22" fill="#4f46e5" viewBox="0 0 24 24"><path d="M10 20c0 .552-.447 1-1 1s-1-.448-1-1 .447-1 1-1 1 .448 1 1zm10-2v2c0 1.104-.896 2-2 2h-12c-1.104 0-2-.896-2-2v-2h16zm-2-2h-12c-1.104 0-2-.896-2-2v-2c0-1.104.896-2 2-2h12c1.104 0 2 .896 2 2v2c0 1.104-.896 2-2 2zm-10-8c0-2.209 1.791-4 4-4s4 1.791 4 4h-8zm10 0c0-3.313-2.687-6-6-6s-6 2.687-6 6v2c0 1.104.896 2 2 2h12c1.104 0 2-.896 2-2v-2z"/></svg>
                  </button>
                  <button
                    title="Add to Wishlist"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                    onClick={() => alert("Added to wishlist!")}
                  >
                    <svg width="22" height="22" fill="#e11d48" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  padding: 9rem 0;

  .container {
    max-width: 120rem;
  }

  .grid {
    gap: 3.2rem;
  }

  figure {
    width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    transition: all 0.5s linear;
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 0%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      transition: all 0.2s linear;
      cursor: pointer;
    }
    &:hover::after {
      width: 100%;
    }
    &:hover img {
      transform: scale(1.2);
    }
    img {
      max-width: 90%;
      margin-top: 1.5rem;
      height: 20rem;
      transition: all 0.2s linear;
    }
  }

  .card {
    border: 0.1rem solid rgb(170 170 170 / 40%);

    .card-data {
      padding: 0 2rem;
    }

    h3 {
      margin: 2rem 0;
      font-weight: 300;
      font-size: 2.4rem;
      text-transform: capitalize;
    }

    .btn {
      margin: 2rem 0;
      background-color: rgb(0 0 0 / 0%);
      border: 0.1rem solid rgb(98 84 243);
      display: flex;
      justify-content: center;
      align-items: center;
      color: rgb(98 84 243);

      &:hover {
        background-color: rgb(98 84 243);
      }

      &:hover a {
        color: #fff;
      }
      a {
        color: rgb(98 84 243);
        font-size: 1.4rem;
      }
    }

    .btn-main .btn:hover {
      color: #fff;
    }
  }
`;

export default ListView;
