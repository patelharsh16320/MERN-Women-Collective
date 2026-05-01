import { getProductById } from "@/services/productService";
import ProductActionsClient from "@/components/ProductActionsClient";

function resolveImageUrl(imagePath) {
  if (!imagePath) return "";

  if (imagePath.startsWith("http")) return imagePath;

  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const apiOrigin = (apiBase || "").replace(/\/api\/?$/i, "");

  if (imagePath.startsWith("/uploads")) return `${apiOrigin}${imagePath}`;
  if (imagePath.startsWith("uploads")) return `${apiOrigin}/${imagePath}`;

  return imagePath;
}

export default async function ProductDetailPage({ params }) {

  // ✅ CORRECT way (Next.js)
  const id = params?.id;

  const product = await getProductById(id);

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h2>Product not found</h2>
      </div>
    );
  }

  const imgSrc = resolveImageUrl(product.image);

  // ✅ pricing logic
  const hasDiscount =
    product.sellPrice !== null &&
    product.sellPrice !== undefined &&
    product.sellPrice < product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.sellPrice) / product.price) * 100)
    : 0;

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="row align-items-center">

            {/* Image */}
            <div className="col-md-6 text-center mb-4 mb-md-0">
              <img
                src={imgSrc}
                alt={product.name}
                className="img-fluid rounded"
                style={{ maxHeight: "450px", objectFit: "cover" }}
              />
            </div>

            {/* Details */}
            <div className="col-md-6">

              <h1 className="fw-bold mb-3">{product.name}</h1>

              <p className="text-muted mb-3">
                {product.description}
              </p>

              {/* ✅ PRICE UI */}
              <div className="mb-4">

                {hasDiscount ? (
                  <>
                    <h3 className="fw-bold text-success mb-1">
                      ₹ {product.sellPrice}
                    </h3>

                    <div className="d-flex align-items-center gap-2">
                      <span className="text-muted text-decoration-line-through">
                        ₹ {product.price}
                      </span>

                      <span className="badge bg-danger">
                        {discountPercent}% OFF
                      </span>
                    </div>
                  </>
                ) : (
                  <h3 className="fw-semibold">
                    ₹ {product.price}
                  </h3>
                )}

              </div>

              {/* Extra info */}
              <p className="text-muted">
                Stock: <strong>{product.countInStock}</strong>
              </p>

              {/* Actions */}
              <ProductActionsClient
                product={{
                  _id: product._id,
                  name: product.name,
                  price: product.sellPrice || product.price, // ✅ important
                  image: imgSrc,
                }}
              />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}