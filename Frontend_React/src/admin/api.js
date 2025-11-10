import api from "../services/api";
import config from "../config";
import mockAdminAPI from "./mockData";

const useMockData = config.USE_ADMIN_MOCKS;

const withMockFallback = async (networkCall, mockCall) => {
  if (useMockData && typeof mockCall === "function") {
    return mockCall();
  }

  try {
    return await networkCall();
  } catch (error) {
    if (typeof mockCall === "function") {
      console.warn("Admin API request failed, using mock data instead.", error);
      return mockCall();
    }
    throw error;
  }
};

export const getDashboardSummary = async () =>
  withMockFallback(
    async () => {
      const response = await api.get("/api/admin/dashboard/summary");
      return response.data;
    },
    () => mockAdminAPI.getDashboardSummary?.()
  );

export const getRecentOrders = async () =>
  withMockFallback(
    async () => {
      const response = await api.get("/api/admin/dashboard/recent-orders");
      return response.data;
    },
    () => mockAdminAPI.getRecentOrders?.()
  );

export const getRecentUsers = async () =>
  withMockFallback(
    async () => {
      const response = await api.get("/api/admin/dashboard/recent-users");
      return response.data;
    },
    () => mockAdminAPI.getRecentUsers?.()
  );

export const getRevenue = async (range = "7d") =>
  withMockFallback(
    async () => {
      const response = await api.get("/api/admin/dashboard/revenue", {
        params: { range },
      });
      return response.data;
    },
    () => mockAdminAPI.getRevenueSeries?.(range)
  );

const dashboard = {
  summary: getDashboardSummary,
  recentOrders: getRecentOrders,
  recentUsers: getRecentUsers,
  revenue: getRevenue,
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

export const listOrders = async (params = {}) =>
  withMockFallback(
    async () => {
      const response = await api.get("/api/admin/orders", { params });
      return response.data;
    },
    () => mockAdminAPI.listOrders?.(params)
  );

export const getOrder = async (id) =>
  withMockFallback(
    async () => {
      const response = await api.get(`/api/admin/orders/${id}`);
      return response.data;
    },
    () => mockAdminAPI.getOrderDetail?.(id)
  );

export const updateOrderStatus = async (id, status) =>
  withMockFallback(
    async () => {
      const response = await api.patch(`/api/admin/orders/${id}/status`, { status });
      return response.data;
    },
    () => mockAdminAPI.updateOrderStatus?.(id, status)
  );

export const updateOrder = async (id, payload) =>
  withMockFallback(
    async () => {
      const response = await api.patch(`/api/admin/orders/${id}`, payload);
      return response.data;
    },
    () => mockAdminAPI.updateOrder?.(id, payload)
  );

const orders = {
  list: listOrders,
  get: getOrder,
  updateStatus: updateOrderStatus,
  update: updateOrder,
};

const adminApi = {
  dashboard,
  products,
  users,
  orders,
};

export default adminApi;
