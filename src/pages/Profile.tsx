import { useEffect, useState } from 'react';
import { auth, db } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import BottomNav from '@/components/layout/BottomNav';
import DashboardHeader from '@/components/layout/DashboardHeader';

const Profile = () => {
  const [userUid, setUserUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [firstName, setFirstName] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [availabilityRange, setAvailabilityRange] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);
        const docRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(docRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setFirstName(data.full_name || '');
          setCity(data.city || '');
          setArea(data.area || '');
          setAvailabilityRange(data.availability_range || '');
        }
      } else {
        toast({
          title: 'Not logged in',
          description: 'Please log in to view your profile.',
          variant: 'destructive',
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const sanitizeInput = (input: string) => input.trim().replace(/[<>]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userUid) return;

    setLoading(true);

    try {
      const docRef = doc(db, 'users', userUid);
      await updateDoc(docRef, {
        full_name: sanitizeInput(firstName),
        city: sanitizeInput(city),
        area: sanitizeInput(area),
        availability_range: sanitizeInput(availabilityRange),
      });

      toast({ title: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: 'Update failed',
        description: 'Something went wrong while updating your profile.',
        variant: 'destructive',
      });
    }

    setLoading(false);
  };

  if (loading) return <p className="text-center p-4">Loading profile...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <DashboardHeader />
      <main className=" flex-1 flex justify-center items-center p-4 max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  maxLength={50}
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
                <label className="block text-sm font-medium mb-1">
                  Availability Range
                </label>
                <Input
                  value={availabilityRange}
                  onChange={(e) => setAvailabilityRange(e.target.value)}
                  maxLength={100}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Updating...' : 'Update Profile'}
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
