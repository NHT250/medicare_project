// Navbar Component
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div
        className="container-fluid d-flex align-items-center justify-content-between"
        style={{ paddingLeft: "3rem", paddingRight: "3rem" }}
      >
        {/* Left: Logo */}
        <div className="navbar-left">
          <a
            className="navbar-brand fw-bold text-primary fs-3"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            Medicare
          </a>
        </div>

        {/* Center: Search Bar */}
        <div className="navbar-center flex-grow-1 d-none d-lg-flex justify-content-center">
          <form
            onSubmit={handleSearch}
            className="input-group"
            style={{ maxWidth: "500px", width: "100%" }}
          >
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-primary search-btn" type="submit">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>

        {/* Right: Buttons */}
        <div className="navbar-right d-flex align-items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <span className="text-muted d-none d-md-inline">
                Welcome, {user.email}
              </span>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/login")}
              >
                Register
              </button>
            </>
          )}

          <div
            className="cart-icon position-relative"
            onClick={() => navigate("/cart")}
            style={{ cursor: "pointer" }}
          >
            <i className="fas fa-shopping-cart fs-4 text-muted"></i>
            {cartCount > 0 && (
              <span className="cart-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
