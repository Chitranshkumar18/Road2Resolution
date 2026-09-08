import api from './axios';

const DEMO_USERS = {
  citizen: {
    id: 'usr_citizen_001',
    _id: 'usr_citizen_001',
    name: 'Aarav Mehta',
    email: 'citizen@civicvision.ai',
    role: 'citizen',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 43210',
    zone: 'North Zone, Delhi NCR',
    reputationScore: 340,
    resolvedIssuesCount: 12,
    badge: 'Civic Guardian'
  },
  worker: {
    id: 'usr_worker_001',
    _id: 'usr_worker_001',
    name: 'Ramesh Verma',
    email: 'worker@civicvision.ai',
    role: 'worker',
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
    id: 'usr_admin_001',
    _id: 'usr_admin_001',
    name: 'Director S. K. Malhotra',
    email: 'admin@civicvision.ai',
    role: 'admin',
    department: 'Smart City Urban Command Centre',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    phone: '+91 11 2345 6789',
    zone: 'Headquarters / All Zones',
    clearanceLevel: 'Super Administrator'
  }
};

const USERS_STORAGE_KEY = 'civicvision_registered_users';

function getRegisteredUsers() {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (!stored) {
    const initial = [DEMO_USERS.citizen, DEMO_USERS.worker, DEMO_USERS.admin];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    const parsed = JSON.parse(stored);
    if (!parsed.some(u => u.email === 'worker@civicvision.ai')) {
      parsed.push(DEMO_USERS.worker);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return [DEMO_USERS.citizen, DEMO_USERS.worker, DEMO_USERS.admin];
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
      return response.data;
    } catch {
      const users = getRegisteredUsers();
      const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      let user;
      if (existingUser) {
        user = preferredRole ? { ...existingUser, role: preferredRole } : existingUser;
      } else {
        const role = preferredRole || (
          email.toLowerCase().includes('admin') ? 'admin' :
          email.toLowerCase().includes('worker') ? 'worker' : 'citizen'
        );
        
        if (role === 'admin') {
          const uid = `usr_admin_${Date.now()}`;
          user = {
            id: uid,
            _id: uid,
            name: email.split('@')[0].replace('.', ' ').toUpperCase(),
            email,
            role: 'admin',
            department: 'Municipal Command & Public Works',
            avatar: DEMO_USERS.admin.avatar,
            clearanceLevel: 'Authorized City Administrator'
          };
        } else if (role === 'worker') {
          const uid = `usr_worker_${Date.now()}`;
          user = {
            id: uid,
            _id: uid,
            name: email.split('@')[0].replace('.', ' ').toUpperCase(),
            email,
            role: 'worker',
            contractorUnit: 'PWD Field Repair Squad',
            department: 'Public Works Department (PWD)',
            avatar: DEMO_USERS.worker.avatar,
            zone: 'North Zone, Delhi NCR',
            badge: 'Certified Field Tech',
            completedTasksCount: 0,
            activeTasksCount: 1
          };
        } else {
          const uid = `usr_citizen_${Date.now()}`;
          user = {
            id: uid,
            _id: uid,
            name: email.split('@')[0].replace('.', ' '),
            email,
            role: 'citizen',
            avatar: DEMO_USERS.citizen.avatar,
            zone: 'North Zone, Delhi NCR',
            reputationScore: 100,
            resolvedIssuesCount: 0,
            badge: 'Active Citizen'
          };
        }
        saveRegisteredUser(user);
      }

      const token = `civicvision_jwt_${user.role}_${Date.now()}`;
      localStorage.setItem('civicvision_auth_token', token);
      localStorage.setItem('civicvision_current_user', JSON.stringify(user));

      return { token, user };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch {
      const role = userData.role || 'citizen';
      let newUser;

      if (role === 'admin') {
        const uid = `usr_admin_${Date.now()}`;
        newUser = {
          id: uid,
          _id: uid,
          name: userData.name || 'Municipal Officer',
          email: userData.email,
          role: 'admin',
          department: userData.department || 'Public Works Department (PWD)',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
          phone: userData.phone || '+91 11 2345 6789',
          zone: userData.zone || 'Metropolitan Command Hub',
          clearanceLevel: 'Municipal Operations Administrator'
        };
      } else if (role === 'worker') {
        const uid = `usr_worker_${Date.now()}`;
        newUser = {
          id: uid,
          _id: uid,
          name: userData.name || 'Field Engineer',
          email: userData.email,
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
        const uid = `usr_citizen_${Date.now()}`;
        newUser = {
          id: uid,
          _id: uid,
          name: userData.name || 'Citizen User',
          email: userData.email,
          role: 'citizen',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
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
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch {
      const stored = localStorage.getItem('civicvision_current_user');
      const token = localStorage.getItem('civicvision_auth_token');
      if (stored && token) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
      return null;
    }
  },

  updateProfile: async (updates) => {
    try {
      const response = await api.put('/auth/profile', updates);
      return response.data;
    } catch {
      const stored = localStorage.getItem('civicvision_current_user');
      const current = stored ? JSON.parse(stored) : DEMO_USERS.citizen;
      const updated = { ...current, ...updates };
      localStorage.setItem('civicvision_current_user', JSON.stringify(updated));
      saveRegisteredUser(updated);
      return updated;
    }
  },

  logout: async () => {
    localStorage.removeItem('civicvision_auth_token');
    localStorage.removeItem('civicvision_current_user');
    return { success: true };
  },

  switchDemoRole: (role) => {
    const user = role === 'admin' ? DEMO_USERS.admin : (role === 'worker' ? DEMO_USERS.worker : DEMO_USERS.citizen);
    const token = `civicvision_mock_jwt_${role}_${Date.now()}`;
    localStorage.setItem('civicvision_auth_token', token);
    localStorage.setItem('civicvision_current_user', JSON.stringify(user));
    return { token, user };
  }
};

export default authApi;
