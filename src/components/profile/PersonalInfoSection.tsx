import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  firstName: string;
  city: string;
  area: string;
  availabilityRange: string;
  setFirstName: (val: string) => void;
  setCity: (val: string) => void;
  setArea: (val: string) => void;
  setAvailabilityRange: (val: string) => void;
  editMode: boolean;
}

export default function PersonalInfoSection({
  firstName,
  city,
  area,
  availabilityRange,
  setFirstName,
  setCity,
  setArea,
  setAvailabilityRange,
  editMode,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Personal Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={!editMode}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={!editMode}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Area</label>
          <Input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            disabled={!editMode}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Availability Range
          </label>
          <Input
            value={availabilityRange}
            onChange={(e) => setAvailabilityRange(e.target.value)}
            disabled={!editMode}
          />
        </div>
      </CardContent>
    </Card>
  );
}
