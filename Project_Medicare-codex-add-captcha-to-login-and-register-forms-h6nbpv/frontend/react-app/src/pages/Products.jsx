// Products Page Component
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { productsAPI } from "../services/api";
import { useCart } from "../contexts/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Products.css";

const SORT_MAP = {
  // fix: normalize sort parameters for API
  popularity: "popularity",
  "price-low": "price_asc",
  "price-high": "price_desc",
  rating: "rating",
  name: "name_asc",
};

const CATEGORY_NAMES = [
  "Pain Relief",
  "Vitamins",
  "Skin Care",
  "Heart Health",
  "Mental Health",
  "Eye Care",
  "Respiratory",
];

const slugify = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const CATEGORIES = CATEGORY_NAMES.map((name) => ({
  name,
  slug: slugify(name),
}));

const Products = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(); // fix: allow updating URL query params
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // fix: track API errors
  const initialPage = Math.max(
    parseInt(searchParams.get("page") || "1", 10) || 1,
    1
  ); // fix: hydrate current page from URL
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 8;
  const placeholderImage = "https://via.placeholder.com/300x200?text=No+Image"; // fix: placeholder for missing images
  const descriptionClampStyle = {
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  }; // fix: clamp description lines to keep layout tidy

  // Filters
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "all",
    search: searchParams.get("search") || "",
    sortBy: searchParams.get("sortBy") || "popularity",
  });
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  ); // fix: state for debounced search bar

  const buildParams = useCallback(
    (pageValue) => {
      const safePage = Math.max(pageValue || 1, 1);
      const params = {
        limit: itemsPerPage,
        page: safePage,
        pageNumber: safePage,
        perPage: itemsPerPage,
        ...(filters.category !== "all" && { category: filters.category }),
        ...(filters.search && { search: filters.search, q: filters.search }),
        ...(filters.sortBy &&
          SORT_MAP[filters.sortBy] && { sort: SORT_MAP[filters.sortBy] }),
      };
      return params;
    },
    [filters, itemsPerPage]
  );

  const attemptFetch = useCallback(async (params) => {
    try {
      const response = await productsAPI.getAll(params);
      const productList = Array.isArray(response?.products)
        ? response.products
        : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];
      const totalCount = Number(
        response?.total ??
          response?.count ??
          response?.totalCount ??
          (Array.isArray(response?.products)
            ? response.products.length
            : productList.length) ??
          0
      );
      const success = response?.success !== false;

      return { response, productList, totalCount, success };
    } catch (err) {
      console.error("Products API error", { params, error: err }); // fix: log params for debugging
      throw err;
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = buildParams(currentPage);
      let data;
      let fallbackTried = false;

      try {
        data = await attemptFetch(params);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        fallbackTried = true;
        const fallbackParams = {
          ...params,
          offset: Math.max(currentPage - 1, 0) * itemsPerPage,
          skip: Math.max(currentPage - 1, 0) * itemsPerPage,
          pageIndex: Math.max(currentPage - 1, 0),
        };
        try {
          data = await attemptFetch(fallbackParams);
        } catch (fallbackError) {
          setError("No Products.");
          setProducts([]);
          setTotalProducts(0);
          console.error("Products fallback error", {
            params: fallbackParams,
            error: fallbackError,
          }); // fix: log fallback params
          return;
        }
      }

      if (!data || (!data.productList.length && !data.totalCount)) {
        if (!fallbackTried) {
          fallbackTried = true;
          const fallbackParams = {
            ...params,
            offset: Math.max(currentPage - 1, 0) * itemsPerPage,
            skip: Math.max(currentPage - 1, 0) * itemsPerPage,
            pageIndex: Math.max(currentPage - 1, 0),
          };
          try {
            const fallbackData = await attemptFetch(fallbackParams);
            const fallbackProducts = Array.isArray(fallbackData.productList)
              ? fallbackData.productList
              : [];
            setProducts(fallbackProducts);
            setTotalProducts(
              Math.max(
                fallbackData.totalCount || fallbackProducts.length || 0,
                0
              )
            );
            if (fallbackData.response?.success === false) {
              setError("No Products.");
            }
            return;
          } catch (fallbackError) {
            setError("No Products.");
            setProducts([]);
            setTotalProducts(0);
            console.error("Products fallback error", {
              params: fallbackParams,
              error: fallbackError,
            });
            return;
          }
        }

        if (data?.response?.success === false) {
          setError("No Products.");
        }
        const safeProducts = Array.isArray(data?.productList)
          ? data.productList
          : [];
        setProducts(safeProducts);
        setTotalProducts(
          Math.max(data?.totalCount || safeProducts.length || 0, 0)
        );
        return;
      }

      if (data?.response?.success === false) {
        setError("No Products.");
      }
      const safeProducts = Array.isArray(data?.productList)
        ? data.productList
        : [];
      setProducts(safeProducts);
      setTotalProducts(
        Math.max(data?.totalCount || safeProducts.length || 0, 0)
      );
    } catch (error) {
      console.error("Error loading products:", {
        error,
        params: buildParams(currentPage),
      }); // fix: include params in logs
      setError("No Products.");
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  }, [attemptFetch, buildParams, currentPage, itemsPerPage]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => {
        if (prev.search === searchInput) {
          return prev;
        }
        setCurrentPage(1);
        return { ...prev, search: searchInput };
      });
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput]); // fix: debounce search input

  useEffect(() => {
    setSearchParams({
      category: filters.category,
      search: filters.search,
      sortBy: filters.sortBy,
      page: String(currentPage),
    });
  }, [filters, currentPage, setSearchParams]); // fix: sync filters with URL

  const totalPages = Math.max(Math.ceil(totalProducts / itemsPerPage), 1); // fix: compute total pages safely

  useEffect(() => {
    if (!loading && currentPage > totalPages) {
      setCurrentPage(totalPages); // fix: keep current page within available range
    }
  }, [currentPage, loading, totalPages]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    alert(`${product?.name || "Product"} added to cart!`);
  };

  const handleCategoryChange = (category) => {
    setFilters((prev) => ({ ...prev, category })); // fix: use functional update for filters
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, sortBy: value })); // fix: keep sort changes in sync
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // fix: scroll to top when changing page
  };

  const categoryCounts = useMemo(() => {
    const counts = CATEGORIES.reduce((acc, category) => {
      acc[category.slug] = 0;
      return acc;
    }, {});

    products.forEach((product) => {
      const rawCategory =
        product?.category?.slug ||
        product?.category?.name ||
        product?.category ||
        product?.categoryName ||
        product?.categorySlug;

      const normalizedSlug = rawCategory ? slugify(rawCategory) : null;

      if (
        normalizedSlug &&
        Object.prototype.hasOwnProperty.call(counts, normalizedSlug)
      ) {
        counts[normalizedSlug] += 1;
      }
    });

    return counts;
  }, [products]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i key={`full-${i}`} className="fas fa-star text-warning"></i>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <i key="half" className="fas fa-star-half-alt text-warning"></i>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <i key={`empty-${i}`} className="far fa-star text-warning"></i>
      );
    }

    return stars;
  };

  return (
    <div className="products-page">
      <Navbar />

      <div className="container my-5">
        <div className="row">
          {/* Sidebar - Filters */}
          <div className="col-lg-3 mb-4">
            <div className="filters-sidebar">
              <h5 className="mb-3">Categories</h5>
              <div className="category-list">
                <div
                  className={`category-item ${
                    filters.category === "all" ? "active" : ""
                  }`}
                  onClick={() => handleCategoryChange("all")}
                >
                  All Products ({totalProducts || 0})
                </div>
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.slug}
                    className={`category-item ${
                      filters.category === cat.slug ? "active" : ""
                    }`}
                    onClick={() => handleCategoryChange(cat.slug)}
                  >
                    {cat.name} ({categoryCounts[cat.slug] ?? 0})
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              <h5 className="mb-3">Sort By</h5>
              <select
                className="form-select"
                value={filters.sortBy}
                onChange={handleSortChange}
              >
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4>{totalProducts} Products Found</h4>
              <div className="search-wrapper">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>

            {error ? (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            ) : loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : products.length > 0 ? (
              <div className="row g-4">
                {products.map((product) => (
                  <div
                    key={product._id || product.id}
                    className="col-lg-3 col-md-6"
                  >
                    <div className="product-card">
                      <div
                        className="product-image"
                        onClick={() =>
                          product?._id || product?.id
                            ? navigate(`/product/${product._id || product.id}`)
                            : null
                        }
                      >
                        <img
                          src={product?.image || placeholderImage}
                          alt={product?.name || "Product image"}
                          className="img-fluid"
                        />
                        {product?.inStock ? (
                          <div className="stock-badge in-stock">In Stock</div>
                        ) : (
                          <div className="stock-badge out-of-stock">
                            Out of Stock
                          </div>
                        )}
                      </div>
                      <div className="product-info">
                        <h6 className="product-name">
                          {product?.name || "Unnamed Product"}
                        </h6>
                        <p
                          className="product-description"
                          style={descriptionClampStyle}
                        >
                          {product?.description || "No description available."}
                        </p>
                        <div className="product-rating mb-2">
                          <div className="stars">
                            {renderStars(Number(product?.rating) || 0)}
                          </div>
                          <span className="rating-text">
                            ({product?.reviews || 0})
                          </span>
                        </div>
                        <div className="price-section mb-2">
                          <span className="current-price">
                            ${Number(product?.price ?? 0).toFixed(2)}
                          </span>
                          {product?.oldPrice && (
                            <span className="old-price">
                              ${Number(product.oldPrice).toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="product-actions">
                          <button
                            className="btn btn-success w-100"
                            onClick={() => handleAddToCart(product)}
                            disabled={!product?.inStock}
                          >
                            <i className="fas fa-shopping-cart me-1"></i>
                            {product?.inStock ? "Add to Cart" : "Out of Stock"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h4 className="text-muted">No products found</h4>
                <p className="text-muted">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}

            {!loading && !error && totalPages > 1 && (
              <nav
                className="pagination-wrapper mt-4"
                aria-label="Products pagination"
              >
                <ul className="pagination justify-content-center">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        currentPage > 1 && handlePageChange(currentPage - 1)
                      }
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>
                  </li>
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <li
                      key={page}
                      className={`page-item ${
                        page === currentPage ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        currentPage < totalPages &&
                        handlePageChange(currentPage + 1)
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;
