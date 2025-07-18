import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
  handleSendCode: () => void;
  handleVerifyPhoneOtp: (e: React.FormEvent) => Promise<void>;
  handleEmailLogin: (e: React.FormEvent) => Promise<void>;
  verificationStarted: boolean;
  loading: boolean;

  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  otp: string;
  setOtp: (otp: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  handleSendCode,
  handleVerifyPhoneOtp,
  handleEmailLogin,
  verificationStarted,
  loading,

  phoneNumber,
  setPhoneNumber,
  otp,
  setOtp,
  email,
  setEmail,
  password,
  setPassword,
}) => {
  const [method, setMethod] = useState<'phone' | 'email'>('phone');

  return (
    <div className="space-y-6">
      {/* Switch login method */}
      <div className="flex gap-2 justify-center">
        <Button
          type="button"
          variant={method === 'phone' ? 'default' : 'outline'}
          onClick={() => setMethod('phone')}
        >
          Login with Phone
        </Button>
        <Button
          type="button"
          variant={method === 'email' ? 'default' : 'outline'}
          onClick={() => setMethod('email')}
          className=" cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none"
          disabled
        >
          Login with Email
        </Button>
      </div>

      {/* Phone login */}
      {method === 'phone' && (
        <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-phone">Phone Number</Label>
            <div className="flex gap-2">
              <Input
                id="login-phone"
                type="tel"
                placeholder="+237612345678"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <Button
                type="button"
                onClick={handleSendCode}
                disabled={loading || !phoneNumber}
              >
                Send OTP
              </Button>
            </div>
          </div>

          {verificationStarted && (
            <div className="space-y-2">
              <Label htmlFor="login-otp">OTP</Label>
              <Input
                id="login-otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || (verificationStarted && !otp)}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      )}

      {/* Email login */}
      {method === 'email' && (
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="your@email.com"
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
              placeholder="Your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default LoginForm;
