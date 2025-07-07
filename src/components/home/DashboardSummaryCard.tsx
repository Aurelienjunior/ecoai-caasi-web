import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/firebase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Truck, CheckCircle, Clock, Zap, Calendar } from 'lucide-react';
import DashboardKPICard from './DashboardKPICard';

interface DashboardSummaryCardProps {
  userId: string;
}

const fetchPickupSummary = async (userId: string) => {
  const pickupsRef = collection(db, 'pickups');
  const scheduledRef = collection(db, 'scheduledPickups');

  const [instantSnap, laterSnap] = await Promise.all([
    getDocs(query(pickupsRef, where('userId', '==', userId))),
    getDocs(query(scheduledRef, where('userId', '==', userId))),
  ]);

  let instant = { total: 0, completed: 0, pending: 0 };
  let scheduled = { total: 0, completed: 0, pending: 0 };

  instantSnap.forEach(doc => {
    const data = doc.data();
    instant.total++;
    if (data.status === 'completed') instant.completed++;
    else if (data.status === 'pending') instant.pending++;
  });

  laterSnap.forEach(doc => {
    const data = doc.data();
    scheduled.total++;
    if (data.status === 'completed') scheduled.completed++;
    else if (data.status === 'pending') scheduled.pending++;
  });

  return { instant, scheduled };
};

const DashboardSummaryCard: React.FC<DashboardSummaryCardProps> = ({ userId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-summary', userId],
    queryFn: () => fetchPickupSummary(userId),
    enabled: !!userId,
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Pickup Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading summary...</p>
        ) : error ? (
          <p className="text-red-500">Error loading data.</p>
        ) : (
          <div className="space-y-6">
            {/* Instant Pickups */}
            <div>
              <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                Book Now (Instant)
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <DashboardKPICard
                  icon={<Truck className="w-5 h-5 text-muted-foreground" />}
                  label="Total"
                  value={data?.instant.total}
                  iconBg="bg-gray-100"
                />
                <DashboardKPICard
                  icon={<CheckCircle className="w-5 h-5 text-green-600" />}
                  label="Completed"
                  value={data?.instant.completed}
                  iconBg="bg-green-100"
                />
                <DashboardKPICard
                  icon={<Clock className="w-5 h-5 text-yellow-500" />}
                  label="Pending"
                  value={data?.instant.pending}
                  iconBg="bg-yellow-100"
                />
              </div>
            </div>

            {/* Scheduled Pickups */}
            <div>
              <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                Book Later (Scheduled)
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <DashboardKPICard
                  icon={<Truck className="w-5 h-5 text-muted-foreground" />}
                  label="Total"
                  value={data?.scheduled.total}
                  iconBg="bg-gray-100"
                />
                <DashboardKPICard
                  icon={<CheckCircle className="w-5 h-5 text-green-600" />}
                  label="Completed"
                  value={data?.scheduled.completed}
                  iconBg="bg-green-100"
                />
                <DashboardKPICard
                  icon={<Clock className="w-5 h-5 text-yellow-500" />}
                  label="Pending"
                  value={data?.scheduled.pending}
                  iconBg="bg-yellow-100"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardSummaryCard;
