import React, { useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '@/firebase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { LoaderCircle, UserCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

const ScheduledPickupSchema = z.object({
  id: z.string(),
  address: z.string(),
  date: z.string(),
  time: z.string(),
  estimatedPrice: z.number().or(z.string().transform(Number)),
  estimatedVolume: z.string(),
  wasteType: z.string(),
  status: z.string(),
  createdAt: z.any(),
  userId: z.string(),
});

type ScheduledOffer = z.infer<typeof ScheduledPickupSchema>;

const fetchScheduledOffers = async (userId: string): Promise<ScheduledOffer[]> => {
  const q = query(
    collection(db, 'scheduledPickups'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);

  const offers: ScheduledOffer[] = [];
  snapshot.forEach((docSnap) => {
    const data = { id: docSnap.id, ...docSnap.data() };
    const parsed = ScheduledPickupSchema.safeParse(data);
    if (parsed.success) {
      offers.push(parsed.data);
    } else {
      console.warn('Invalid scheduled pickup skipped:', parsed.error.format());
    }
  });

  return offers;
};

const ScheduledOffersTable = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [offerToDelete, setOfferToDelete] = useState<ScheduledOffer | null>(null);
  const [deleting, setDeleting] = useState(false);
  const queryClient = useQueryClient();

  const { data: scheduledOffers, isLoading } = useQuery({
    queryKey: ['user-scheduled-offers', user?.uid],
    queryFn: () => fetchScheduledOffers(user!.uid),
    enabled: !!user?.uid,
  });

  const handleDelete = async (offer: ScheduledOffer) => {
    try {
      setDeleting(true);
      await deleteDoc(doc(db, 'scheduledPickups', offer.id));
      toast({
        title: 'Pickup deleted',
        description: 'Your scheduled pickup was successfully deleted.',
      });
      queryClient.invalidateQueries(['user-scheduled-offers', user?.uid]);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Could not delete the pickup. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
      setOfferToDelete(null);
    }
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <LoaderCircle className="animate-spin" /> Loading scheduled pickups...
      </div>
    );
  }

  if (!scheduledOffers || scheduledOffers.length === 0) {
    return (
      <p className="text-muted-foreground">
        You haven't scheduled any pickups yet.
      </p>
    );
  }

  return (
    <Card className="overflow-x-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>Waste Type</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scheduledOffers.map((offer) => (
            <TableRow key={offer.id}>
              <TableCell>{offer.date}</TableCell>
              <TableCell>{offer.time}</TableCell>
              <TableCell>{offer.address}</TableCell>
              <TableCell>{offer.estimatedVolume}</TableCell>
              <TableCell>{offer.wasteType}</TableCell>
              <TableCell>{Number(offer.estimatedPrice).toLocaleString()} XAF</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    offer.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : offer.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {offer.status}
                </span>
              </TableCell>
              <TableCell>
                {offer.status === 'pending' ? (
                  <Dialog
                    open={offerToDelete?.id === offer.id}
                    onOpenChange={(open) => !open && setOfferToDelete(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="px-3 py-1 h-auto flex gap-1"
                        onClick={() => setOfferToDelete(offer)}
                        disabled={deleting}
                      >
                        <Trash2 size={16} /> Cancel
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cancel Pickup?</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to cancel this scheduled pickup?
                          This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline" disabled={deleting}>
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(offer)}
                          disabled={deleting}
                        >
                          {deleting ? 'Deleting...' : 'Yes, cancel'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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

export default ScheduledOffersTable;
