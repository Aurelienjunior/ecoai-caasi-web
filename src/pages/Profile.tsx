
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
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        city,
        area,
        availability_range: availabilityRange,
      })
      .eq("id", user?.id);

    setLoading(false);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!" });
    }
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
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Area</label>
                <Input value={area} onChange={(e) => setArea(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Availability Range</label>
                <Input value={availabilityRange} onChange={(e) => setAvailabilityRange(e.target.value)} />
              </div>
              <Button type="submit" loading={loading} className="w-full">
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
