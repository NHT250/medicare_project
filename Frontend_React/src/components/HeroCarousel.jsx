import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HeroCarousel.css";

const slides = [
  {
    label: "Fast Delivery",
    title: "Get your medicines delivered fast & safely",
    subtitle:
      "Order prescription and OTC medicines online and receive them within hours at your doorstep.",
    bullets: [
      "🚚 Same-day delivery in selected areas",
      "❄️ Safe & temperature-aware packaging",
      "💳 Multiple secure payment methods",
    ],
    primaryCta: "Shop Medicines",
    secondaryCta: "Track Delivery Areas",
    image: "/images/hero-delivery.svg",
    primaryLink: "/products",
    secondaryLink: "/products?category=delivery",
  },
  {
    label: "Online Consultation",
    title: "Chat with licensed pharmacists anytime",
    subtitle:
      "Get professional advice about dosage, side effects, and safe use before you buy.",
    bullets: [
      "👨‍⚕️ 24/7 pharmacist support",
      "💬 Secure private consultations",
      "📋 Help with prescriptions & refills",
    ],
    primaryCta: "Consult a Pharmacist",
    secondaryCta: "Learn How It Works",
    image: "/images/hero-consultation.svg",
    primaryLink: "/products",
    secondaryLink: "/products",
  },
  {
    label: "Weekly Deals",
    title: "Save more with weekly health deals",
    subtitle:
      "Discover special offers on vitamins, skin care, and everyday health essentials.",
    bullets: [
      "💊 Bundles for daily health",
      "🎁 Member-only discount codes",
      "📅 New deals every week",
    ],
    primaryCta: "View This Week’s Deals",
    secondaryCta: "Browse All Products",
    image: "/images/hero-deals.svg",
    primaryLink: "/products",
    secondaryLink: "/products",
  },
  {
    label: "Chronic Care",
    title: "Easy refills for chronic conditions",
    subtitle:
      "Manage long-term treatments like diabetes and hypertension with simple refills.",
    bullets: [
      "📆 Refill reminders for your meds",
      "🩺 Support for common chronic conditions",
      "📦 Repeat orders in one tap",
    ],
    primaryCta: "Manage My Prescriptions",
    secondaryCta: "See Chronic Care Products",
    image: "/images/hero-chronic.svg",
    primaryLink: "/products",
    secondaryLink: "/products",
  },
  {
    label: "Family & Kids",
    title: "Health essentials for your whole family",
    subtitle:
      "From kids’ vitamins to family first-aid kits, keep everyone protected at home.",
    bullets: [
      "👨‍👩‍👧 Products for adults & children",
      "🧸 Gentle & kid-friendly options",
      "🧰 Home first-aid and basic care",
    ],
    primaryCta: "Shop Family Essentials",
    secondaryCta: "Browse Kids’ Products",
    image: "/images/hero-family.svg",
    primaryLink: "/products",
    secondaryLink: "/products?category=family",
  },
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="hero-carousel">
      <div className="container-fluid position-relative">
        {slides.map((slide, index) => (
          <div
            key={slide.label}
            className={`hero-slide ${index === currentIndex ? "active" : ""}`}
          >
            <div className="row align-items-center g-4">
              <div className="col-lg-6 order-2 order-lg-1">
                <p className="slide-label">{slide.label}</p>
                <h1 className="slide-title">{slide.title}</h1>
                <p className="slide-subtitle">{slide.subtitle}</p>
                <ul className="slide-bullets list-unstyled">
                  {slide.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <div className="d-flex flex-wrap gap-3">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => navigate(slide.primaryLink)}
                  >
                    {slide.primaryCta}
                  </button>
                  <button
                    className="btn btn-outline-primary btn-lg"
                    onClick={() => navigate(slide.secondaryLink)}
                  >
                    {slide.secondaryCta}
                  </button>
                </div>
              </div>
              <div className="col-lg-6 order-1 order-lg-2">
                <div className="hero-visual">
                  <div className="badge-pill">{slide.label}</div>
                  <img
                    src={slide.image}
                    alt={slide.label}
                    className="img-fluid hero-image"
                  />
                  <div className="floating-icon pill">💊</div>
                  <div className="floating-icon chat">💬</div>
                  <div className="floating-icon bottle">🧴</div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button className="nav-arrow prev" onClick={handlePrev} aria-label="Previous slide">
          ‹
        </button>
        <button className="nav-arrow next" onClick={handleNext} aria-label="Next slide">
          ›
        </button>

        <div className="carousel-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
