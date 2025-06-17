import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MdVisibility } from 'react-icons/md';
import { MdVisibilityOff } from 'react-icons/md';
interface LoginFormProps {
  handleLogin: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  handleLogin,
  loading,
  email,
  setEmail,
  password,
  setPassword,
}) => {
  const [ispasswordVisible, setIsPasswordVisible] = React.useState(false);
  const handlePasswordVisibility = () => {
    setIsPasswordVisible(!ispasswordVisible);
  };

  return (
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
          {/* <Input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /> */}
          <div className=" w-full flex items-center justify-between gap-2 ">
            <input
              type={ispasswordVisible ? 'text' : 'password'}
              required
              value={password}
              id="signup-password"
              onChange={(e) => setPassword(e.target.value)}
              className=" flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm "
            />
            <button
              className=" text-3xl text-green-600 "
              onClick={handlePasswordVisibility}
            >
              {ispasswordVisible ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
          </div>
        </div>
      </div>
      <Button type="submit" className="w-full my-4" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};

export default LoginForm;
