import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import LoginForm from '@/components/auth/LoginForm';
import SignUpForm from '@/components/auth/SignUpForm';
import Cookies from 'js-cookie';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Sign up fields
  const [firstName, setFirstName] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [availabilityRange, setAvailabilityRange] = useState('');

  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => password.length >= 8;

  const validateName = (name: string) => name.length >= 2 && name.length <= 50;

  const sanitizeInput = (input: string) => input.trim().replace(/[<>]/g, '');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        sanitizeInput(email),
        password
      );
      const user = userCredential.user;

      const idToken = await user.getIdToken();
      console.log('User ID Token:', idToken);

      // ✅ Combine all user data into one object
      const userSession = {
        token: idToken,
        uid: user.uid,
        email: user.email,
        // name: user.displayName || '',
      };

      // ✅ Save to a single cookie (expires in 1 hour)
      Cookies.set('userSession', JSON.stringify(userSession), {
        expires: 1 / 24,
      });

      toast.success('Logged in successfully!');
      navigate('/home');
    } catch (error: unknown) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to login');
      }
    }

    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (firstName && !validateName(firstName)) {
      toast.error('First name must be between 2 and 50 characters');
      return;
    }

    if (city && (city.length < 2 || city.length > 100)) {
      toast.error('City must be between 2 and 100 characters');
      return;
    }

    if (area && (area.length < 2 || area.length > 100)) {
      toast.error('Area must be between 2 and 100 characters');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        sanitizeInput(email),
        password
      );

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: sanitizeInput(email),
        full_name: sanitizeInput(firstName),
        city: sanitizeInput(city),
        area: sanitizeInput(area),
        availability_range: sanitizeInput(availabilityRange),
      });
      console.log('User created successfully', {
        email: sanitizeInput(email),
        full_name: sanitizeInput(firstName),
        city: sanitizeInput(city),
        area: sanitizeInput(area),
        availability_range: sanitizeInput(availabilityRange),
      });

      toast.success(
        'Account created! Please check your email to verify your account.'
      );
    } catch (error: unknown) {
      console.error('Signup error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Signup failed');
      }
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
