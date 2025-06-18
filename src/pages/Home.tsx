import { useAuth } from '@/contexts/AuthContext';
import LoggedInHome from '@/components/home/LoggedInHome';
import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <LoaderCircle className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // Already redirected above if not logged in
  }

  return <LoggedInHome />;
};

export default Home;
