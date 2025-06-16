
import React, { useEffect } from 'react';
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

const formSchema = z.object({
  name: z.string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(50, { message: 'Name must not exceed 50 characters.' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'Name can only contain letters and spaces.' }),
  phone: z.string()
    .min(9, { message: 'Please enter a valid phone number.' })
    .regex(/^(\+237|237)?[0-9]{9}$/, { message: 'Please enter a valid Cameroon phone number.' }),
  address: z.string()
    .min(10, { message: 'Address must be at least 10 characters.' })
    .max(500, { message: 'Address must not exceed 500 characters.' }),
  notes: z.string()
    .max(1000, { message: 'Notes must not exceed 1000 characters.' })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SchedulePickupFormProps {
  onSchedule: (values: FormValues) => void;
}

const SchedulePickupForm: React.FC<SchedulePickupFormProps> = ({ onSchedule }) => {
  const { user, profile } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (profile?.first_name) {
      form.setValue('name', profile.first_name);
    }
    if (user?.phone) {
      form.setValue('phone', user.phone);
    }
  }, [profile, user, form]);

  const sanitizeInput = (input: string) => {
    return input.trim().replace(/[<>]/g, '');
  };

  function onSubmit(values: FormValues) {
    // Sanitize all inputs before submission
    const sanitizedValues = {
      name: sanitizeInput(values.name),
      phone: sanitizeInput(values.phone),
      address: sanitizeInput(values.address),
      notes: values.notes ? sanitizeInput(values.notes) : '',
    };
    
    onSchedule(sanitizedValues);
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
        <Button type="submit" className="w-full">
          Continue to Payment
        </Button>
      </form>
    </Form>
  );
};

export default SchedulePickupForm;
