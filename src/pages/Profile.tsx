
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import BottomNav from "@/components/layout/BottomNav";
import DashboardHeader from "@/components/layout/DashboardHeader";

const Profile = () => {
  const { profile, user } = useAuth();
  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [city, setCity] = useState(profile?.city || "");
  const [area, setArea] = useState(profile?.area || "");
  const [availabilityRange, setAvailabilityRange] = useState(profile?.availability_range || "");
  const [loading, setLoading] = useState(false);

  // Input validation functions
  const validateName = (name: string) => {
    return name.length >= 2 && name.length <= 50 && /^[a-zA-Z\s]+$/.test(name);
  };

  const validateLocation = (location: string) => {
    return location.length >= 2 && location.length <= 100;
  };

  const sanitizeInput = (input: string) => {
    return input.trim().replace(/[<>]/g, '');
  };

  // Refresh form if profile changes
  // (supporting hot profile switching)
  // Normally only necessary if the context updates
  // eslint-disable-next-line
  if (profile && (firstName !== profile.first_name || city !== profile.city || area !== profile.area || availabilityRange !== profile.availability_range)) {
    setFirstName(profile.first_name || "");
    setCity(profile.city || "");
    setArea(profile.area || "");
    setAvailabilityRange(profile.availability_range || "");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enhanced validation
    if (firstName && !validateName(firstName)) {
      toast({ 
        title: "Validation Error", 
        description: "First name must be 2-50 characters and contain only letters and spaces", 
        variant: "destructive" 
      });
      return;
    }

    if (city && !validateLocation(city)) {
      toast({ 
        title: "Validation Error", 
        description: "City must be 2-100 characters", 
        variant: "destructive" 
      });
      return;
    }

    if (area && !validateLocation(area)) {
      toast({ 
        title: "Validation Error", 
        description: "Area must be 2-100 characters", 
        variant: "destructive" 
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName ? sanitizeInput(firstName) : null,
          city: city ? sanitizeInput(city) : null,
          area: area ? sanitizeInput(area) : null,
          availability_range: availabilityRange ? sanitizeInput(availabilityRange) : null,
        })
        .eq("id", user?.id);

      if (error) {
        console.error('Profile update error:', error);
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Profile updated successfully!" });
      }
    } catch (error) {
      console.error('Unexpected profile update error:', error);
      toast({ 
        title: "Update failed", 
        description: "An unexpected error occurred", 
        variant: "destructive" 
      });
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <DashboardHeader />
      <main className="flex-1 p-4 max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <Input 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)}
                  maxLength={50}
                  pattern="[a-zA-Z\s]*"
                  title="Only letters and spaces allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <Input 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Area</label>
                <Input 
                  value={area} 
                  onChange={(e) => setArea(e.target.value)}
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Availability Range</label>
                <Input 
                  value={availabilityRange} 
                  onChange={(e) => setAvailabilityRange(e.target.value)}
                  maxLength={100}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
};

export default Profile;
