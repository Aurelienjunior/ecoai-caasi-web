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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OfferSummaryCardProps {
  userId: string;
}

const fetchInstantPickups = async (userId: string): Promise<DocumentData[]> => {
  const pickupsRef = collection(db, 'pickups');
  const q = query(pickupsRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const fetchScheduledPickups = async (userId: string): Promise<DocumentData[]> => {
  const scheduledRef = collection(db, 'scheduledPickups');
  const q = query(scheduledRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  const baseClasses = "inline-block px-2 py-0.5 rounded-full text-xs font-semibold";

  const statusMap = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const classes = statusMap[status?.toLowerCase() || ""] || "bg-gray-100 text-gray-700";

  return <span className={`${baseClasses} ${classes}`}>{status || "Unknown"}</span>;
};

const InfoRow: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => (
  <div className="flex justify-between text-sm text-gray-700">
    <span className="font-medium">{label}</span>
    <span>{value || "N/A"}</span>
  </div>
);

const OfferSummaryCard: React.FC<OfferSummaryCardProps> = ({ userId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['all-pickups', userId],
    queryFn: async () => {
      const [instantPickups, scheduledPickups] = await Promise.all([
        fetchInstantPickups(userId),
        fetchScheduledPickups(userId),
      ]);
      return { instantPickups, scheduledPickups };
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Pickups</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading pickups...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Pickups</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Failed to load pickups. Try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const { instantPickups, scheduledPickups } = data;

  return (
    <div className="w-full flex flex-col gap-6">
      <h1 className="text-2xl font-bold mb-4">My Pickups</h1>

      {/* Instant Pickups */}
      <section>
        <h2 className="text-lg font-semibold mb-3 border-l-4 border-green-500 pl-2 text-green-700">
          Instant Pickups (Book Now)
        </h2>
        {instantPickups.length === 0 ? (
          <p className="text-gray-500">No instant pickups found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {instantPickups.map((pickup) => (
              <Card
                key={pickup.id}
                className="p-4 shadow-md rounded-lg hover:shadow-xl transition-shadow cursor-default"
              >
                <CardContent className="space-y-2 p-0">
                  <InfoRow label="Address" value={pickup.address} />
                  <InfoRow label="Price" value={`${pickup.price} XAF`} />
                  <InfoRow label="Volume" value={pickup.volume} />
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Status</span>
                    <StatusBadge status={pickup.status} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Scheduled Pickups */}
      <section>
        <h2 className="text-lg font-semibold mb-3 border-l-4 border-blue-500 pl-2 text-blue-700">
          Scheduled Pickups (Book Later)
        </h2>
        {scheduledPickups.length === 0 ? (
          <p className="text-gray-500">No scheduled pickups found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduledPickups.map((pickup) => (
              <Card
                key={pickup.id}
                className="p-4 shadow-md rounded-lg hover:shadow-xl transition-shadow cursor-default"
              >
                <CardContent className="space-y-2 p-0">
                  <InfoRow label="Address" value={pickup.address} />
                  <InfoRow label="Est. Volume" value={pickup.estimatedVolume} />
                  <InfoRow
                    label="Schedule"
                    value={`${pickup.date || "N/A"} ${pickup.time || ""}`}
                  />
                  <InfoRow
                    label="Est. Price"
                    value={
                      pickup.estimatedPrice
                        ? `${pickup.estimatedPrice.toLocaleString()} XAF`
                        : "N/A"
                    }
                  />
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Status</span>
                    <StatusBadge status={pickup.status} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default OfferSummaryCard;
