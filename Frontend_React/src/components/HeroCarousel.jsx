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
    bgImage: "/images/banner-medical-specialist.jpg",
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
    bgImage: "/images/banner-kid-help.jpg",
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
    bgImage: "/images/banner-world-health-day.jpg",
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
    bgImage: "/images/banner-medical-support.jpg",
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
    bgImage: "/images/banner-medical-services-trust.jpg",
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
      <div className="hero-carousel-wrapper">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.label}
              className={`hero-slide ${isActive ? "hero-slide--active" : "hero-slide--hidden"}`}
              style={{ backgroundImage: `url(${slide.bgImage})` }}
            >
              <div className="hero-slide-overlay">
                <div className="hero-slide-content">
                  <p className="hero-slide-label">{slide.label}</p>
                  <h1 className="hero-slide-title">{slide.title}</h1>
                  <p className="hero-slide-subtitle">{slide.subtitle}</p>
                  <ul className="hero-slide-bullets list-unstyled mb-4">
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
                      className="btn btn-outline-light btn-lg"
                      onClick={() => navigate(slide.secondaryLink)}
                    >
                      {slide.secondaryCta}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <button className="hero-nav hero-nav--prev" onClick={handlePrev} aria-label="Previous slide">
          ‹
        </button>
        <button className="hero-nav hero-nav--next" onClick={handleNext} aria-label="Next slide">
          ›
        </button>

        <div className="hero-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentIndex ? "active" : ""}`}
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
