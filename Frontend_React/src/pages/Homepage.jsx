// Homepage Component
import React from "react";
import { useNavigate } from "react-router-dom";
import TopBanner from "../components/TopBanner";
import Navbar from "../components/Navbar";
import HeroBannerSlider from "../components/HeroBannerSlider";
import Footer from "../components/Footer";
import "./Homepage.css";

const categories = [
  {
    id: "cat-1",
    name: "Pain Relief",
    slug: "pain-relief",
    icon: "fas fa-pills",
    products: 25,
  },
  {
    id: "cat-2",
    name: "Vitamins",
    slug: "vitamins",
    icon: "fas fa-leaf",
    products: 25,
  },
  {
    id: "cat-3",
    name: "Skin Care",
    slug: "skin-care",
    icon: "fas fa-hand-sparkles",
    products: 25,
  },
  {
    id: "cat-4",
    name: "Heart Health",
    slug: "heart-health",
    icon: "fas fa-heartbeat",
    products: 25,
  },
  {
    id: "cat-5",
    name: "Mental Health",
    slug: "mental-health",
    icon: "fas fa-brain",
    products: 25,
  },
  {
    id: "cat-6",
    name: "Respiratory",
    slug: "respiratory",
    icon: "fas fa-lungs",
    products: 25,
  },
];

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <TopBanner />
      <Navbar />
      <HeroBannerSlider />

      {/* Categories Section */}
      <section className="categories-section py-5">
        <div className="container-fluid">
          <div className="text-center mb-5">
            <p className="section-eyebrow">Find what you need</p>
            <h2 className="fw-bold">Shop by Category</h2>
            <p className="section-subtitle">
              Explore trusted health essentials curated for your daily wellness.
            </p>
          </div>
          <div className="row g-4">
            {categories.map((category) => (
              <div key={category.id} className="col-lg-2 col-md-4 col-sm-6">
                <div
                  className="category-card h-100"
                  onClick={() => navigate(`/products?category=${category.slug}`)}
                  role="button"
                >
                  <div className="category-icon">
                    <i className={category.icon}></i>
                  </div>
                  <h6 className="category-title">{category.name}</h6>
                  <p className="category-count text-muted mb-0">
                    {category.products} products
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Medicines Section */}
      <section className="featured-section py-5">
        <div className="container-fluid">
          <div className="text-center mb-5">
            <p className="section-eyebrow">Highlighted for you</p>
            <h2 className="fw-bold">Featured Medicines</h2>
            <p className="section-subtitle">
              Discover new arrivals and best sellers tailored to your needs.
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="empty-state-card text-center p-4">
                <div className="empty-icon mb-3">💙</div>
                <h5 className="mb-2">No featured medicines yet</h5>
                <p className="text-muted mb-4">
                  We are curating top picks for you. Browse our catalog to find
                  what you need in the meantime.
                </p>
                <button
                  className="btn btn-primary px-4"
                  onClick={() => navigate("/products")}
                >
                  View All Medicines
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Homepage;
