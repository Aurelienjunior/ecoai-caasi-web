
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged in successfully!');
      navigate('/');
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          city,
          area,
          availability_range: availabilityRange,
        },
      },
    });

    if (error) {
      toast.error(error.message);
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast.error("A user with this email already exists.");
    } 
    else {
      toast.success('Account created! Please check your email to verify your account.');
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

  const renderLoginForm = () => (
    <form onSubmit={handleLogin}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </div>
    </form>
  );

  const renderSignUpForm = () => (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input id="signup-email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input id="signup-password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
       <div className="space-y-2">
        <Label htmlFor="signup-firstname">First Name</Label>
        <Input id="signup-firstname" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-city">City</Label>
        <Input id="signup-city" required value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-area">Area</Label>
        <Input id="signup-area" required value={area} onChange={(e) => setArea(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-availability">Availability Range (Optional)</Label>
        <Input id="signup-availability" placeholder="e.g., Weekdays 9am-5pm" value={availabilityRange} onChange={(e) => setAvailabilityRange(e.target.value)} />
      </div>
      <Button type="submit" className="w-full" disabled={loading || !firstName || !city || !area}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );

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
                {renderLoginForm()}
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
                {renderSignUpForm()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
