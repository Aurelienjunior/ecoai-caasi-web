import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import SignUpForm from '@/components/auth/SignUpForm';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [availabilityRange, setAvailabilityRange] = useState('');

  const navigate = useNavigate();

  // -------------------------------
  // 🔐 Validation Helpers
  // -------------------------------
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) => password.length >= 8;
  const validateName = (name: string) => name.length >= 2 && name.length <= 50;
  const sanitizeInput = (input: string) => input.trim().replace(/[<>]/g, '');

  // -------------------------------
  // ✅ Shared session handler
  // -------------------------------
  const saveSessionAndRedirect = async (user: any) => {
    const idToken = await user.getIdToken();
    const userSession = {
      token: idToken,
      uid: user.uid,
      email: user.email,
    };
    Cookies.set('userSession', JSON.stringify(userSession), {
      expires: 1 / 24, // 1 hour
    });
    navigate('/home');
  };

  // -------------------------------
  // 🔓 Login
  // -------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) return toast.error('Enter a valid email');
    if (!validatePassword(password))
      return toast.error('Password must be at least 8 characters');

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        sanitizeInput(email),
        password
      );
      await saveSessionAndRedirect(userCredential.user);
      toast.success('Logged in successfully!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error?.message || 'Login failed');
    }
    setLoading(false);
  };

  // -------------------------------
  // 🆕 Sign Up
  // -------------------------------
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) return toast.error('Enter a valid email');
    if (!validatePassword(password))
      return toast.error('Password must be at least 8 characters');
    if (firstName && !validateName(firstName))
      return toast.error('First name must be 2-50 characters');
    if (city && (city.length < 2 || city.length > 100))
      return toast.error('City must be 2-100 characters');
    if (area && (area.length < 2 || area.length > 100))
      return toast.error('Area must be 2-100 characters');

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        sanitizeInput(email),
        password
      );

      const user = userCredential.user;

      // Save additional info to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: sanitizeInput(email),
        full_name: sanitizeInput(firstName),
        city: sanitizeInput(city),
        area: sanitizeInput(area),
        availability_range: sanitizeInput(availabilityRange),
      });

      await saveSessionAndRedirect(user);
      toast.success('Account created and logged in!');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error?.message || 'Signup failed');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setCity('');
    setArea('');
    setAvailabilityRange('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <div className="container mx-auto max-w-sm p-4">
        <Tabs defaultValue="login" className="w-full" onValueChange={resetForm}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Login */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Enter your email and password to log in.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm
                  handleLogin={handleLogin}
                  loading={loading}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Signup */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                  Create an account to start scheduling pickups.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SignUpForm
                  handleSignUp={handleSignUp}
                  loading={loading}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  firstName={firstName}
                  setFirstName={setFirstName}
                  city={city}
                  setCity={setCity}
                  area={area}
                  setArea={setArea}
                  availabilityRange={availabilityRange}
                  setAvailabilityRange={setAvailabilityRange}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
