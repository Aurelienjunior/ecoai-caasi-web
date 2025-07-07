import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { ArrowLeft, MapPin } from 'lucide-react';

const SchedulePickupPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    date: '',
    time: '',
    notes: '',
    wasteType: '',
    estimatedVolume: '',
  });
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user?.uid) return;
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setForm((prev) => ({
          ...prev,
          name: userData?.first_name || '',
          phone: userData?.phone || '',
          address: userData?.area || '',
        }));
      }
    };
    fetchUserInfo();
  }, [user]);

  const handleVolumeChange = (value: string) => {
    setForm((prev) => ({ ...prev, estimatedVolume: value }));
    if (value.includes('Small')) setEstimatedPrice(250);
    else if (value.includes('Medium')) setEstimatedPrice(500);
    else if (value.includes('Large')) setEstimatedPrice(1000);
    else setEstimatedPrice(0);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { name, phone, address, date, time, wasteType, estimatedVolume } =
      form;
    if (
      !name ||
      !phone ||
      !address ||
      !date ||
      !time ||
      !wasteType ||
      !estimatedVolume
    )
      return;

    try {
      setLoading(true);
      navigate('/payment', {
        state: {
          scheduleDetails: {
            ...form,
            estimatedPrice,
          },
          pickupType: 'scheduled',
        },
      });
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="fixed top-0 left-0 bg-white/95 w-full flex items-center gap-3 mb-2 p-4 border-b">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          size="icon"
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Book Later</h1>
      </div>

      <div className="mt-24 px-4 pb-6 max-w-7xl mx-auto w-full">
        {/* Assistant Box */}
        <div className="bg-[#48B23C] border text-white border-green-300 rounded-xl p-4 mb-4 flex items-start gap-3">
          <div>
            <h2 className="text-sm font-bold">Your Pickup Assistant</h2>
            <p className="text-xs">
              Provide all information for your trash pickup
            </p>
          </div>
          <img src="/images/bot.png" alt="bot" className="w-12 h-12" />
        </div>

        {/* Form Card */}
        <Card className="p-4 space-y-4 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <Input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            {/* Phone */}
            <Input
              name="phone"
              type="tel"
              placeholder="Phone Number (e.g. +237 6XX XXX XXX)"
              value={form.phone}
              onChange={handleChange}
              required
            />

            {/* Date & Time */}
            <div className="flex gap-4">
              <Input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
              <Input
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
                required
              />
            </div>

            {/* Waste Type */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Waste Type
              </label>
              <Select
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, wasteType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select waste type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General waste">General Waste</SelectItem>
                  <SelectItem value="Plastic waste">Plastic Waste</SelectItem>
                  <SelectItem value="Organic waste">Organic Waste</SelectItem>
                  <SelectItem value="Bulky items">Bulky Items</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estimated Volume */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Estimated Volume
              </label>
              <Select onValueChange={handleVolumeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select volume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Small (up to 10L)">
                    Small (up to 10L)
                  </SelectItem>
                  <SelectItem value="Medium (up to 20L)">
                    Medium (up to 20L)
                  </SelectItem>
                  <SelectItem value="Large (up to 30L)">
                    Large (up to 30L)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <Textarea
              name="notes"
              placeholder="Any specific instructions for the EcoAgent"
              value={form.notes}
              onChange={handleChange}
            />

            {/* Address Section */}
            <div>
              <label className="block mb-1 text-sm font-medium">Address</label>
              {!isEditingAddress ? (
                <div className="flex justify-between items-center bg-gray-50 border p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 text-green-600" />
                    {form.address || 'No address found'}
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setIsEditingAddress(true)}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <Input
                  name="address"
                  placeholder="Enter new address"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              )}
            </div>

            {/* Price Estimate */}
            <div className="flex justify-between items-center bg-gray-50 border p-3 rounded-lg">
              <div className="text-sm">
                <p className="font-medium text-gray-700">Price Estimate</p>
                <p className="text-xs text-muted-foreground">
                  Final price may vary based on actual waste volume
                </p>
              </div>
              <span className="font-bold text-green-600 text-base">
                {estimatedPrice.toLocaleString()} XAF
              </span>
            </div>

            {/* Submit */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Scheduling...' : 'Confirm Schedule'}
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default SchedulePickupPage;
