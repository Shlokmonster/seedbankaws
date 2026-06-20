import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to add JWT token from localStorage to authorization headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('seedbank_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle global errors (like token expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request, removing token and redirecting...');
      localStorage.removeItem('seedbank_token');
      // If we are on the client, we could trigger a redirect or context reset
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// AUTH ENDPOINTS
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout request failed on backend:', err);
    }
    localStorage.removeItem('seedbank_token');
  }
};

// USER CRUD ENDPOINTS
export const userService = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

// SEED CRUD ENDPOINTS
export const seedService = {
  getSeeds: async (params = {}) => {
    const response = await api.get('/seeds', { params });
    return response.data;
  },
  getSeed: async (id) => {
    const response = await api.get(`/seeds/${id}`);
    return response.data;
  },
  createSeed: async (seedData) => {
    const response = await api.post('/seeds', seedData);
    return response.data;
  },
  updateSeed: async (id, seedData) => {
    const response = await api.put(`/seeds/${id}`, seedData);
    return response.data;
  },
  deleteSeed: async (id) => {
    const response = await api.delete(`/seeds/${id}`);
    return response.data;
  }
};

// STORAGE CENTERS ENDPOINTS
export const storageCenterService = {
  getStorageCenters: async () => {
    const response = await api.get('/storage-centers');
    return response.data;
  },
  getStorageCenter: async (id) => {
    const response = await api.get(`/storage-centers/${id}`);
    return response.data;
  },
  createStorageCenter: async (centerData) => {
    const response = await api.post('/storage-centers', centerData);
    return response.data;
  },
  updateStorageCenter: async (id, centerData) => {
    const response = await api.put(`/storage-centers/${id}`, centerData);
    return response.data;
  },
  deleteStorageCenter: async (id) => {
    const response = await api.delete(`/storage-centers/${id}`);
    return response.data;
  }
};

// REPORTS ENDPOINTS
export const reportService = {
  getReports: async () => {
    const response = await api.get('/reports');
    return response.data;
  },
  generateReport: async (reportData, file = null) => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      if (reportData.report_name) formData.append('report_name', reportData.report_name);
      if (reportData.report_type) formData.append('report_type', reportData.report_type);
      
      const response = await api.post('/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } else {
      const response = await api.post('/reports', reportData);
      return response.data;
    }
  }
};

// MONITORING ENDPOINTS
export const monitoringService = {
  getMetrics: async () => {
    const response = await api.get('/monitoring');
    return response.data;
  },
  createMetric: async (metricData) => {
    const response = await api.post('/monitoring', metricData);
    return response.data;
  }
};

// DASHBOARD ENDPOINTS
export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  }
};

// ANALYTICS ENDPOINTS
export const analyticsService = {
  getSeedsByRegion: async () => {
    const response = await api.get('/analytics/seeds-by-region');
    return response.data;
  },
  getSeedsByCategory: async () => {
    const response = await api.get('/analytics/seeds-by-category');
    return response.data;
  },
  getMonthlyGrowth: async () => {
    const response = await api.get('/analytics/monthly-growth');
    return response.data;
  },
  getStorageUtilization: async () => {
    const response = await api.get('/analytics/storage-utilization');
    return response.data;
  }
};

export default api;
