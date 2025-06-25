import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/firebase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Truck, CheckCircle, Clock } from 'lucide-react';
import DashboardKPICard from './DashboardKPICard';

interface DashboardSummaryCardProps {
  userId: string;
}

const fetchPickupSummary = async (userId: string) => {
  const pickupsRef = collection(db, 'pickups');
  const q = query(pickupsRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);

  let total = 0;
  let completed = 0;
  let pending = 0;

  snapshot.forEach(doc => {
    const data = doc.data();
    total++;
    if (data.status === 'completed') completed++;
    else if (data.status === 'pending') pending++;
  });

  return {
    totalPickups: total,
    completed,
    pending,
  };
};

const DashboardSummaryCard: React.FC<DashboardSummaryCardProps> = ({
  userId,
}) => {
  const {
    data: summary,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['pickup-summary', userId],
    queryFn: () => fetchPickupSummary(userId),
    enabled: !!userId,
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>My Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || !summary ? (
          <p>Loading summary...</p>
        ) : error ? (
          <p className="text-red-500">Error loading summary.</p>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardSummaryCard;
