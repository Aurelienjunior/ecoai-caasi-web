
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { LoaderCircle, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface Offer {
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
  return data;
};

const OffersTable = () => {
  const { user } = useAuth();
  const { data: offers, isLoading, error } = useQuery({
    queryKey: ["user-offers", user?.id],
    queryFn: () => fetchOffers(user!.id),
    enabled: !!user,
  });

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <LoaderCircle className="animate-spin" /> Loading offers...
      </div>
    );
  }

  if (!offers || offers.length === 0) {
    return <p className="text-muted-foreground">You haven't submitted any offers yet.</p>;
  }

  return (
    <Card className="overflow-x-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers.map((offer: Offer) => (
            <TableRow key={offer.id}>
              <TableCell>{new Date(offer.created_at).toLocaleString()}</TableCell>
              <TableCell>{offer.address}</TableCell>
              <TableCell>{offer.volume}</TableCell>
              <TableCell>{offer.price}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${offer.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : offer.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {offer.status}
                </span>
              </TableCell>
              <TableCell>
                {/* Agent info placeholder */}
                {offer.status === "pending" ? (
                  <span className="text-xs text-muted-foreground">Waiting for agent</span>
                ) : (
                  <span className="flex items-center gap-1 text-green-700"><UserCheck size={16} /> Assigned</span>
                )}
              </TableCell>
              <TableCell>
                {/* For agents: Accept button, for now only a placeholder */}
                {offer.status === "pending" ? (
                  <Button disabled variant="outline" className="text-xs px-3 py-1 h-auto">Accept (agent only)</Button>
                ) : (
                  <span className="text-xs text-muted-foreground">No action</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default OffersTable;
