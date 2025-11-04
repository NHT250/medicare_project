// Homepage Component
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productsAPI, categoriesAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Homepage.css";

const FALLBACK_CATEGORIES = [
  {
    _id: "fallback-pain-relief",
    name: "Pain Relief",
    description: "Medications for pain management",
    icon: "fas fa-pills",
    slug: "pain-relief",
    isFallback: true,
  },
  {
    _id: "fallback-vitamins",
    name: "Vitamins",
    description: "Vitamin and mineral supplements",
    icon: "fas fa-leaf",
    slug: "vitamins",
    isFallback: true,
  },
  {
    _id: "fallback-skin-care",
    name: "Skin Care",
    description: "Products for skin health",
    icon: "fas fa-hand-sparkles",
    slug: "skin-care",
    isFallback: true,
  },
  {
    _id: "fallback-heart-health",
    name: "Heart Health",
    description: "Medications for cardiovascular health",
    icon: "fas fa-heartbeat",
    slug: "heart-health",
    isFallback: true,
  },
  {
    _id: "fallback-mental-health",
    name: "Mental Health",
    description: "Medications for mental wellbeing",
    icon: "fas fa-brain",
    slug: "mental-health",
    isFallback: true,
  },
  {
    _id: "fallback-respiratory",
    name: "Respiratory",
    description: "Medications for breathing and lung health",
    icon: "fas fa-lungs",
    slug: "respiratory",
    isFallback: true,
  },
];

const FALLBACK_FEATURED_PRODUCTS = [
  {
    _id: "fallback-paracetamol",
    id: "fallback-paracetamol",
    name: "Paracetamol 500mg",
    description: "Pain relief tablets for headaches and fever",
    price: 7.0,
    oldPrice: 8.0,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae",
    rating: 4.8,
    reviews: 124,
    inStock: false,
    isFallback: true,
  },
  {
    _id: "fallback-vitamin-c",
    id: "fallback-vitamin-c",
    name: "Vitamin C 1000mg",
    description: "Immune support supplement",
    price: 24.99,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae",
    rating: 4.5,
    reviews: 89,
    inStock: false,
    isFallback: true,
  },
  {
    _id: "fallback-omega3",
    id: "fallback-omega3",
    name: "Omega-3 Fish Oil",
    description: "Heart health capsules with essential fatty acids",
    price: 32.99,
    oldPrice: 39.99,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88",
    rating: 4.9,
    reviews: 156,
    inStock: false,
    isFallback: true,
  },
  {
    _id: "fallback-multivitamin",
    id: "fallback-multivitamin",
    name: "Daily Multivitamin",
    description: "Complete daily nutrition supplement",
    price: 19.99,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1550572017-edd951aa0b0a",
    rating: 4.7,
    reviews: 203,
    inStock: false,
    isFallback: true,
  },
];

