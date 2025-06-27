// Authentication utility functions

export const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  return !!(user && token);
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const login = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const updateUser = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
}; 