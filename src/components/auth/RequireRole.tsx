import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';

interface RequireRoleProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RequireRole = ({ children, allowedRoles }: RequireRoleProps) => {
  const { user, loading, getUserRole } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  const userRole = getUserRole();
  if (!user || !userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/403" />;
  }

  return <>{children}</>;
};

export default RequireRole;