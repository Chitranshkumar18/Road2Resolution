import api from './axios';

// Standard demo template accounts for preview/quick-fill testing
const DEMO_USERS = {
  citizen: {
    id: 'usr_citizen_demo',
    _id: 'usr_citizen_demo',
    name: 'Active Citizen',
    email: 'citizen@civicvision.ai',
    role: 'citizen',
    password: 'citizen123',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 43210',
    zone: 'North Zone, Delhi NCR',
    reputationScore: 340,
    resolvedIssuesCount: 12,
    badge: 'Civic Guardian'
  },
  worker: {
    id: 'usr_worker_demo',
    _id: 'usr_worker_demo',
    name: 'Field Technician',
    email: 'worker@civicvision.ai',
    role: 'worker',
    password: 'worker123',
    contractorUnit: 'PWD Rapid Road Repair Unit #4',
    department: 'Public Works Department (PWD)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98123 45678',
    zone: 'North Zone, Delhi NCR',
    badge: 'Certified Field Tech',
    completedTasksCount: 28,
    activeTasksCount: 3
  },
  admin: {
    id: 'usr_admin_demo',
    _id: 'usr_admin_demo',
    name: 'Municipal Admin Officer',
    email: 'admin@civicvision.ai',
    role: 'admin',
    password: 'admin123',
    department: 'Smart City Urban Command Centre',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    phone: '+91 11 2345 6789',
    zone: 'Headquarters / All Zones',
    clearanceLevel: 'Super Administrator'
  }
};

const DEFAULT_ACCOUNTS = [DEMO_USERS.citizen, DEMO_USERS.worker, DEMO_USERS.admin];
const USERS_STORAGE_KEY = 'civicvision_registered_users';

function getRegisteredUsers() {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (!stored) {
    return DEFAULT_ACCOUNTS;
  }
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_ACCOUNTS;
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

function saveRegisteredUser(user) {
  const users = getRegisteredUsers();
  const index = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
  if (index !== -1) {
    users[index] = { ...users[index], ...user };
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export const authApi = {
  login: async (email, password, preferredRole) => {
    try {
      const response = await api.post('/auth/login', { email, password, role: preferredRole });
      if (response.data?.token && response.data?.user) {
        localStorage.setItem('civicvision_auth_token', response.data.token);
        localStorage.setItem('civicvision_current_user', JSON.stringify(response.data.user));
        return response.data;
      }
    } catch {
      // Backend not running or offline - proceed with device-specific local authentication
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail) {
      throw new Error('Email address is required.');
    }

    const users = getRegisteredUsers();
    const existingUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!existingUser) {
      throw new Error('No account found with this email. Please register first or use the quick demo credentials.');
    }

    // Password check if password is saved on account
    if (existingUser.password && cleanPassword && existingUser.password !== cleanPassword) {
      throw new Error('Invalid password. Please check your credentials.');
    }

    const role = preferredRole || existingUser.role || 'citizen';
    const authenticatedUser = {
      ...existingUser,
      role: role
    };

    const token = `civicvision_jwt_${role}_${Date.now()}`;
    localStorage.setItem('civicvision_auth_token', token);
    localStorage.setItem('civicvision_current_user', JSON.stringify(authenticatedUser));

    return { token, user: authenticatedUser };
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data?.token && response.data?.user) {
        localStorage.setItem('civicvision_auth_token', response.data.token);
        localStorage.setItem('civicvision_current_user', JSON.stringify(response.data.user));
        return response.data;
      }
    } catch {
      // Offline / client-side registration handler
    }

    const role = userData.role || 'citizen';
    const cleanEmail = (userData.email || '').trim().toLowerCase();
    const cleanName = (userData.name || '').trim();

    if (!cleanEmail) {
      throw new Error('Email address is required.');
    }

    const users = getRegisteredUsers();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail && !u.id?.includes('demo'));
    if (existing) {
      throw new Error('An account with this email is already registered on this device. Please sign in.');
    }

    const uid = `usr_${role}_${Date.now()}`;
    let newUser;

    if (role === 'admin') {
      newUser = {
        id: uid,
        _id: uid,
        name: cleanName || 'Municipal Officer',
        email: cleanEmail,
        password: userData.password || '',
        role: 'admin',
        department: userData.department || 'Public Works Department (PWD)',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        phone: userData.phone || '+91 11 2345 6789',
        zone: userData.zone || 'Metropolitan Command Hub',
        clearanceLevel: 'Municipal Operations Administrator'
      };
    } else if (role === 'worker') {
      newUser = {
        id: uid,
        _id: uid,
        name: cleanName || 'Field Engineer',
        email: cleanEmail,
        password: userData.password || '',
        role: 'worker',
        contractorUnit: userData.contractorUnit || 'Municipal Rapid Repair Unit',
        department: userData.department || 'Public Works Department (PWD)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        phone: userData.phone || '+91 98123 45678',
        zone: userData.zone || 'North Zone, Delhi NCR',
        badge: 'Field Operations Specialist',
        completedTasksCount: 0,
        activeTasksCount: 0
      };
    } else {
      newUser = {
        id: uid,
        _id: uid,
        name: cleanName || 'Citizen User',
        email: cleanEmail,
        password: userData.password || '',
        role: 'citizen',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        phone: userData.phone || '+91 98765 43210',
        zone: userData.zone || 'North Zone, Delhi NCR',
        reputationScore: 50,
        resolvedIssuesCount: 0,
        badge: 'Civic Guardian'
      };
    }

    saveRegisteredUser(newUser);

    const token = `civicvision_jwt_${role}_${Date.now()}`;
    localStorage.setItem('civicvision_auth_token', token);
    localStorage.setItem('civicvision_current_user', JSON.stringify(newUser));

    return { token, user: newUser };
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data?.user) return response.data.user;
      if (response.data?.id) return response.data;
    } catch {
      // Backend not running or no session
    }

    const stored = localStorage.getItem('civicvision_current_user');
    const token = localStorage.getItem('civicvision_auth_token');
    if (stored && token) {
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
        localStorage.setItem('civicvision_current_user', JSON.stringify(response.data));
        saveRegisteredUser(response.data);
        return response.data;
      }
    } catch {
      // local fallback
    }

    const stored = localStorage.getItem('civicvision_current_user');
    if (!stored) {
      throw new Error('No authenticated user session found.');
    }
    const current = JSON.parse(stored);
    const updated = { ...current, ...updates };
    localStorage.setItem('civicvision_current_user', JSON.stringify(updated));
    saveRegisteredUser(updated);
    return updated;
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
  },

  switchDemoRole: (currentUser, role) => {
    let updated;
    if (currentUser && currentUser.name && !currentUser.id?.includes('demo')) {
      updated = {
        ...currentUser,
        role: role,
        ...(role === 'admin' ? {
          department: currentUser.department || 'Smart City Urban Command Centre',
          clearanceLevel: 'Authorized City Administrator'
        } : role === 'worker' ? {
          contractorUnit: currentUser.contractorUnit || 'PWD Rapid Road Repair Unit #4',
          department: currentUser.department || 'Public Works Department (PWD)',
          badge: 'Certified Field Tech'
        } : {
          badge: 'Active Citizen'
        })
      };
    } else {
      updated = role === 'admin' ? DEMO_USERS.admin : (role === 'worker' ? DEMO_USERS.worker : DEMO_USERS.citizen);
    }
    const token = `civicvision_jwt_${role}_${Date.now()}`;
    localStorage.setItem('civicvision_auth_token', token);
    localStorage.setItem('civicvision_current_user', JSON.stringify(updated));
    return { token, user: updated };
  }
};

export default authApi;
