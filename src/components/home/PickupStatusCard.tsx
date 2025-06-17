import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

const PickupStatusCard = () => {
  const pickup = {
    status: 'Pending',
    date: 'June 16, 2025',
    time: '10:00 AM',
    price: '1000 XAF',
  };

  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg">Latest Pickup</CardTitle>
        <div
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusClasses(
            pickup.status
          )}`}
        >
          {pickup.status}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Date & Time</span>
            <div className="flex items-center gap-2 font-medium">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>
                {pickup.date} at {pickup.time}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Price</span>
            <span className="font-bold text-primary">{pickup.price}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PickupStatusCard;
