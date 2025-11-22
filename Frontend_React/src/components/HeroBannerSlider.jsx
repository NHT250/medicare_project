import React, { useEffect, useState } from "react";
import "./HeroBannerSlider.css";

const slides = [
  {
    id: "slide-1",
    image: "/images/banner-medical-specialist.jpg",
    alt: "Medical specialist 24/7 banner",
  },
  {
    id: "slide-2",
    image: "/images/banner-kid-help.jpg",
    alt: "Pediatric care and ECG banner",
  },
  {
    id: "slide-3",
    image: "/images/banner-world-health-day.jpg",
    alt: "World Health Day advice banner",
  },
  {
    id: "slide-4",
    image: "/images/banner-medical-support.jpg",
    alt: "Medical support and protection banner",
  },
  {
    id: "slide-5",
    image: "/images/banner-medical-services-trust.jpg",
    alt: "Trusted medical services banner",
  },
];

const HeroBannerSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="hero-banner-section">
      <div className="container">
        <div className="hero-banner-wrapper position-relative">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`hero-banner-slide ${
                index === activeIndex ? "hero-banner-slide--active" : "hero-banner-slide--hidden"
              }`}
              style={{ backgroundImage: `url(${slide.image})` }}
              aria-hidden={index !== activeIndex}
            >
              <div className="hero-banner-overlay" aria-hidden="true"></div>
              <span className="visually-hidden">{slide.alt}</span>
            </div>
          ))}

          <button
            type="button"
            className="hero-banner-nav hero-banner-nav--prev"
            aria-label="Previous slide"
            onClick={handlePrev}
          >
            ‹
          </button>
          <button
            type="button"
            className="hero-banner-nav hero-banner-nav--next"
            aria-label="Next slide"
            onClick={handleNext}
          >
            ›
          </button>

          <div className="hero-banner-dots">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={`hero-banner-dot ${index === activeIndex ? "active" : ""}`}
                aria-label={`Go to slide ${index + 1}`}
                aria-pressed={index === activeIndex}
                onClick={() => goToSlide(index)}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBannerSlider;
