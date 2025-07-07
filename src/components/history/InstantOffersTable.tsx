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

interface Offer {
  id: string;
  address: string;
  volume: string;
  price: string;
  status: string;
  createdAt: any;
  userId: string;
}

const fetchUserOffers = async (userId: string): Promise<Offer[]> => {
  const q = query(
    collection(db, 'pickups'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Offer[];
};

const OffersTable = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null);
  const [deleting, setDeleting] = useState(false);
  const queryClient = useQueryClient();

  const { data: currentOffers, isLoading } = useQuery({
    queryKey: ['user-offers', user?.uid],
    queryFn: () => fetchUserOffers(user!.uid),
    enabled: !!user?.uid,
  });

  const handleDelete = async (offer: Offer) => {
    try {
      setDeleting(true);
      await deleteDoc(doc(db, 'pickups', offer.id));
      toast({
        title: 'Offer retracted',
        description: 'Your offer has been successfully deleted.',
      });
      queryClient.invalidateQueries(['user-offers', user?.uid]);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to retract offer. Please try again.',
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
        <LoaderCircle className="animate-spin" /> Loading offers...
      </div>
    );
  }

  if (!currentOffers || currentOffers.length === 0) {
    return (
      <p className="text-muted-foreground">
        You haven't submitted any offers yet.
      </p>
    );
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
          {currentOffers.map((offer) => (
            <TableRow key={offer.id}>
              <TableCell>
                {offer.createdAt?.toDate
                  ? offer.createdAt.toDate().toLocaleString()
                  : 'N/A'}
              </TableCell>
              <TableCell>{offer.address}</TableCell>
              <TableCell>{offer.volume}</TableCell>
              <TableCell>{offer.price}</TableCell>
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
                  <span className="text-xs text-muted-foreground">
                    Waiting for agent
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-green-700">
                    <UserCheck size={16} /> Assigned
                  </span>
                )}
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
                        <Trash2 size={16} /> Retract
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Retract Offer?</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to retract this offer? This
                          action cannot be undone.
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
                          {deleting ? 'Deleting...' : 'Yes, retract'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No action
                  </span>
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