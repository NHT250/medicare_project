import { useMemo, useState } from "react";
import config from "../../config";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE_MB = 5;

function validateImageLink(urlString) {
  try {
    const url = new URL(urlString);
    if (!/\.(jpe?g|png|gif|webp)$/i.test(url.pathname)) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

export default function ImagePicker({ images = [], setImages }) {
  const [activeTab, setActiveTab] = useState("upload");
  const [linkValue, setLinkValue] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const previewImage = useMemo(() => images[0] || null, [images]);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      window.alert("Định dạng ảnh không được hỗ trợ");
      event.target.value = "";
      return;
    }

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > MAX_SIZE_MB) {
      window.alert(`Kích thước ảnh tối đa ${MAX_SIZE_MB}MB`);
      event.target.value = "";
      return;
    }

    const token = localStorage.getItem(config.STORAGE_KEYS.TOKEN);
    if (!token) {
      window.alert("Vui lòng đăng nhập lại để upload ảnh");
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);
    try {
      const endpoint = new URL("/api/admin/uploads", config.API_URL);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Upload thất bại");
      }

      setImages([...(images || []), data.url]);
    } catch (error) {
      window.alert(error.message || "Không thể upload ảnh");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleAddLink = () => {
    if (!linkValue.trim()) {
      return;
    }
    if (!validateImageLink(linkValue.trim())) {
      window.alert("Link không phải ảnh hợp lệ");
      return;
    }
    setImages([...(images || []), linkValue.trim()]);
    setLinkValue("");
  };

  const removeImage = (index) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const moveImage = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) {
      return;
    }
    const updated = [...images];
    const [selected] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, selected);
    setImages(updated);
  };

  const setAsPrimary = (index) => {
    if (index === 0) {
      return;
    }
    const updated = [...images];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    setImages(updated);
  };

  return (
    <div className="image-picker">
      <div className="mb-3">
        <div className="btn-group" role="group" aria-label="Image picker mode">
          <button
            type="button"
            className={`btn btn-sm ${activeTab === "upload" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setActiveTab("upload")}
            disabled={isUploading}
          >
            <i className="fas fa-upload me-1" /> Upload file
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === "link" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setActiveTab("link")}
          >
            <i className="fas fa-link me-1" /> Thêm bằng link
          </button>
        </div>
      </div>

      {activeTab === "upload" ? (
        <div className="mb-3">
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleUpload}
            disabled={isUploading}
          />
          {isUploading && (
            <div className="form-text text-primary">Đang upload...</div>
          )}
          <div className="form-text">
            Hỗ trợ JPG, PNG, GIF, WEBP. Kích thước tối đa {MAX_SIZE_MB}MB.
          </div>
        </div>
      ) : (
        <div className="mb-3">
          <div className="input-group">
            <input
              type="url"
              className="form-control"
              placeholder="https://example.com/image.jpg"
              value={linkValue}
              onChange={(event) => setLinkValue(event.target.value)}
            />
            <button type="button" className="btn btn-outline-primary" onClick={handleAddLink}>
              Thêm
            </button>
          </div>
          <div className="form-text">Dán URL trực tiếp tới ảnh (JPG, PNG, GIF, WEBP).</div>
        </div>
      )}

      <div className="mb-3">
        <div className="ratio ratio-4x3 bg-light rounded border d-flex align-items-center justify-content-center">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Ảnh đại diện"
              className="img-fluid rounded"
              style={{ maxHeight: 260, objectFit: "contain" }}
            />
          ) : (
            <span className="text-muted">Chưa có hình ảnh</span>
          )}
        </div>
      </div>

      <div className="row g-2">
        {images.map((url, index) => (
          <div className="col-6 col-md-4" key={`${url}-${index}`}>
            <div className="border rounded position-relative p-1 h-100">
              <img
                src={url}
                alt={`Ảnh ${index + 1}`}
                className="w-100 rounded"
                style={{ height: 120, objectFit: "cover" }}
                onClick={() => setAsPrimary(index)}
              />
              <div className="d-flex justify-content-between align-items-center mt-2">
                <div>
                  {index === 0 ? (
                    <span className="badge bg-primary">Ảnh đại diện</span>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-link btn-sm p-0"
                      onClick={() => setAsPrimary(index)}
                    >
                      Đặt làm đại diện
                    </button>
                  )}
                </div>
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => moveImage(index, -1)}
                    disabled={index === 0}
                    title="Di chuyển lên"
                  >
                    <i className="fas fa-arrow-up" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => moveImage(index, 1)}
                    disabled={index === images.length - 1}
                    title="Di chuyển xuống"
                  >
                    <i className="fas fa-arrow-down" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => removeImage(index)}
                    title="Xóa ảnh"
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
