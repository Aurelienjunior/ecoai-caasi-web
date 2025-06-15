
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OfferSummaryCardProps {
  userId: string;
}

const fetchLatestOffer = async (userId: string) => {
  const { data, error } = await supabase
    .from("pickups")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data;
};

const OfferSummaryCard: React.FC<OfferSummaryCardProps> = ({ userId }) => {
  const { data: offer, isLoading, error } = useQuery({
    queryKey: ['latest-offer', userId],
    queryFn: () => fetchLatestOffer(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Offer</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading offer...</p>
        </CardContent>
      </Card>
    );
  }

  if (!offer) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Offer</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No offer submitted yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Offer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div>
            <span className="font-bold">Address: </span>
            <span>{offer.address}</span>
          </div>
          <div>
            <span className="font-bold">Price: </span>
            <span>{offer.price}</span>
          </div>
          <div>
            <span className="font-bold">Volume: </span>
            <span>{offer.volume}</span>
          </div>
          <div>
            <span className="font-bold">Status: </span>
            <span className={`px-2 py-1 rounded ${offer.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : offer.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              {offer.status}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OfferSummaryCard;
