import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phone: z.string().min(9, { message: 'Please enter a valid phone number.' }),
  address: z.string().min(10, { message: 'Address must be at least 10 characters.' }),
  notes: z.string().optional(),
});

interface SchedulePickupFormProps {
  onSchedule: () => void;
  volume: string;
  price: string;
}

const SchedulePickupForm: React.FC<SchedulePickupFormProps> = ({ onSchedule, volume, price }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      notes: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast.error("You must be logged in to schedule a pickup.");
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.from('pickups').insert({
      user_id: user.id,
      name: values.name,
      phone: values.phone,
      address: values.address,
      notes: values.notes,
      volume: volume,
      price: price,
      status: 'pending'
    });

    setIsSubmitting(false);

    if (error) {
      console.error('Error saving pickup:', error);
      toast.error(`Failed to schedule pickup: ${error.message}`);
    } else {
      console.log('Pickup scheduled with details:', values);
      onSchedule();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+237 6XX XXX XXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pickup Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter your full address, including any landmarks." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Optional Notes for Agent</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Ring the bell twice" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Confirming...' : 'Confirm Pickup'}
        </Button>
      </form>
    </Form>
  );
};

export default SchedulePickupForm;
