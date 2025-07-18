import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SignUpFormProps {
  handleSendCode: () => void;
  handleVerifyCode: (e: React.FormEvent) => void;
  verificationStarted: boolean;
  loading: boolean;

  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  otp: string;
  setOtp: (otp: string) => void;
  email: string;
  setEmail: (email: string) => void;
  firstName: string;
  setFirstName: (name: string) => void;
  city: string;
  setCity: (city: string) => void;
  area: string;
  setArea: (area: string) => void;
  availabilityRange: string;
  setAvailabilityRange: (range: string) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  handleSendCode,
  handleVerifyCode,
  verificationStarted,
  loading,
  phoneNumber,
  setPhoneNumber,
  otp,
  setOtp,
  email,
  setEmail,
  firstName,
  setFirstName,
  city,
  setCity,
  area,
  setArea,
  availabilityRange,
  setAvailabilityRange,
}) => {
  return (
    <form onSubmit={handleVerifyCode} className="space-y-4">
      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="flex gap-2">
          <Input
            id="phone"
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

      {/* OTP Field */}
      {verificationStarted && (
        <div className="space-y-2">
          <Label htmlFor="otp">OTP</Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
      )}

      {/* Optional Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email (Optional)</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* First Name */}
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      {/* Area */}
      <div className="space-y-2">
        <Label htmlFor="area">Area</Label>
        <Input
          id="area"
          required
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
      </div>

      {/* Availability Range */}
      <div className="space-y-2">
        <Label htmlFor="availability">Availability Range (Optional)</Label>
        <Input
          id="availability"
          value={availabilityRange}
          onChange={(e) => setAvailabilityRange(e.target.value)}
        />
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={loading || !otp}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default SignUpForm;
