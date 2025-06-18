// components/auth/LogoutButton.tsx
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase'; // Make sure this points to your Firebase setup

const LogoutButton = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth); // ✅ Firebase logout
      toast({ title: 'Logged out' });
      navigate('/auth', { replace: true }); // Use replace so user can't go back
    } catch (error: any) {
      toast({
        title: 'Logout failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleLogout}
      disabled={loading}
      aria-label="Logout"
      className="ml-1"
      title="Log out"
    >
      <LogOut className="w-5 h-5" />
      <span className="sr-only">Logout</span>
    </Button>
  );
};

export default LogoutButton;
