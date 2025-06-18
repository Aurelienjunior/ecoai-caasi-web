// components/ProtectedRoute.tsx
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className=" h-screen animate-pulse flex justify-center items-center ">
        Loading...
      </div>
    );

  return user ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
