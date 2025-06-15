import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import OffersTableSkeleton from "./OffersTableSkeleton";

interface Offer {
  id: string;
  created_at: string;
  address: string;
  volume: string;
  price: string;
  status: string;
  agent_name: string | null;
}

const fetchOffers = async (userId: string) => {
  const { data, error } = await supabase
    .from("pickups")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Offer[];
};

const OffersTable = ({ userId }: { userId: string }) => {
  const { data: offers = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["offers", userId],
    queryFn: () => fetchOffers(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return <OffersTableSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center">
        <p className="text-destructive">Failed to load offers.</p>
        <button
          className="mt-2 px-4 py-2 rounded bg-primary text-primary-foreground text-sm"
          onClick={() => refetch()}
        >
          Retry
        </button>
      </div>
    );
  }

  // Responsive stacking for mobile
  return (
    <div className="overflow-x-auto p-1">
      <div className="hidden sm:block">
        {/* desktop/tablet: normal table */}
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Address</th>
              <th className="p-2 text-left">Volume</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Agent</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.id}>
                <td className="p-2">{new Date(offer.created_at).toLocaleString()}</td>
                <td className="p-2">{offer.address}</td>
                <td className="p-2">{offer.volume}</td>
                <td className="p-2">{offer.price}</td>
                <td className="p-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    offer.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : offer.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {offer.status}
                  </span>
                </td>
                <td className="p-2">{offer.agent_name ?? '-'}</td>
                <td className="p-2">
                  {/* ... action buttons ... */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-2 sm:hidden">
        {/* mobile: stacked cards */}
        {offers.map((offer) => (
          <div key={offer.id} className="border rounded-lg p-3 bg-background shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{new Date(offer.created_at).toLocaleDateString()}</span>
              <span className={`px-2 py-0.5 rounded text-xs ${
                offer.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : offer.status === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {offer.status}
              </span>
            </div>
            <div className="text-sm">
              <div><b>Address:</b> {offer.address}</div>
              <div><b>Volume:</b> {offer.volume}</div>
              <div><b>Price:</b> {offer.price}</div>
              <div><b>Agent:</b> {offer.agent_name ?? '-'}</div>
              {/* Action buttons below */}
              <div className="mt-2">
                {/* ... action button(s) ... */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersTable;
