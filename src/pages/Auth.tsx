import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/firebase';
import { signInWithPhoneNumber } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import Cookies from 'js-cookie';
import { toast } from 'sonner';

import { initRecaptcha } from '@/lib/firebaseRecaptcha'; // ✅ Custom utility for safe reCAPTCHA

// ✅ UI components
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

// ✅ Extend the window object for safety (optional but clean)
declare global {
  interface Window {
    recaptchaVerifier?: any;
  }
}
const Auth = () => {
  const navigate = useNavigate();

  // Shared state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [verificationStarted, setVerificationStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [availabilityRange, setAvailabilityRange] = useState('');
  const [loginConfirmationResult, setLoginConfirmationResult] =
    useState<any>(null);

  // ✅ Sanitize input to prevent XSS
  const sanitizeInput = (input: string) => input.trim().replace(/[<>]/g, '');

  const saveSessionAndRedirect = async (user: any) => {
    const idToken = await user.getIdToken();
    const userSession = {
      token: idToken,
      uid: user.uid,
      phone: user.phoneNumber,
    };

    Cookies.set('userSession', JSON.stringify(userSession), {
      expires: 1 / 24,
    });

    navigate('/home');
  };

  // ✅ Init reCAPTCHA once on mount
  useEffect(() => {
    initRecaptcha()
      .then(() => console.log('🛡️ reCAPTCHA initialized successfully'))
      .catch((err) => console.error('❌ reCAPTCHA failed to init:', err));
  }, []);

  // Step 1: Send OTP to existing user
  const handleSendLoginCode = async () => {
    setLoading(true);
    try {
      // Check user existence by phone
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('phone', '==', phoneNumber));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        toast.error('No user found with this phone number');
        setLoading(false);
        return;
      }

      const verifier = await initRecaptcha();
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        verifier
      );
      setConfirmationResult(confirmation);
      setVerificationStarted(true);
      toast.success('OTP sent successfully!');
    } catch (err: any) {
      console.error('Login OTP send error:', err);
      toast.error(err.message || 'Failed to send OTP');
    }
    setLoading(false);
  };

  const handleVerifyLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !confirmationResult) {
      toast.error('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      await saveSessionAndRedirect(user);
      toast.success('Logged in successfully!');
    } catch (err: any) {
      console.error('OTP verification error:', err);
      toast.error(err.message || 'Failed to verify OTP');
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Look up user by phone number
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('phoneNumber', '==', phoneNumber));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('No user found with this phone number');
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // 2. Check password
      if (userData.password !== password) {
        throw new Error('Invalid password');
      }

      // 3. Log in via Firebase Auth if necessary (e.g. custom token or just set app state)
      console.log('✅ Login success', userData);

      // Redirect or set user session
    } catch (err: any) {
      console.error('Login failed:', err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await saveSessionAndRedirect(user);
      toast.success('Logged in successfully!');
    } catch (err: any) {
      console.error('Email login error:', err);
      toast.error(err.message || 'Invalid email or password');
    }
    setLoading(false);
  };

  const handleSendSignUpCode = async () => {
    setLoading(true);

    try {
      const verifier = await initRecaptcha();
      const result = await signInWithPhoneNumber(auth, phoneNumber, verifier);

      setConfirmationResult(result);
      setVerificationStarted(true);
      toast.success('OTP sent successfully!');
    } catch (err: any) {
      console.error('Signup OTP error:', err);
      toast.error(err.message || 'Failed to send OTP');
    }

    setLoading(false);
  };

  const handleVerifySignUpCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !confirmationResult)
      return toast.error('Enter the 6-digit OTP');

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      await setDoc(doc(db, 'users', user.uid), {
        phone: sanitizeInput(phoneNumber),
        email: sanitizeInput(email),
        password: sanitizeInput(password),
        full_name: sanitizeInput(firstName),
        city: sanitizeInput(city),
        area: sanitizeInput(area),
        availability_range: sanitizeInput(availabilityRange),
      });

      await saveSessionAndRedirect(user);
      toast.success('Account created and logged in!');
    } catch (err: any) {
      console.error('Signup verify error:', err);
      toast.error(err.message || 'Signup verification failed');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setPhoneNumber('');
    setOtp('');
    setConfirmationResult(null);
    setVerificationStarted(false);
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
                  Enter your phone number and OTP.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                  otp={otp}
                  setOtp={setOtp}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  verificationStarted={verificationStarted}
                  loading={loading}
                  handleSendCode={handleSendLoginCode} // sends OTP after checking user exists
                  handleVerifyPhoneOtp={handleVerifyLoginOtp} // verifies OTP and logs in user
                  handleEmailLogin={handleEmailLogin} // email/password login handler
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                  Register using your phone number and OTP.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SignUpForm
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                  password={password}
                  setPassword={setPassword}
                  email={email}
                  setEmail={setEmail}
                  firstName={firstName}
                  setFirstName={setFirstName}
                  city={city}
                  setCity={setCity}
                  area={area}
                  setArea={setArea}
                  availabilityRange={availabilityRange}
                  setAvailabilityRange={setAvailabilityRange}
                  otp={otp}
                  setOtp={setOtp}
                  verificationStarted={verificationStarted}
                  handleSendCode={handleSendSignUpCode}
                  handleVerifyCode={handleVerifySignUpCode}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ✅ reCAPTCHA container */}
        <div id="recaptcha-container" className="mt-4"></div>
      </div>
    </div>
  );
};

export default Auth;
