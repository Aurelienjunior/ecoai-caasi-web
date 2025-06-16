
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const LogoutButton = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    
    if (error) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Logged out" });
      navigate("/auth");
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
