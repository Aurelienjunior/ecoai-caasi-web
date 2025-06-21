import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MdVisibility } from 'react-icons/md';
import { MdVisibilityOff } from 'react-icons/md';

interface SignUpFormProps {
  handleSignUp: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
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
  handleSignUp,
  loading,
  email,
  setEmail,
  password,
  setPassword,
  firstName,
  setFirstName,
  city,
  setCity,
  area,
  setArea,
  availabilityRange,
  setAvailabilityRange,
}) => {
  const [ispasswordVisible, setIsPasswordVisible] = React.useState(false);
  const handlePasswordVisibility = () => {
    setIsPasswordVisible(!ispasswordVisible);
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="m@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2 ">
        <Label htmlFor="signup-password">Password</Label>
        <div className=" w-full flex items-center justify-between gap-2 ">
          {/* <Input
            id="signup-password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /> */}
          <input
            type={ispasswordVisible ? 'text' : 'password'}
            required
            minLength={6}
            value={password}
            id="signup-password"
            onChange={(e) => setPassword(e.target.value)}
            className=" flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm "
          />
          <span
            className=" text-3xl text-green-600 cursor-pointer "
            title={ispasswordVisible ? 'Hide Password' : 'Show Password'}
            onClick={handlePasswordVisibility}
          >
            {ispasswordVisible ? <MdVisibility /> : <MdVisibilityOff />}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-firstname">First Name</Label>
        <Input
          id="signup-firstname"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-city">City</Label>
        <Input
          id="signup-city"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-area">Area</Label>
        <Input
          id="signup-area"
          required
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-availability">
          Availability Range (Optional)
        </Label>
        <Input
          id="signup-availability"
          placeholder="e.g., Weekdays 9am-5pm"
          value={availabilityRange}
          onChange={(e) => setAvailabilityRange(e.target.value)}
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={loading || !firstName || !city || !area}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default SignUpForm;
