import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  useGetCartQuery,
  useIncreaseQuantityMutation,
  useDecreaseQuantityMutation,
  useRemoveFromCartMutation,
} from "../../features/cart/cartApi";

const CartItem = () => {
  const navigate = useNavigate();
  const { data: cartItems, isLoading, isError } = useGetCartQuery();
  const [increaseQuantity, { isLoading: isIncreasing }] = useIncreaseQuantityMutation();
  const [decreaseQuantity, { isLoading: isDecreasing }] = useDecreaseQuantityMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const isBusy = isIncreasing || isDecreasing;

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-success" role="status" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-center text-danger py-5">Could not load your cart.</p>;
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="text-center py-5">
        <h4 className="text-muted">Your cart is empty.</h4>
        <Link to="/" className="btn btn-success mt-3">Browse Trees</Link>
      </div>
    );
  }

  // items whose tree was soft-deleted come back with treeId: null (see backend getCart)
  const validItems = cartItems.filter((item) => item.treeId);
  const totalItems = validItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = validItems.reduce((sum, item) => sum + item.treeId.price * item.quantity, 0);

  return (
    <div className="container mt-2 mb-5">
      <h3 className="mb-4">Your Cart</h3>
      <div className="row">
          <div className="col-lg-8">
              {cartItems.map((item) => 
              item.treeId ? (
                <div key={item._id} className="card mb-3 shadow-sm">
                  <div className="row g-0 align-items-center">
                      <div className="col-3 col-md-2">
                          <img src={item.treeId.image?.url} alt={item.treeId.name} 
                          className="img-fluid rounded-start"
                          style={{ height: "100px", width: "100%", objectFit: "cover" }}
                          />
                      </div>
                      <div className="col-9 col-md-4">
                      <div className="card-body py-2">
                        <h5 className="card-title mb-1">{item.treeId.name}</h5>
                        <p className="card-text text-muted mb-1">{item.treeId.species}</p>
                        <p className="card-text fw-semibold mb-0">₹{item.treeId.price}</p>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="d-flex align-items-center justify-content-center gap-2">
                            <button onClick={() => decreaseQuantity(item._id)}
                            className="btn btn-outline-secondary btn-sm"
                            disabled={isBusy}
                              >
                              -
                            </button>

                            <span>{item.quantity}</span>

                            <button onClick={() => increaseQuantity(item._id)}
                              className="btn btn-outline-secondary btn-sm"
                              disabled={isBusy}
                              >
                              +
                            </button>
                        </div>
                    </div>

                    <div className="col-6 col-md-3 d-flex flex-column gap-2 p-2">
                      <button 
                      onClick={() => navigate(`/sponsor?type=cart-item&cartId=${item._id}`)}
                      className="btn btn-warning btn-sm"
                      >
                        Sponsor This
                      </button>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={item._id} className="card mb-3 p-3 d-flex flex-row justify-content-between align-items-center text-muted">
                  <span>This tree is no longer available.</span>
                    <button onClick={() => removeFromCart(item._id)} 
                    className="btn btn-outline-danger btn-sm">
                      Remove
                    </button>
                </div>
              ))}
          </div>
          <div className="col-lg-4">
            <div className="card shadow-sm p-3">
              <h5>Order Summary</h5>
              <p className="mb-1">Total Trees: {totalItems}</p>
              <h4 className="text-success">₹{totalPrice}</h4>
              <button
                onClick={() => navigate("/sponsor?type=cart-all")}
                className="btn btn-success w-100 mt-2"
                disabled={validItems.length === 0}
              >
                Sponsor All
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;