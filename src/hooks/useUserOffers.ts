
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Offer {
  id: string;
  created_at: string;
  address: string;
  price: string;
  volume: string;
  status: string;
  name: string;
  phone: string;
  notes: string | null;
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

export function useUserOffers(userId: string | undefined) {
  const queryClient = useQueryClient();
  const [localOffers, setLocalOffers] = useState<Offer[] | null>(null);

  const { data: offers, isLoading } = useQuery({
    queryKey: ["user-offers", userId],
    queryFn: () => fetchOffers(userId!),
    enabled: !!userId,
  });

  useEffect(() => {
    if (offers) {
      setLocalOffers(offers);
    }
  }, [offers]);

  const removeOfferLocally = (id: string) => {
    setLocalOffers((prev) => (prev ? prev.filter((offer) => offer.id !== id) : null));
  };

  // invalidate cache helper for parent
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["user-offers", userId] });

  return {
    offers: localOffers ?? offers,
    isLoading,
    removeOfferLocally,
    invalidate,
  };
}
