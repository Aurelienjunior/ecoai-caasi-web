import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import BottomNav from "@/components/layout/BottomNav";
import DashboardHeader from "@/components/layout/DashboardHeader";
import SignOutButton from "@/components/auth/SignOutButton";

const Profile = () => {
  const { profile, user } = useAuth();
  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [city, setCity] = useState(profile?.city || "");
  const [area, setArea] = useState(profile?.area || "");
  const [availabilityRange, setAvailabilityRange] = useState(profile?.availability_range || "");
  const [loading, setLoading] = useState(false);

  // Track previous fields for summary
  const [previousProfile, setPreviousProfile] = useState(profile);

  // Refresh form if profile changes (supports hot switching)
  if (profile && (
    firstName !== profile.first_name ||
    city !== profile.city ||
    area !== profile.area ||
    availabilityRange !== profile.availability_range
  )) {
    setFirstName(profile.first_name || "");
    setCity(profile.city || "");
    setArea(profile.area || "");
    setAvailabilityRange(profile.availability_range || "");
    setPreviousProfile(profile);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Patch: collect fields changed, for summary
    const changedFields: string[] = [];
    if (firstName !== previousProfile?.first_name) changedFields.push("First Name");
    if (city !== previousProfile?.city) changedFields.push("City");
    if (area !== previousProfile?.area) changedFields.push("Area");
    if (availabilityRange !== previousProfile?.availability_range) changedFields.push("Availability Range");

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        city,
        area,
        availability_range: availabilityRange,
      })
      .eq("id", user?.id);

    // Immediately fetch latest profile & update context
    let newProfile = null;
    if (!error && user?.id) {
      const { data } = await supabase
        .from("profiles").select("*").eq("id", user.id).single();
      newProfile = data;
      // Dispatch custom event to let AuthContext know profile should refresh
      window.dispatchEvent(new CustomEvent("profileUpdated", { detail: newProfile }));
    }

    setLoading(false);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Profile updated!",
        description: changedFields.length
          ? `Updated: ${changedFields.join(", ")}`
          : "No fields were changed.",
        variant: "default"
      });
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
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
            <div className="border-t my-6" />
            <SignOutButton />
          </CardContent>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
};

export default Profile;
