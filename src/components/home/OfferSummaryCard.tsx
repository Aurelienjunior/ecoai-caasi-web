import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OfferSummaryCardProps {
  userId: string;
}

// Fetch all pickups for a given user, ordered by createdAt descending
const fetchAllPickups = async (userId: string): Promise<DocumentData[]> => {
  try {
    console.log('📡 Fetching all pickups for userId:', userId);
    const pickupsRef = collection(db, 'pickups');
    const q = query(
      pickupsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    console.log('📦 Docs found:', snapshot.size);

    if (!snapshot.empty) {
      const data = snapshot.docs.map((doc) => doc.data());
      console.log('✅ Data:', data);
      return data;
    }

    console.log('⚠️ No docs found.');
    return [];
  } catch (error) {
    console.error('❌ Firestore fetch error:', error);
    throw error;
  }
};

const OfferSummaryCard: React.FC<OfferSummaryCardProps> = ({ userId }) => {
  const {
    data: pickups,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['all-pickpus', userId],
    queryFn: () => fetchAllPickups(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Pickups</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading Pickups...</p>
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
          <p className="text-red-600">
            Failed to load Pickups. Try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!pickups || pickups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Pickups</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No pickups submitted yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className=" w-full flex flex-col gap-4 ">
      <h1 className=" text-2xl font-bold ">My Pickups</h1>
      <div className=" w-full flex md:flex-row flex-wrap gap-4 ">
        {pickups.map((offer, idx) => (
          <Card key={idx} className=" max-sm:w-full mb-4">
            <CardHeader>
              <CardTitle>Pickup: {idx + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div>
                  <span className="font-bold">Address: </span>
                  <span>{offer.address || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-bold">Price: </span>
                  <span>{offer.price || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-bold">Volume: </span>
                  <span>{offer.volume || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-bold">Status: </span>
                  <span
                    className={`px-2 py-1 rounded ${
                      offer.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : offer.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {offer.status || 'Unknown'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OfferSummaryCard;
