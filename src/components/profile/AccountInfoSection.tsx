import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  email: string;
  phoneNumber: string;
  editMode: boolean;
  setEmail: (val: string) => void;
}

export default function AccountInfoSection({ email, phoneNumber, editMode, setEmail }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Account Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <Input value={phoneNumber} readOnly disabled className="bg-muted" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} readOnly={!editMode} />
        </div>
      </CardContent>
    </Card>
  );
}
