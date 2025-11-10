import api from "../services/api";

const dashboard = {
  summary: async () => {
    const response = await api.get("/api/admin/dashboard/summary");
    return response.data;
  },
};

const products = {
  list: async (params = {}) => {
    const response = await api.get("/api/admin/products", { params });
    return response.data;
  },
  get: async (id) => {
    const response = await api.get(`/api/admin/products/${id}`);
    return response.data;
  },
  create: async (payload) => {
    const response = await api.post("/api/admin/products", payload);
    return response.data;
  },
  update: async (id, payload) => {
    const response = await api.patch(`/api/admin/products/${id}`, payload);
    return response.data;
  },
  remove: async (id) => {
    await api.delete(`/api/admin/products/${id}`);
    return { success: true };
  },
};

const users = {
  list: async (params = {}) => {
    const response = await api.get("/api/admin/users", { params });
    return response.data;
  },
  get: async (id) => {
    const response = await api.get(`/api/admin/users/${id}`);
    return response.data;
  },
  update: async (id, payload) => {
    const response = await api.patch(`/api/admin/users/${id}`, payload);
    return response.data;
  },
  setBan: async (id, ban) => {
    const response = await api.patch(`/api/admin/users/${id}/ban`, { ban });
    return response.data;
  },
  setRole: async (id, role) => {
    const response = await api.patch(`/api/admin/users/${id}/role`, { role });
    return response.data;
  },
  resetPassword: async (id) => {
    const response = await api.post(`/api/admin/users/${id}/reset-password`);
    return response.data;
  },
};

const orders = {
  list: async (params = {}) => {
    const response = await api.get("/api/admin/orders", { params });
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.patch(`/api/admin/orders/${id}/status`, { status });
    return response.data;
  },
};

const adminApi = {
  dashboard,
  products,
  users,
  orders,
};

export default adminApi;
