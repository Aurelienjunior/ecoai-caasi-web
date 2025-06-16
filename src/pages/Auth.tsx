
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import LoginForm from '@/components/auth/LoginForm';
import SignUpForm from '@/components/auth/SignUpForm';

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

  // Input validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateName = (name: string) => {
    return name.length >= 2 && name.length <= 50;
  };

  const sanitizeInput = (input: string) => {
    return input.trim().replace(/[<>]/g, '');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Input validation
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
      const { error } = await supabase.auth.signInWithPassword({
        email: sanitizeInput(email),
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message);
      } else {
        toast.success('Logged in successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast.error('An unexpected error occurred during login');
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enhanced input validation
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
      const { data, error } = await supabase.auth.signUp({
        email: sanitizeInput(email),
        password,
        options: {
          data: {
            first_name: sanitizeInput(firstName),
            city: sanitizeInput(city),
            area: sanitizeInput(area),
            availability_range: sanitizeInput(availabilityRange),
          },
          emailRedirectTo: `${window.location.origin}/auth?verified=true`,
        },
      });

      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message);
      } else if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast.error("A user with this email already exists.");
      } else {
        toast.success('Account created! Please check your email to verify your account.');
      }
    } catch (error) {
      console.error('Unexpected signup error:', error);
      toast.error('An unexpected error occurred during signup');
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
                <CardDescription>Enter your email and password to log in.</CardDescription>
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
                <CardDescription>Create an account to start scheduling pickups.</CardDescription>
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
