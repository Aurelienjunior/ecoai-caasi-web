import { useEffect, useState } from 'react';
import { auth, db } from '@/firebase';
import {
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import BottomNav from '@/components/layout/BottomNav';
import DashboardHeader from '@/components/layout/DashboardHeader';
import AccountInfoSection from '@/components/profile/AccountInfoSection';
import PasswordSection from '@/components/profile/PasswordSection';
import PersonalInfoSection from '@/components/profile/PersonalInfoSection';
import { reauthenticateWithPhoneOTP } from '@/components/auth/reauthenticateWithPhoneOTP';

const Profile = () => {
  const [userUid, setUserUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [availabilityRange, setAvailabilityRange] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasPassword, setHasPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload(); // Ensure freshness if needed
        const refreshedUser = auth.currentUser;

        setUserUid(refreshedUser?.uid || '');
        setPhoneNumber(refreshedUser?.phoneNumber || '');

        // Check password existence from Auth
        const hasPasswordProvider = refreshedUser?.providerData.some(
          (provider) => provider.providerId === 'password'
        );
        setHasPassword(hasPasswordProvider || false);

        // ✅ Now fetch everything from Firestore
        const docRef = doc(db, 'users', refreshedUser!.uid);
        const userDoc = await getDoc(docRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setFirstName(data.full_name || '');
          setCity(data.city || '');
          setArea(data.area || '');
          setAvailabilityRange(data.availability_range || '');
          setEmail(data.email || ''); // ✅ HERE: email from Firestore
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
        email: sanitizeInput(email),
      });

      const isPasswordValid =
        newPassword && confirmPassword && newPassword === confirmPassword;

      if (isPasswordValid) {
        if (!email) {
          toast({
            title: 'Email required',
            description: 'Please add your email before setting a password.',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }

        if (hasPassword) {
          if (!oldPassword) {
            toast({
              title: 'Old password required',
              description: 'Please enter your current password.',
              variant: 'destructive',
            });
            setLoading(false);
            return;
          }

          const credential = EmailAuthProvider.credential(email, oldPassword);
          await reauthenticateWithCredential(auth.currentUser!, credential);
        } else {
          // Phone re-authentication with OTP
          await reauthenticateWithPhoneOTP();
        }

        await updatePassword(auth.currentUser!, newPassword);
      }
      // Refresh current user and update email state
      await auth.currentUser?.reload();
      const updatedUser = auth.currentUser;

      if (updatedUser) {
        setEmail(updatedUser.email || '');
        setPhoneNumber(updatedUser.phoneNumber || '');
      }

      toast({ title: 'Profile updated successfully!' });
      setEditMode(false);
    } catch (error: any) {
      console.error('Update error:', error);

      let description = 'Something went wrong while updating your profile.';
      if (error.code === 'auth/wrong-password') {
        description = 'Old password is incorrect.';
      } else if (error.message?.includes('OTP')) {
        description = error.message;
      }

      toast({
        title: 'Update failed',
        description,
        variant: 'destructive',
      });
    }

    setLoading(false);
  };

  if (loading) return <p className="text-center p-4">Loading profile...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <DashboardHeader />
      <main className="flex-1 p-4 w-full max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">My Profile</h1>
          {!editMode ? (
            <Button variant="outline" onClick={() => setEditMode(true)}>
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setEditMode(false)}>
                Discard
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <AccountInfoSection
            email={email}
            phoneNumber={phoneNumber}
            editMode={editMode}
            setEmail={setEmail}
          />

          <PasswordSection
            editMode={editMode}
            hasPassword={hasPassword}
            oldPassword={oldPassword}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            setOldPassword={setOldPassword}
            setNewPassword={setNewPassword}
            setConfirmPassword={setConfirmPassword}
          />

          <PersonalInfoSection
            firstName={firstName}
            city={city}
            area={area}
            availabilityRange={availabilityRange}
            setFirstName={setFirstName}
            setCity={setCity}
            setArea={setArea}
            setAvailabilityRange={setAvailabilityRange}
            editMode={editMode}
          />
        </form>
      </main>
      <BottomNav />

      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Profile;
