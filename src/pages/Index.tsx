
import { useAuth } from '@/contexts/AuthContext';
import LoggedInHome from '@/components/home/LoggedInHome';
import LoggedOutHome from '@/components/home/LoggedOutHome';
import { LoaderCircle } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <LoaderCircle className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return user ? <LoggedInHome /> : <LoggedOutHome />;
};

export default Index;
