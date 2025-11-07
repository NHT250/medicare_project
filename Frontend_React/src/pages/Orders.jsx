// Orders Page Component - Order History
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      alert('Please login to view orders');
      navigate('/login');
      return;
    }
    
    loadOrders();
  }, [isAuthenticated, navigate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.getOrders();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-warning',
      processing: 'bg-info',
      shipped: 'bg-primary',
      delivered: 'bg-success',
      cancelled: 'bg-danger'
    };

    return (
      <span className={`badge ${statusClasses[status] || 'bg-secondary'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="orders-page">
        <Navbar />
        <div className="container my-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your orders...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="orders-page">
      <Navbar />

      <div className="container my-5">
        <div className="page-header mb-4">
          <h2>
            <i className="fas fa-shopping-bag me-2"></i>
            My Orders
          </h2>
          <p className="text-muted">View and track your order history</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders text-center py-5">
            <i className="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
            <h4 className="text-muted">No orders yet</h4>
            <p className="text-muted">Start shopping to create your first order</p>
            <button className="btn btn-primary mt-3" onClick={() => navigate('/products')}>
              Browse Products
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card card mb-3">
                {/* Order Header */}
                <div className="card-header">
                  <div className="row align-items-center">
                    <div className="col-md-3">
                      <div className="order-info">
                        <small className="text-muted d-block">Order ID</small>
                        <strong>{order.orderId}</strong>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="order-info">
                        <small className="text-muted d-block">Date</small>
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="order-info">
                        <small className="text-muted d-block">Status</small>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="order-info">
                        <small className="text-muted d-block">Total</small>
                        <strong className="text-success">${order.total.toFixed(2)}</strong>
                      </div>
                    </div>
                    <div className="col-md-2 text-end">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => toggleOrderDetails(order._id)}
                      >
                        {expandedOrder === order._id ? (
                          <>
                            <i className="fas fa-chevron-up me-1"></i> Hide
                          </>
                        ) : (
                          <>
                            <i className="fas fa-chevron-down me-1"></i> Details
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Details (Expandable) */}
                {expandedOrder === order._id && (
                  <div className="card-body">
                    {/* Order Items */}
                    <h6 className="mb-3">Order Items:</h6>
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, index) => (
                            <tr key={index}>
                              <td>{item.name}</td>
                              <td>${item.price.toFixed(2)}</td>
                              <td>{item.quantity}</td>
                              <td>${item.subtotal.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="row mt-4">
                      {/* Shipping Information */}
                      <div className="col-md-6">
                        <h6 className="mb-3">
                          <i className="fas fa-shipping-fast me-2"></i>
                          Shipping Information
                        </h6>
                        <div className="shipping-info">
                          <p className="mb-1"><strong>{order.shipping.fullName}</strong></p>
                          <p className="mb-1">{order.shipping.email}</p>
                          <p className="mb-1">{order.shipping.phone}</p>
                          <p className="mb-1">{order.shipping.address}</p>
                          <p className="mb-0">
                            {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}
                          </p>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="col-md-6">
                        <h6 className="mb-3">
                          <i className="fas fa-receipt me-2"></i>
                          Order Summary
                        </h6>
                        <div className="order-summary">
                          <div className="d-flex justify-content-between mb-2">
                            <span>Subtotal:</span>
                            <span>${order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Shipping:</span>
                            <span>${order.shippingFee.toFixed(2)}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Tax:</span>
                            <span>${order.tax.toFixed(2)}</span>
                          </div>
                          <hr />
                          <div className="d-flex justify-content-between">
                            <strong>Total:</strong>
                            <strong className="text-success">${order.total.toFixed(2)}</strong>
                          </div>
                        </div>

                        {/* Payment Info */}
                        <div className="payment-info mt-3">
                          <small className="text-muted">
                            <i className="fas fa-credit-card me-1"></i>
                            Payment Method: {order.payment.method === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}
                          </small>
                        </div>
                      </div>
                    </div>

                    {/* Order Tracking */}
                    <div className="order-tracking mt-4">
                      <h6 className="mb-3">
                        <i className="fas fa-truck me-2"></i>
                        Order Tracking
                      </h6>
                      <div className="tracking-timeline">
                        <div className={`tracking-step ${['pending', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
                          <div className="tracking-icon">
                            <i className="fas fa-check"></i>
                          </div>
                          <div className="tracking-label">Order Placed</div>
                        </div>
                        <div className={`tracking-step ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
                          <div className="tracking-icon">
                            <i className="fas fa-cog"></i>
                          </div>
                          <div className="tracking-label">Processing</div>
                        </div>
                        <div className={`tracking-step ${['shipped', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
                          <div className="tracking-icon">
                            <i className="fas fa-truck"></i>
                          </div>
                          <div className="tracking-label">Shipped</div>
                        </div>
                        <div className={`tracking-step ${order.status === 'delivered' ? 'completed' : ''}`}>
                          <div className="tracking-icon">
                            <i className="fas fa-home"></i>
                          </div>
                          <div className="tracking-label">Delivered</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="order-actions mt-4">
                      <button className="btn btn-outline-primary me-2">
                        <i className="fas fa-redo me-1"></i>
                        Order Again
                      </button>
                      <button className="btn btn-outline-secondary">
                        <i className="fas fa-download me-1"></i>
                        Download Invoice
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Orders;

