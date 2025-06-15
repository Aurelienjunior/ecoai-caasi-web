
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Truck, CheckCircle, Clock } from 'lucide-react';
import DashboardKPICard from './DashboardKPICard';

const DashboardSummaryCard = () => {
  const summary = {
    totalPickups: 12,
    completed: 10,
    pending: 2,
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>My Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 sm:flex-row">
          <DashboardKPICard
            icon={<Truck className="w-5 h-5 text-muted-foreground" />}
            label="Total Pickups"
            value={summary.totalPickups}
            iconBg="bg-gray-100"
          />
          <DashboardKPICard
            icon={<CheckCircle className="w-5 h-5 text-green-500" />}
            label="Completed"
            value={summary.completed}
            iconBg="bg-green-100"
          />
          <DashboardKPICard
            icon={<Clock className="w-5 h-5 text-yellow-500" />}
            label="Pending"
            value={summary.pending}
            iconBg="bg-yellow-100"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardSummaryCard;
