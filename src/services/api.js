import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get CSRF token from cookie
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Add CSRF token to all requests
api.interceptors.request.use(
  (config) => {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username, password) => 
    api.post('/auth/login/', { username, password }),
  logout: () => 
    api.post('/auth/logout/'),
  getCurrentUser: () => 
    api.get('/auth/me/'),
};

export const studentAPI = {
  getAll: () => 
    api.get('/students/students/'),
  getOne: (id) => 
    api.get(`/students/students/${id}/`),
  create: (data) => 
    api.post('/students/students/', data),
  update: (id, data) => 
    api.put(`/students/students/${id}/`, data),
  uploadCSV: (file, semester) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('semester', semester);
    return api.post('/students/students/upload_csv/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getGPA: (id) => 
    api.get(`/students/students/${id}/gpa/`),
};

export const factorsAPI = {
  getAll: () => 
    api.get('/students/factors/'),
  create: (data) => 
    api.post('/students/factors/', data),
  update: (id, data) => 
    api.put(`/students/factors/${id}/`, data),
};

export const predictionAPI = {
  getAll: (params) => 
    api.get('/predictions/predictions/', { params }),
  generate: (studentId, semester) => 
    api.post('/predictions/predictions/generate/', { student_id: studentId, semester }),
  getStatistics: () => 
    api.get('/predictions/predictions/statistics/'),
  getAtRisk: () => 
    api.get('/predictions/predictions/at_risk/'),
  generateReport: (id) => 
    api.post(`/predictions/predictions/${id}/report/`),
};

export const dashboardAPI = {
  getStats: () => 
    api.get('/dashboard/'),
};

export default api;