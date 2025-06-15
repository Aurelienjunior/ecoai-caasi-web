
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import OffersTableSkeleton from "./OffersTableSkeleton";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { OfferEditDialog } from "./OfferEditDialog";
import { Trash2, Pencil } from "lucide-react";

interface Offer {
  id: string;
  created_at: string;
  address: string;
  volume: string;
  price: string;
  status: string;
  notes?: string | null;
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
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [editOffer, setEditOffer] = useState<Offer | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteOffer, setDeleteOffer] = useState<Offer | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { data: offers = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["offers", userId],
    queryFn: () => fetchOffers(userId),
    enabled: !!userId,
  });

  // Edit offer
  const handleEdit = (offer: Offer) => {
    setEditOffer(offer);
    setEditOpen(true);
  };

  const handleEditSave = async (values: { address: string; volume: string; notes?: string | null }) => {
    if (!editOffer) return;
    setIsSaving(true);
    const { error } = await supabase
      .from("pickups")
      .update({
        address: values.address,
        volume: values.volume,
        notes: values.notes,
      })
      .eq("id", editOffer.id);
    setIsSaving(false);
    if (!error) {
      toast({ title: "Offer updated", description: "Your changes were saved." });
      setEditOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["offers", userId] });
    } else {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    }
  };

  // Delete offer
  const handleRetract = (offer: Offer) => {
    setDeleteOffer(offer);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteOffer) return;
    setIsSaving(true);
    const { error } = await supabase.from("pickups").delete().eq("id", deleteOffer.id);
    setIsSaving(false);
    if (!error) {
      toast({ title: "Offer retracted", description: "This offer was removed." });
      setDeleteOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["offers", userId] });
    } else {
      toast({ title: "Failed to retract", description: error.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return <OffersTableSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center">
        <p className="text-destructive">Failed to load offers.</p>
        <Button
          className="mt-2"
          onClick={() => refetch()}
          aria-label="Retry loading offers"
        >
          Retry
        </Button>
      </div>
    );
  }

  // Responsive stacking for mobile
  return (
    <>
      {/* EDIT OFFER DIALOG */}
      <OfferEditDialog
        open={editOpen}
        onOpenChange={(open) => setEditOpen(open)}
        offer={editOffer}
        onSave={handleEditSave}
        isSaving={isSaving}
      />
      {/* DELETE CONFIRM DIALOG */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Retract Offer?</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to retract this offer? This cannot be undone.</p>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setDeleteOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              loading={isSaving}
              disabled={isSaving}
            >
              Yes, Retract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  <td className="p-2 flex gap-2">
                    {offer.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          aria-label="Edit Offer"
                          onClick={() => handleEdit(offer)}
                        >
                          <Pencil size={16} className="mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          aria-label="Retract Offer"
                          onClick={() => handleRetract(offer)}
                        >
                          <Trash2 size={16} className="mr-1" /> Retract
                        </Button>
                      </>
                    )}
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
                {offer.notes && (
                  <div><b>Notes:</b> {offer.notes}</div>
                )}
                <div className="mt-2 flex gap-2">
                  {offer.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        aria-label="Edit Offer"
                        onClick={() => handleEdit(offer)}
                      >
                        <Pencil size={16} className="mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        aria-label="Retract Offer"
                        onClick={() => handleRetract(offer)}
                      >
                        <Trash2 size={16} className="mr-1" /> Retract
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default OffersTable;
