// API Service Layer
import axios from 'axios';
import config from '../config';

// Create axios instance
const api = axios.create({
  baseURL: config.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medicare_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear local storage and redirect to login
      localStorage.removeItem('medicare_token');
      localStorage.removeItem('medicare_user');
      localStorage.removeItem('medicare_logged_in');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== AUTH APIs ==========

export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  verifyCaptcha: async (token) => {
    const response = await api.post('/api/verify-captcha', {
      recaptcha_token: token
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('medicare_token');
    localStorage.removeItem('medicare_user');
    localStorage.removeItem('medicare_logged_in');
  }
};

// ========== PRODUCTS APIs ==========

export const productsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/products', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },
  
  searchProducts: async (query) => {
    const response = await api.get('/api/products', { 
      params: { search: query } 
    });
    return response.data;
  }
};

// ========== CATEGORIES APIs ==========

export const categoriesAPI = {
  getAll: async () => {
    const response = await api.get('/api/categories');
    return response.data;
  }
};

// ========== CART APIs ==========

export const cartAPI = {
  getCart: async () => {
    const response = await api.get('/api/cart');
    return response.data;
  },
  
  addToCart: async (productData) => {
    const response = await api.post('/api/cart', productData);
    return response.data;
  },
  
  updateCart: async (cartData) => {
    const response = await api.put('/api/cart', cartData);
    return response.data;
  },
  
  removeFromCart: async (productId) => {
    const response = await api.delete(`/api/cart/${productId}`);
    return response.data;
  }
};

// ========== ORDERS APIs ==========

export const ordersAPI = {
  getOrders: async () => {
    const response = await api.get('/api/orders');
    return response.data;
  },
  
  createOrder: async (orderData) => {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  },
  
  getOrderById: async (id) => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  }
};

export default api;





