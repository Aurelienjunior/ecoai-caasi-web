import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface Props {
  editMode: boolean;
  hasPassword: boolean;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  setOldPassword: (val: string) => void;
  setNewPassword: (val: string) => void;
  setConfirmPassword: (val: string) => void;
}

export default function PasswordSection({
  editMode,
  hasPassword,
  oldPassword,
  newPassword,
  confirmPassword,
  setOldPassword,
  setNewPassword,
  setConfirmPassword,
}: Props) {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const renderPasswordField = (
    label: string,
    value: string,
    onChange: (val: string) => void,
    visible: boolean,
    toggle: () => void,
    disabled: boolean
  ) => (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={visible ? 'text' : 'password'}
        placeholder="••••••••"
        disabled={disabled}
        className="pr-10"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-2 top-[35px] text-muted-foreground"
        tabIndex={-1}
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {hasPassword ? 'Change Password' : 'Add Password'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasPassword &&
          renderPasswordField(
            'Old Password',
            oldPassword,
            setOldPassword,
            showOld,
            () => setShowOld((prev) => !prev),
            !editMode
          )}
        {renderPasswordField(
          hasPassword ? 'New Password' : 'Password',
          newPassword,
          setNewPassword,
          showNew,
          () => setShowNew((prev) => !prev),
          !editMode
        )}
        {renderPasswordField(
          'Confirm Password',
          confirmPassword,
          setConfirmPassword,
          showConfirm,
          () => setShowConfirm((prev) => !prev),
          !editMode
        )}
      </CardContent>
    </Card>
  );
}
