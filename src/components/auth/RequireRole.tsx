import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';

interface RequireRoleProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RequireRole = ({ children, allowedRoles }: RequireRoleProps) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!user || !allowedRoles.includes(user.user_type)) {
    return <Navigate to="/403" />;
  }

  return <>{children}</>;
};

export default RequireRole;