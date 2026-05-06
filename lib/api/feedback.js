import axios from 'axios';

const API_BASE = '/feedback-api';

// Configure axios for cookies
axios.defaults.withCredentials = true;

export const feedbackApi = {
  getFeedbacks: async (params) => {
    const { data } = await axios.get(`${API_BASE}/feedback`, { params });
    return data;
  },
  getStats: async () => {
    const { data } = await axios.get(`${API_BASE}/feedback/stats`);
    return data;
  },
  getSummary: async () => {
    const { data } = await axios.get(`${API_BASE}/feedback/summary`);
    return data;
  },
  updateFeedback: async (id, payload) => {
    const { data } = await axios.patch(`${API_BASE}/feedback/${id}`, payload);
    return data;
  },
  deleteFeedback: async (id) => {
    const { data } = await axios.delete(`${API_BASE}/feedback/${id}`);
    return data;
  },
  reAnalyze: async (id) => {
    const { data } = await axios.post(`${API_BASE}/feedback/${id}/re-analyze`);
    return data;
  }
};
