import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from 'sonner';

const Auth = () => {
  const [phone, setPhone] = useState('+237');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Sign up fields
  const [firstName, setFirstName] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [availabilityRange, setAvailabilityRange] = useState('');

  const navigate = useNavigate();

  const validatePhoneNumber = (number: string) => {
    const pattern = /^\+2376[5-9]\d{7}$/;
    return pattern.test(number);
  };

  const handleSendOtp = async (e: React.FormEvent, type: 'login' | 'signup') => {
    e.preventDefault();
    if (!validatePhoneNumber(phone)) {
      toast.error('Invalid Cameroon phone number. Format: +2376XXXXXXXX');
      return;
    }
    setLoading(true);
    setIsSignUp(type === 'signup');

    const { error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('OTP sent to your phone!');
      setOtpSent(true);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    
    if (data.session) {
      if (isSignUp) {
        // The trigger creates the profile, here we update it with the details.
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
              first_name: firstName,
              city,
              area,
              availability_range: availabilityRange
          })
          .eq('id', data.session.user.id);
        
        if (profileError) {
            toast.error(`Error creating profile: ${profileError.message}`);
        } else {
            toast.success('Account created successfully!');
            navigate('/');
        }
      } else {
        // Existing user login
        toast.success('Logged in successfully!');
        navigate('/');
      }
    } else {
      toast.error('Could not verify OTP.');
    }

    setLoading(false);
  };
  
  const resetForm = () => {
    setPhone('+237');
    setOtp('');
    setOtpSent(false);
    setLoading(false);
  }

  const renderPhoneForm = (type: 'login' | 'signup') => (
    <form onSubmit={(e) => handleSendOtp(e, type)}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${type}-phone`}>Phone Number</Label>
          <Input 
            id={`${type}-phone`} 
            type="tel" 
            placeholder="+2376XXXXXXXX" 
            required 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </Button>
      </div>
    </form>
  );

  const renderOtpForm = () => (
    <form onSubmit={handleVerifyOtp}>
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <p className="text-sm text-muted-foreground">Enter the OTP sent to {phone}</p>
                <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>
            </div>
             {isSignUp && (
                <div className="space-y-4">
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
                </div>
            )}
            <Button type="submit" className="w-full" disabled={loading || (isSignUp && !firstName)}>
                {loading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
            <Button variant="link" className="w-full" type="button" onClick={resetForm}>
                Use a different phone number
            </Button>
        </div>
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
                <CardDescription>Enter your phone number to receive a login code.</CardDescription>
              </CardHeader>
              <CardContent>
                {!otpSent ? renderPhoneForm('login') : renderOtpForm()}
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
                {!otpSent ? renderPhoneForm('signup') : renderOtpForm()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