const Homepage = () => {
  const navigate = useNavigate();
  useAuth();
  const { addToCart } = useCart();

  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setUsingFallbackCategories] = useState(false);
  const [usingFallbackProducts, setUsingFallbackProducts] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load categories
      const [categoriesData, productsData] = await Promise.all([
        categoriesAPI.getAll(),
        productsAPI.getAll({ limit: 4 }),
      ]);

      const fetchedCategories = categoriesData?.categories || [];
      if (fetchedCategories.length > 0) {
        setCategories(fetchedCategories);
        setUsingFallbackCategories(false);
      } else {
        setCategories(FALLBACK_CATEGORIES);
        setUsingFallbackCategories(true);
      }

      const fetchedProducts = productsData?.products || [];
      if (fetchedProducts.length > 0) {
        setFeaturedProducts(
          fetchedProducts.map((product) => ({
            ...product,
            id: product.id || product._id,
          }))
        );
        setUsingFallbackProducts(false);
      } else {
        setFeaturedProducts(FALLBACK_FEATURED_PRODUCTS);
        setUsingFallbackProducts(true);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setCategories(FALLBACK_CATEGORIES);
      setFeaturedProducts(FALLBACK_FEATURED_PRODUCTS);
      setUsingFallbackCategories(true);
      setUsingFallbackProducts(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (usingFallbackProducts || product.isFallback) {
      showNotification(
        "Live inventory is unavailable right now. Please check back soon!"
      );
      return;
    }

    const cartProduct = product.id
      ? product
      : { ...product, id: product._id };
    addToCart(cartProduct, 1);
    showNotification(`${product.name} added to cart!`, "success");
  };

  const showNotification = (message) => {
    // Simple notification using alert for now
    // Can be replaced with a proper notification component
    alert(message);
  };

  return (
    <div className="homepage">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="hero-title">
                Your Trusted Online{" "}
                <span className="text-primary">Pharmacy</span>
              </h1>
              <p className="hero-subtitle">
                Search, consult, and order medicines from home. Fast delivery,
                expert advice, and genuine products guaranteed.
              </p>
              <button
                className="btn btn-success btn-lg"
                onClick={() => navigate("/products")}
              >
                <i className="fas fa-shopping-bag me-2"></i>
                Shop Now
              </button>
            </div>
            <div className="col-lg-6">
              <div className="pharmacy-image">
                <img
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Modern Pharmacy Interior"
                  className="img-fluid rounded-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container-fluid">
          <h2 className="text-center mb-5 fw-bold">Shop by Category</h2>
          <div className="row g-4">
            {loading ? (
              <div className="col-12 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : categories.length > 0 ? (
              categories.slice(0, 6).map((category) => (
                <div key={category._id} className="col-lg-2 col-md-4 col-sm-6">
                  <div
                    className="category-card"
                    onClick={() =>
                      navigate(`/products?category=${category.slug}`)
                    }
                  >
                    <div className="category-icon">
                      <i className={category.icon}></i>
                    </div>
                    <h6 className="category-title">{category.name}</h6>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p className="text-muted">No categories available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-medicines">
        <div className="container-fluid">
          <h2 className="text-center mb-5 fw-bold">Featured Medicines</h2>
          <div className="row g-4">
            {loading ? (
              <div className="col-12 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div key={product._id} className="col-lg-3 col-md-6">
                  <div className="product-card">
                    <div className="product-image">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="img-fluid"
                        onClick={() =>
                          !usingFallbackProducts && product._id
                            ? navigate(`/product/${product._id}`)
                            : null
                        }
                        role="button"
                        style={{ cursor: usingFallbackProducts ? "default" : "pointer" }}
                      />
                      {product.oldPrice && (
                        <div className="discount-badge">
                          -
                          {Math.round(
                            ((product.oldPrice - product.price) /
                              product.oldPrice) *
                              100
                          )}
                          %
                        </div>
                      )}
                    </div>
                    <div className="product-info">
                      <h6 className="product-name">{product.name}</h6>
                      <p className="product-desc">{product.description}</p>
                      <div className="price-section">
                        <span className="current-price">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.oldPrice && (
                          <span className="old-price">
                            ${product.oldPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="rating mb-2">
                        <i className="fas fa-star text-warning"></i>
                        <span className="rating-text">{product.rating}</span>
                        <span className="review-count">
                          ({product.reviews})
                        </span>
                      </div>
                      <button
                        className="btn btn-success w-100"
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock || usingFallbackProducts || product.isFallback}
                      >
                        {product.inStock && !usingFallbackProducts && !product.isFallback
                          ? "Add to Cart"
                          : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p className="text-muted">No products available</p>
              </div>
            )}
          </div>

          <div className="text-center mt-5">
            <button
              className="btn btn-primary btn-lg px-5"
              onClick={() => navigate("/products")}
            >
              View All Medicines
            </button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Floating Chat Button */}
      <div className="floating-chat">
        <button className="btn btn-success rounded-circle chat-btn">
          <i className="fas fa-comments"></i>
          <span className="chat-text">Ask our AI</span>
        </button>
      </div>
    </div>
  );
};

export default Homepage;
