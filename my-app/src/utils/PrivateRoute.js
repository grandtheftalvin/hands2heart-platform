import { Navigate, Outlet } from 'react-router-dom';

// A protected route wrapper that only allows users with specified roles
const PrivateRoute = ({ allowedRoles }) => {
  // Get JWT token from local storage
  const token = localStorage.getItem('token');

  // Decode token to extract user role
  const role = JSON.parse(atob(token?.split('.')[1] || 'e30='))?.role;

  // Only render the route if role is allowed, otherwise redirect to login
  return token && allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;