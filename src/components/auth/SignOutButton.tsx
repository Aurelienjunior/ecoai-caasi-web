
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import React from "react";

const SignOutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Sign out failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Signed out", description: "You’ve been logged out.", variant: "default" });
      navigate("/", { replace: true });
    }
  };

  return (
    <Button
      type="button"
      onClick={handleSignOut}
      variant="destructive"
      className="w-full flex items-center gap-2 mt-6"
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </Button>
  );
};

export default SignOutButton;
