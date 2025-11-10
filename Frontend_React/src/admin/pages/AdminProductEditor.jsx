import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import adminApi from "../api";

const emptyProduct = {
  name: "",
  slug: "",
  category: "",
  price: 0,
  discount: 0,
  stock: 0,
  is_active: true,
  images: [],
  description: "",
  specifications: [{ key: "", value: "" }],
};

const AdminProductEditor = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = mode === "edit" && id;

  const [product, setProduct] = useState(emptyProduct);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [lastSaved, setLastSaved] = useState(null);

  const finalPrice = useMemo(() => {
    const discountFactor = 1 - (Number(product.discount) || 0) / 100;
    return Math.max(Number(product.price || 0) * discountFactor, 0);
  }, [product.discount, product.price]);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await adminApi.products.get(id);
        const payload = response.product || {};
        setProduct({
          ...emptyProduct,
          ...payload,
          price: payload.price ?? 0,
          discount: payload.discount ?? 0,
          stock: payload.stock ?? 0,
          images: payload.images?.length ? payload.images : [],
          specifications:
            payload.specifications?.length > 0
              ? payload.specifications
              : [{ key: "", value: "" }],
        });
      } catch (err) {
        console.error("Failed to load product", err);
        setError(err?.response?.data?.error || "Không tìm thấy sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, isEditMode]);

  const handleFieldChange = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddImageByUrl = () => {
    const url = window.prompt("Nhập URL hình ảnh");
    if (url) {
      setProduct((prev) => ({ ...prev, images: [...(prev.images || []), url] }));
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      setProduct((prev) => ({ ...prev, images: [...prev.images, url] }));
    };
    reader.onerror = () => {
      alert("Không thể đọc file. Vui lòng thử lại.");
    };
    reader.readAsDataURL(file);
  };

  const moveImage = (index, direction) => {
    setProduct((prev) => {
      const images = [...prev.images];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= images.length) {
        return prev;
      }
      const [removed] = images.splice(index, 1);
      images.splice(newIndex, 0, removed);
      return { ...prev, images };
    });
  };

  const removeImage = (index) => {
    setProduct((prev) => {
      const images = prev.images.filter((_, idx) => idx !== index);
      return { ...prev, images };
    });
  };

  const handleSpecificationChange = (index, field, value) => {
    setProduct((prev) => {
      const specifications = [...prev.specifications];
      specifications[index] = { ...specifications[index], [field]: value };
      return { ...prev, specifications };
    });
  };

  const addSpecification = () => {
    setProduct((prev) => ({
      ...prev,
      specifications: [...(prev.specifications || []), { key: "", value: "" }],
    }));
  };

  const removeSpecification = (index) => {
    setProduct((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, idx) => idx !== index),
    }));
  };

  const validateProduct = () => {
    if (!product.name.trim()) {
      alert("Tên sản phẩm là bắt buộc");
      return false;
    }
    if (!product.category.trim()) {
      alert("Danh mục là bắt buộc");
      return false;
    }
    if (Number(product.price) < 0) {
      alert("Giá không hợp lệ");
      return false;
    }
    if (Number(product.stock) < 0) {
      alert("Tồn kho không hợp lệ");
      return false;
    }
    if (product.images.length === 0) {
      alert("Vui lòng thêm ít nhất một hình ảnh");
      return false;
    }
    return true;
  };

  const saveProduct = async ({ closeAfterSave } = {}) => {
    if (!validateProduct()) {
      return;
    }
    try {
      setSaving(true);
      const payload = {
        ...product,
        price: Number(product.price),
        discount: Number(product.discount) || 0,
        stock: Number(product.stock),
        specifications: (product.specifications || []).filter((item) => item.key),
      };
      let response;
      if (isEditMode) {
        response = await adminApi.products.update(id, payload);
      } else {
        response = await adminApi.products.create(payload);
        const createdId = response?.product?._id;
        if (createdId) {
          navigate(`/admin/products/${createdId}/edit`, { replace: true });
        }
      }
      const savedProduct = response?.product || payload;
      setProduct({
        ...savedProduct,
        specifications:
          savedProduct.specifications?.length > 0
            ? savedProduct.specifications
            : [{ key: "", value: "" }],
      });
      setLastSaved(new Date());
      if (closeAfterSave) {
        navigate("/admin/products");
      }
    } catch (err) {
      console.error("Save failed", err);
      alert(err?.response?.data?.errors?.join("\n") || err?.response?.data?.error || "Không thể lưu sản phẩm");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditMode) {
      return;
    }
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      return;
    }
    try {
      await adminApi.products.remove(id);
      navigate("/admin/products");
    } catch (err) {
      console.error("Delete failed", err);
      alert(err?.response?.data?.error || "Không thể xóa sản phẩm");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger my-4 mx-4">
        {error}
        <button className="btn btn-link" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h4 mb-1">
            {isEditMode ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm mới"}
          </h2>
          <p className="text-muted mb-0">
            Giao diện chỉnh sửa giống trang chi tiết sản phẩm giúp thao tác quen thuộc.
          </p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/admin/products")}>
          <i className="fas fa-arrow-left me-2" /> Trở lại danh sách
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Hình ảnh</h5>
              <div>
                <label className="btn btn-outline-primary btn-sm me-2 mb-0">
                  <i className="fas fa-upload me-1" /> Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={handleImageUpload}
                  />
                </label>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleAddImageByUrl}>
                  <i className="fas fa-link me-1" /> Thêm URL
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="ratio ratio-4x3 bg-light rounded border d-flex align-items-center justify-content-center">
                  {product.images?.length ? (
                    <img
                      src={product.images[0]}
                      alt="preview"
                      className="img-fluid rounded"
                      style={{ maxHeight: 260, objectFit: "contain" }}
                    />
                  ) : (
                    <span className="text-muted">Chưa có hình ảnh</span>
                  )}
                </div>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {product.images?.map((img, index) => (
                  <div key={img} className="position-relative">
                    <img
                      src={img}
                      alt={`thumbnail-${index}`}
                      className={`rounded ${index === 0 ? "border border-primary" : "border"}`}
                      style={{ width: 80, height: 80, objectFit: "cover", cursor: "pointer" }}
                      onClick={() => {
                        setProduct((prev) => {
                          if (index === 0) {
                            return prev;
                          }
                          const images = [...prev.images];
                          const [selected] = images.splice(index, 1);
                          images.unshift(selected);
                          return { ...prev, images };
                        });
                      }}
                    />
                    <div className="btn-group position-absolute top-0 end-0">
                      <button
                        type="button"
                        className="btn btn-light btn-sm"
                        onClick={() => moveImage(index, -1)}
                      >
                        <i className="fas fa-chevron-up" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-light btn-sm"
                        onClick={() => moveImage(index, 1)}
                      >
                        <i className="fas fa-chevron-down" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeImage(index)}
                      >
                        <i className="fas fa-times" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Tên sản phẩm</label>
                  <input
                    type="text"
                    className="form-control"
                    value={product.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    onBlur={() => {
                      if (!product.slug) {
                        handleFieldChange(
                          "slug",
                          product.name
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-+|-+$/g, "")
                        );
                      }
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Slug</label>
                  <input
                    type="text"
                    className="form-control"
                    value={product.slug}
                    onChange={(e) => handleFieldChange("slug", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Danh mục</label>
                  <input
                    type="text"
                    className="form-control"
                    value={product.category}
                    onChange={(e) => handleFieldChange("category", e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Giá</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={product.price}
                    onChange={(e) => handleFieldChange("price", e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Giảm giá (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="form-control"
                    value={product.discount}
                    onChange={(e) => handleFieldChange("discount", e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Tồn kho</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={product.stock}
                    onChange={(e) => handleFieldChange("stock", e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label d-block">Trạng thái</label>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={product.is_active}
                      onChange={(e) => handleFieldChange("is_active", e.target.checked)}
                    />
                    <label className="form-check-label">
                      {product.is_active ? "Đang bán" : "Tạm ẩn"}
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-light rounded border p-3 mt-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted">Giá sau giảm</span>
                    <div className="fs-4 text-success fw-semibold">${finalPrice.toFixed(2)}</div>
                  </div>
                  <span className={`badge ${product.stock > 0 ? "bg-success" : "bg-danger"}`}>
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0 mt-4">
            <div className="card-header bg-white">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "description" ? "active" : ""}`}
                    onClick={() => setActiveTab("description")}
                    type="button"
                  >
                    Mô tả
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "specifications" ? "active" : ""}`}
                    onClick={() => setActiveTab("specifications")}
                    type="button"
                  >
                    Thông số kỹ thuật
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "reviews" ? "active" : ""}`}
                    onClick={() => setActiveTab("reviews")}
                    type="button"
                  >
                    Đánh giá
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {activeTab === "description" && (
                <div>
                  <label className="form-label">Mô tả chi tiết</label>
                  <textarea
                    className="form-control"
                    rows="6"
                    value={product.description}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                  />
                </div>
              )}
              {activeTab === "specifications" && (
                <div className="d-flex flex-column gap-3">
                  {product.specifications.map((item, index) => (
                    <div key={index} className="row g-2 align-items-center">
                      <div className="col-md-5">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Thuộc tính"
                          value={item.key}
                          onChange={(e) => handleSpecificationChange(index, "key", e.target.value)}
                        />
                      </div>
                      <div className="col-md-5">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Giá trị"
                          value={item.value}
                          onChange={(e) => handleSpecificationChange(index, "value", e.target.value)}
                        />
                      </div>
                      <div className="col-md-2 text-end">
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => removeSpecification(index)}
                          disabled={product.specifications.length <= 1}
                        >
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline-primary" onClick={addSpecification}>
                    <i className="fas fa-plus me-1" /> Thêm dòng
                  </button>
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="text-muted">
                  Chế độ mock đang hiển thị {product.reviewsCount || 0} lượt đánh giá. Quản trị viên không chỉnh sửa tại đây.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mt-4 sticky-bottom" style={{ zIndex: 10 }}>
        <div className="card-body d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="text-muted">
            {saving ? "Đang lưu..." : lastSaved ? `Lần lưu gần nhất ${lastSaved.toLocaleTimeString()}` : "Chưa lưu"}
          </div>
          <div className="btn-group">
            {isEditMode && (
              <button type="button" className="btn btn-outline-danger" onClick={handleDelete} disabled={saving}>
                <i className="fas fa-trash me-1" /> Xóa
              </button>
            )}
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => saveProduct({ closeAfterSave: false })}
              disabled={saving}
            >
              <i className="fas fa-save me-1" /> Lưu
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => saveProduct({ closeAfterSave: true })}
              disabled={saving}
            >
              <i className="fas fa-check me-1" /> Lưu & Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductEditor;
