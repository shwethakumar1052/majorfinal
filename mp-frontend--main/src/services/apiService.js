/**
 * GovMatch AI — API Service
 * Handles authenticated API requests
 */

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Get stored auth token
function getAuthToken() {
  return localStorage.getItem("govmatch_token");
}

// Create axios instance with auth header
function createAuthRequest() {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_BASE_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

// Profile API methods
export const profileAPI = {
  // Get user profile
  async getProfile() {
    const api = createAuthRequest();
    const response = await api.get("/api/profile");
    return response.data;
  },

  // Create or update profile
  async saveProfile(profileData) {
    const api = createAuthRequest();
    try {
      // Try updating first
      const response = await api.put("/api/profile", profileData);
      return response.data;
    } catch (error) {
      // If profile doesn't exist, create it
      if (error.response?.status === 404) {
        const response = await api.post("/api/profile", profileData);
        return response.data;
      }
      throw error;
    }
  },

  // Update profile
  async updateProfile(profileData) {
    const api = createAuthRequest();
    const response = await api.put("/api/profile", profileData);
    return response.data;
  },
};

export default {
  getAuthToken,
  profileAPI,
};
