
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface Offer {
  id: string;
  address: string;
  volume: string;
  notes?: string | null;
}

interface OfferEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: Offer | null;
  onSave: (data: { address: string; volume: string; notes?: string | null }) => Promise<void>;
  isSaving: boolean;
}

export function OfferEditDialog({ open, onOpenChange, offer, onSave, isSaving }: OfferEditDialogProps) {
  const [form, setForm] = useState({
    address: offer?.address || "",
    volume: offer?.volume || "",
    notes: offer?.notes || "",
  });

  React.useEffect(() => {
    // Update form fields whenever different offer gets passed
    setForm({
      address: offer?.address || "",
      volume: offer?.volume || "",
      notes: offer?.notes || "",
    });
  }, [offer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Offer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
            <Input
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              disabled={isSaving}
              required
            />
          </div>
          <div>
            <label htmlFor="volume" className="block text-sm font-medium mb-1">Volume</label>
            <Input
              id="volume"
              name="volume"
              value={form.volume}
              onChange={handleChange}
              disabled={isSaving}
              required
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-1">Notes</label>
            <Input
              as="textarea"
              id="notes"
              name="notes"
              value={form.notes ?? ""}
              onChange={handleChange}
              disabled={isSaving}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" loading={isSaving} disabled={isSaving}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
