
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { LoaderCircle, UserCheck, Trash2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useUserOffers, Offer } from "@/hooks/useUserOffers";
import OffersTableSkeleton from "./OffersTableSkeleton";

const OffersTable = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const {
    offers: currentOffers,
    isLoading,
    removeOfferLocally,
    invalidate,
  } = useUserOffers(user?.id);

  // Retry logic for loading offers
  const handleRetry = () => {
    setFetchError(null);
    invalidate();
  };

  const handleDelete = async (offer: Offer) => {
    setDeleting(true);
    const { error } = await supabase
      .from("pickups")
      .delete()
      .eq("id", offer.id)
      .eq("user_id", user!.id);
    setDeleting(false);
    setOfferToDelete(null);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to retract offer. Please try again.",
        variant: "destructive",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(offer)}
            aria-label="Retry retract offer"
          >
            <RefreshCcw className="mr-1" size={16} /> Retry
          </Button>
        ),
      });
    } else {
      toast({
        title: "Offer retracted",
        description: "Your offer has been successfully deleted.",
      });
      removeOfferLocally(offer.id);
      invalidate();
    }
  };

  React.useEffect(() => {
    if (!isLoading && !currentOffers && user) {
      setFetchError("Failed to load your offers. Please try again.");
    }
    if (currentOffers) {
      setFetchError(null);
    }
  }, [isLoading, currentOffers, user]);

  if (!user) return null;

  if (isLoading) {
    return <OffersTableSkeleton />;
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center gap-3 text-red-700 bg-red-50 border border-red-100 rounded-lg p-4">
        <div className="flex items-center gap-2 text-sm">
          <LoaderCircle className="animate-spin" size={20} aria-label="Loading error" /> {fetchError}
        </div>
        <Button variant="outline" onClick={handleRetry} aria-label="Retry loading offers">
          <RefreshCcw className="mr-2" size={16} /> Retry
        </Button>
      </div>
    );
  }

  if (!currentOffers || currentOffers.length === 0) {
    return <p className="text-muted-foreground">You haven't submitted any offers yet.</p>;
  }

  return (
    <>
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
            {currentOffers.map((offer: Offer) => (
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
                  {offer.status === "pending" ? (
                    <span className="text-xs text-muted-foreground">Waiting for agent</span>
                  ) : (
                    <span className="flex items-center gap-1 text-green-700"><UserCheck size={16} aria-label="Assigned" /> Assigned</span>
                  )}
                </TableCell>
                <TableCell>
                  {offer.status === "pending" ? (
                    <Dialog open={offerToDelete?.id === offer.id} onOpenChange={(open) => !open && setOfferToDelete(null)}>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="px-3 py-1 h-auto flex gap-1"
                          onClick={() => setOfferToDelete(offer)}
                          disabled={deleting}
                          aria-label="Retract offer"
                        >
                          <Trash2 size={16} /> Retract
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Retract Offer?</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to retract this offer? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline" disabled={deleting}>Cancel</Button>
                          </DialogClose>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(offer)}
                            disabled={deleting}
                            aria-label="Confirm retract offer"
                          >
                            {deleting ? "Deleting..." : "Yes, retract"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <span className="text-xs text-muted-foreground" aria-label="No action available">No action</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default OffersTable;

