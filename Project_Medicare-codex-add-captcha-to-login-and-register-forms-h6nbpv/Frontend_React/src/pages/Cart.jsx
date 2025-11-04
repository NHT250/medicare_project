// Cart Page Component
import React, { useEffect, useMemo, useState } from 'react'; // fix: memoize totals and manage confirm state
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();

  const [pendingRemovalId, setPendingRemovalId] = useState(null); // fix: replace window.confirm with inline confirmation

  const TAX_RATE = 0.08; // fix: shared rates/constants
  const SHIPPING_FEE = 5;
  const FREE_SHIP_THRESHOLD = 100;
  const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100; // fix: avoid floating point drift

  const { subtotal, shipping, tax, total } = useMemo(() => {
    const currentSubtotal = round2(cartTotal);
    const currentShipping =
      currentSubtotal === 0 || currentSubtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
    const currentTax = round2(currentSubtotal * TAX_RATE);
    const currentTotal = round2(currentSubtotal + currentShipping + currentTax);

    return {
      subtotal: currentSubtotal,
      shipping: currentShipping,
      tax: currentTax,
      total: currentTotal
    };
  }, [cartTotal]);

  const placeholderImage = 'https://via.placeholder.com/150x150?text=No+Image'; // fix: placeholder for missing images

  const handleIncreaseQuantity = (item) => {
    const itemId = item?.id ?? item?._id; // fix: support id or _id keys
    if (!itemId) {
      return;
    }
    updateQuantity(itemId, (Number(item?.quantity || 0) + 1));
  };

  const handleDecreaseQuantity = (item) => {
    const itemId = item?.id ?? item?._id; // fix: support id or _id keys
    if (!itemId) {
      return;
    }
    if ((item?.quantity || 0) > 1) {
      updateQuantity(itemId, Number(item.quantity) - 1);
    }
  };

  const handleRemoveItem = (item) => {
    const itemId = item?.id ?? item?._id; // fix: unified id extraction
    if (!itemId) {
      return;
    }
    if (pendingRemovalId === itemId) {
      removeFromCart(itemId);
      setPendingRemovalId(null);
      return;
    }
    setPendingRemovalId(itemId);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  useEffect(() => {
    if (pendingRemovalId && !cartItems.some((item) => (item?.id ?? item?._id) === pendingRemovalId)) {
      setPendingRemovalId(null); // fix: reset pending removal if item disappears
    }
  }, [cartItems, pendingRemovalId]);

  return (
    <div className="cart-page">
      <Navbar />

      <div className="container my-5">
        <h2 className="mb-4">Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <div className="empty-cart text-center py-5">
            <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
            <h4 className="text-muted">Your cart is empty</h4>
            <p className="text-muted">Add some items to your cart</p>
            <button className="btn btn-primary mt-3" onClick={() => navigate('/products')}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="row">
            {/* Cart Items */}
            <div className="col-lg-8 mb-4">
              <div className="card">
                <div className="card-body">
                  {cartItems.map((item, index) => {
                    const itemId = item?.id ?? item?._id ?? `item-${index}`; // fix: use consistent key between id and _id
                    const quantity = Number(item?.quantity || 0);
                    const unitPrice = Number(item?.price ?? 0);
                    const safeQuantity = quantity > 0 ? quantity : 1;
                    const lineTotal = round2(unitPrice * safeQuantity);

                    return (
                      <div key={itemId} className="cart-item">
                      <div className="row align-items-center">
                        <div className="col-md-2">
                          <img
                            src={item?.image || placeholderImage}
                            alt={item?.name || 'Cart item'}
                            className="img-fluid rounded"
                          />
                        </div>
                        <div className="col-md-4">
                          <h6 className="mb-0">{item?.name || 'Unnamed Product'}</h6>
                          <small className="text-muted">{item?.description || 'No description available.'}</small>
                        </div>
                        <div className="col-md-2">
                          <p className="mb-0 fw-bold">${unitPrice.toFixed(2)}</p>
                        </div>
                        <div className="col-md-3">
                          <div className="quantity-control d-flex align-items-center">
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleDecreaseQuantity(item)}
                              disabled={quantity <= 1}
                              aria-label={`Decrease quantity of ${item?.name || 'item'}`}
                            >
                              <i className="fas fa-minus"></i>
                            </button>
                            <span className="mx-3">{safeQuantity}</span>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleIncreaseQuantity(item)}
                              aria-label={`Increase quantity of ${item?.name || 'item'}`}
                            >
                              <i className="fas fa-plus"></i>
                            </button>
                          </div>
                        </div>
                        <div className="col-md-1 text-end">
                          <small className="d-block text-muted">${lineTotal.toFixed(2)}</small>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleRemoveItem(item)}
                            aria-label={`Remove ${item?.name || 'item'} from cart`}
                            title={`Remove ${item?.name || 'item'} from cart`}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      {pendingRemovalId === (item?.id ?? item?._id) && (
                        <div className="alert alert-warning mt-3" role="alert">
                          Remove {item?.name || 'this item'} from cart?
                          <div className="mt-2 d-flex gap-2">
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleRemoveItem(item)}
                            >
                              Confirm
                            </button>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => setPendingRemovalId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                      <hr />
                    </div>
                    );
                  })}

                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/products')}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-lg-4">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tax (8%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <strong>Total:</strong>
                    <strong className="text-primary">${total.toFixed(2)}</strong>
                  </div>
                  <button
                    className="btn btn-success w-100"
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                  >
                    <i className="fas fa-lock me-2"></i>
                    Proceed to Checkout
                  </button>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="card mt-3">
                <div className="card-body">
                  <h6 className="mb-3">We Accept</h6>
                  <div className="d-flex gap-2">
                    <i className="fab fa-cc-visa fa-2x text-primary"></i>
                    <i className="fab fa-cc-mastercard fa-2x text-danger"></i>
                    <i className="fab fa-cc-paypal fa-2x text-info"></i>
                    <i className="fas fa-money-bill-wave fa-2x text-success"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;





