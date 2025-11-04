import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cartItems] = useState([]);

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item?.price || 0) * Number(item?.quantity || 1),
      0
    );
    const shipping = 0;
    const tax = 0;
    const total = subtotal + shipping + tax;

    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    };
  }, [cartItems]);

  const hasItems = cartItems.length > 0;

  return (
    <div className="cart-page py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 text-center mb-4">
            <h1 className="fw-bold">Your Shopping Cart</h1>
            <p className="text-muted mb-0">
              Review the items in your cart and proceed to secure checkout when you're ready.
            </p>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-8">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="mb-0">Cart Items</h5>
                  <span className="badge bg-secondary">{cartItems.length}</span>
                </div>

                {hasItems ? (
                  <div className="list-group list-group-flush">
                    {cartItems.map((item) => (
                      <div key={item?.id || item?._id} className="list-group-item px-0 border-0">
                        <div className="d-flex gap-3 align-items-start">
                          <div className="flex-shrink-0">
                            <img
                              src={item?.image}
                              alt={item?.name}
                              className="rounded"
                              style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            />
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{item?.name}</h6>
                            <p className="text-muted small mb-2">{item?.description}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fw-semibold">${Number(item?.price || 0).toFixed(2)}</span>
                              <span className="text-muted">Qty: {Number(item?.quantity || 1)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted py-5">
                    <p className="mb-0">No items in your cart yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="mb-4">Order Summary</h5>

                {!hasItems && (
                  <div className="text-center text-muted mb-4">
                    <div className="display-4" role="img" aria-label="Empty cart">
                      🛒
                    </div>
                    <h6 className="mt-3 text-dark">Your cart is empty</h6>
                    <p className="mb-3">Looks like you haven't added any items yet.</p>
                    <Link to="/products" className="btn btn-outline-primary w-100">
                      Continue Shopping
                    </Link>
                  </div>
                )}

                <div className="mb-4 bg-light rounded-3 p-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span className="fw-semibold">${totals.subtotal}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Shipping (FREE)</span>
                    <span className="fw-semibold">${totals.shipping}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Tax</span>
                    <span className="fw-semibold">${totals.tax}</span>
                  </div>
                  <div className="d-flex justify-content-between border-top pt-3">
                    <span className="fw-bold">Total</span>
                    <span className="fw-bold">${totals.total}</span>
                  </div>
                </div>

                <button className="btn btn-primary w-100 mb-2" disabled>
                  Proceed to Checkout
                </button>
                <Link to="/products" className="btn btn-outline-secondary w-100">
                  Continue Shopping
                </Link>

                <p className="text-center text-muted small mt-auto pt-4 mb-0">
                  Secure checkout with SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
