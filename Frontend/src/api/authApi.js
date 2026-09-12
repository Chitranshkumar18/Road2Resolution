import api from './axios';

// Purge legacy demo/mock storage keys on load so old data never resurfaces
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    localStorage.removeItem('civicvision_registered_users');
    localStorage.removeItem('civicvision_issues_db');
    localStorage.removeItem('civicvision_organizations_db');
    const currentUserStr = localStorage.getItem('civicvision_current_user');
    if (currentUserStr) {
      const user = JSON.parse(currentUserStr);
      if (user?.id?.includes('demo') || user?._id?.includes('demo') || user?.email?.includes('civicvision.ai')) {
        localStorage.removeItem('civicvision_current_user');
        localStorage.removeItem('civicvision_auth_token');
      }
    }
  } catch {
    // ignore parsing errors
  }
}

export const authApi = {
  login: async (email, password, preferredRole) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      throw new Error('Email address and password are required.');
    }

    // Admin login restriction: Only the configured admin email is permitted
    if (preferredRole === 'admin' && cleanEmail !== 'chitranshkumar730@gmail.com') {
      throw new Error('Invalid admin email address. Admin access is restricted to the authorized administrator.');
    }

    try {
      const response = await api.post('/auth/login', {
        email: cleanEmail,
        password: cleanPassword,
        role: preferredRole
      });

      if (response.data?.token && response.data?.user) {
        localStorage.setItem('civicvision_auth_token', response.data.token);
        localStorage.setItem('civicvision_current_user', JSON.stringify(response.data.user));
        return response.data;
      }
      throw new Error('Invalid authentication response from server.');
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      if (err.message && !err.message.includes('Network Error') && !err.code && !err.isAxiosError) {
        throw err;
      }
      throw new Error('Unable to connect to the server. Please try again.');
    }
  },

  register: async (userData) => {
    const role = userData.role || 'citizen';

    // Strict Enforcement: Admin registration is prohibited
    if (role === 'admin') {
      throw new Error('Admin registration is not permitted. Admin accounts are provisioned exclusively by system administrators.');
    }

    const cleanEmail = (userData.email || '').trim().toLowerCase();
    const cleanPassword = (userData.password || '').trim();
    const cleanName = (userData.name || '').trim();

    if (!cleanEmail || !cleanPassword) {
      throw new Error('Email address and password are required.');
    }

    try {
      const response = await api.post('/auth/register', {
        ...userData,
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        role: role
      });

      if (response.data?.token && response.data?.user) {
        localStorage.setItem('civicvision_auth_token', response.data.token);
        localStorage.setItem('civicvision_current_user', JSON.stringify(response.data.user));
        return response.data;
      }
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      if (err.message && !err.message.includes('Network Error') && !err.code && !err.isAxiosError) {
        throw err;
      }
      throw new Error('Unable to connect to the server. Please try again.');
    }
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('civicvision_auth_token');
    if (!token) {
      return null;
    }

    try {
      const response = await api.get('/auth/me');
      const user = response.data?.user || (response.data?.id ? response.data : null);
      if (user) {
        localStorage.setItem('civicvision_current_user', JSON.stringify(user));
        return user;
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('civicvision_auth_token');
        localStorage.removeItem('civicvision_current_user');
        return null;
      }
    }

    const stored = localStorage.getItem('civicvision_current_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        localStorage.removeItem('civicvision_current_user');
        localStorage.removeItem('civicvision_auth_token');
        return null;
      }
    }
    return null;
  },

  updateProfile: async (updates) => {
    try {
      const response = await api.put('/auth/profile', updates);
      if (response.data) {
        const updated = response.data.user || response.data;
        localStorage.setItem('civicvision_current_user', JSON.stringify(updated));
        return updated;
      }
      throw new Error('Failed to update profile.');
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Unable to connect to the server. Please try again.');
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    localStorage.removeItem('civicvision_auth_token');
    localStorage.removeItem('civicvision_current_user');
    sessionStorage.removeItem('civicvision_auth_token');
    sessionStorage.removeItem('civicvision_current_user');
    return { success: true };
  }
};

export default authApi;
