import React, { useEffect, useState } from "react";
import "./HeroBannerSlider.css";

const slides = [
  {
    id: "slide-1",
    image:
      "https://sf-static.upanhlaylink.com/img/image_2025112222841506b5c8e1aabc996c198d35e999.jpg",
    fallbackImage: "/images/hero-delivery.svg",
    alt: "Fast medical delivery banner",
  },
  {
    id: "slide-2",
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251122dd19d301a0c000ade8ccb4a43f574845.jpg",
    fallbackImage: "/images/hero-consultation.svg",
    alt: "Online medical consultation banner",
  },
  {
    id: "slide-3",
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251122bd43699a15f567fd71e2090a77df0893.jpg",
    fallbackImage: "/images/hero-deals.svg",
    alt: "Health deals and offers banner",
  },
  {
    id: "slide-4",
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251122af49eb50047f8bbafae718b99aca7a65.jpg",
    fallbackImage: "/images/hero-chronic.svg",
    alt: "Chronic care support banner",
  },
  {
    id: "slide-5",
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251122c9e1aa99c57f0aa2ac1b25e799a66533.jpg",
    fallbackImage: "/images/hero-family.svg",
    alt: "Family and kids health banner",
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
              style={{
                backgroundImage: slide.fallbackImage
                  ? `url(${slide.image}), url(${slide.fallbackImage})`
                  : `url(${slide.image})`,
              }}
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
