import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export const groupService = {
  getAllGroups: async () => {
    const response = await api.get('/groups');
    return response.data;
  },
  createGroup: async (groupData) => {
    const response = await api.post('/groups', groupData);
    return response.data;
  },
  joinGroup: async (groupId) => {
    const response = await api.post(`/groups/${groupId}/join`);
    return response.data;
  },
  getMyGroups: async () => {
    const response = await api.get('/groups/my-groups');
    return response.data;
  },
  getGroupDetails: async (id) => {
    const response = await api.get(`/groups/${id}`);
    return response.data;
  },
  updateGroup: async (id, groupData) => {
    const response = await api.put(`/groups/${id}`, groupData);
    return response.data;
  },
  getGroupMembers: async (id) => {
    const response = await api.get(`/groups/${id}/members`);
    return response.data;
  },
  removeMember: async (groupId, userId) => {
    const response = await api.delete(`/groups/${groupId}/members/${userId}`);
    return response.data;
  },
};

export const sessionService = {
  createSession: async (sessionData) => {
    const response = await api.post('/sessions', sessionData);
    return response.data;
  },
  getGroupSessions: async (groupId) => {
    const response = await api.get(`/sessions/group/${groupId}`);
    return response.data;
  },
  getMySessions: async () => {
    const response = await api.get('/sessions/my-sessions');
    return response.data;
  },
};

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  getAllGroups: async () => {
    const response = await api.get('/admin/groups');
    return response.data;
  },
};

export default api;
