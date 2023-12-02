import "./ProductDetail.css";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { Link, useHistory} from "react-router-dom";
import { getAllProducts, getProductInfo } from "../../store/products";
import { fetchReviews, fetchReviewById } from "../../store/reviews";
import ReviewList from "../ReviewList";
import ProductTile from "../Product-Components/ProductTile";

import { addItem } from "../../store/cart";

const ProductDetailPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { productId } = useParams();
  const [selected, setSelected] = useState("");

  const currentProduct = useSelector((state) => state?.products?.productDetail);
  let index = [];

  if (currentProduct) {
    for (let i = 1; i < currentProduct.quantity + 1; i++) {
      index.push(i);
    }
  }

  //useSelector to get the current cart
  const currentCart = useSelector((state) => state?.cart?.cartId)

  useEffect(() => {
    dispatch(fetchReviewById(parseInt(productId)));
    dispatch(getProductInfo(parseInt(productId)));
  }, [dispatch]);

  const handleSelectChange = (e) => {
    setSelected(e.target.value);
  };

  const handleAddToCart = async () => {
    const newCartItem = {
      product_id: productId,
      cart_id: currentCart,
      quantity: selected
    }
    dispatch(addItem(newCartItem, currentCart)).then(history.push("/cart"));
  };


  return (
    <>
      {currentProduct?.id ? (
        <>
          <h1>{currentProduct?.name}</h1>
          <div>
            {currentProduct?.preview_image_url ? (
              <img src={currentProduct?.preview_image_url[0]} />
            ) : (
              "no image"
            )}
            <div>
              <div className="itemprice">${currentProduct?.price}</div>
              <div className="itemdescription">
                {currentProduct?.description}
              </div>
              <div className="itemarriving">
                <i class="fa-solid fa-check"></i>
                Arrives soon! Get it by Tomorrow if you order today
              </div>
            </div>
            <label className="dropdown">Quantity</label>
            <select
              id="dropdown"
              value={selected}
              onChange={handleSelectChange}
            >
              {index.map((idx) => {
                return (
                  <option key={idx} value={idx}>
                    {idx}
                  </option>
                );
              })}
            </select>
            <button onClick={handleAddToCart}>Add to Cart</button>
            <hr />
            Related Searches
            <hr />
            <ReviewList productId={productId} />
            <hr />
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h2>No product found</h2>
          <Link to="/">
            <button>Go Back To Products</button>
          </Link>
        </div>
      )}
    </>
  );
};

export default ProductDetailPage;