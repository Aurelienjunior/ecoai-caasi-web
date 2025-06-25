// pages/Payment.tsx

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';

import PaymentHeader from '@/components/payment/PaymentHeader';
import BottomNav from '@/components/layout/BottomNav';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';

const mockData = {
  scheduleDetails: {
    name: 'Jane Doe',
    phone: '+237 670 00 00 00',
    address: '123 Tech Avenue, Buea',
    notes: 'Call on arrival.',
  },
  analysisResult: {
    volume: 'Medium Bag',
    price: '1500 XAF',
    wasteType: 'Mixed Recyclables',
    detectedItems: [],
    error: null,
  },
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paymentPhone, setPaymentPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { scheduleDetails, analysisResult } = location.state || mockData;

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  const sanitizeInput = (input: string) => {
    return input.trim().replace(/[<>]/g, '');
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error('You must be logged in to make a payment.');
      return;
    }

    if (!validatePhoneNumber(paymentPhone)) {
      toast.error('Please enter a valid 9-digit phone number.');
      return;
    }

    if (
      !scheduleDetails?.name ||
      !scheduleDetails?.phone ||
      !scheduleDetails?.address
    ) {
      toast.error(
        'Missing required scheduling information. Please go back and complete the form.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate payment
      console.log('Simulating payment with phone:', `+237${paymentPhone}`);
      await new Promise((res) => setTimeout(res, 2000));

      // Save to Firestore
      await addDoc(collection(db, 'pickups'), {
        userId: user.uid,
        name: sanitizeInput(scheduleDetails.name),
        phone: sanitizeInput(scheduleDetails.phone),
        address: sanitizeInput(scheduleDetails.address),
        notes: scheduleDetails.notes
          ? sanitizeInput(scheduleDetails.notes)
          : '',
        volume: sanitizeInput(analysisResult.volume),
        price: sanitizeInput(analysisResult.price),
        wasteType: sanitizeInput(analysisResult.wasteType),
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      toast.success('Payment successful and pickup scheduled!', {
        description:
          "We've received your request and will notify you once an agent is assigned.",
        duration: 5000,
      });

      navigate('/history');
    } catch (error) {
      console.error('Payment or Firestore error:', error);
      toast.error('Payment processing failed. Please try again.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <PaymentHeader />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="bg-gray-800 text-white rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-300">Merchant</p>
              <p className="font-bold text-lg">Caasitech Group</p>
            </div>
            <div>
              <p className="text-sm text-gray-300 text-right">Total</p>
              <p className="font-bold text-lg">{analysisResult.price}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">MTN Mobile Money</h2>
            <p className="text-sm text-muted-foreground">
              Pay with mobile money
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </label>
            <div className="flex items-center">
              <div className="flex items-center gap-2 border border-r-0 border-input bg-background rounded-l-md px-3 h-10">
                🇨🇲 <span className="text-base text-muted-foreground">+237</span>
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="677345455"
                className="rounded-l-none border-l-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={paymentPhone}
                onChange={(e) =>
                  setPaymentPhone(e.target.value.replace(/\D/g, '').slice(0, 9))
                }
                maxLength={9}
              />
            </div>
            {paymentPhone && !validatePhoneNumber(paymentPhone) && (
              <p className="text-sm text-red-500">
                Please enter exactly 9 digits
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <Button
            onClick={handlePayment}
            disabled={isSubmitting || !validatePhoneNumber(paymentPhone)}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              `Pay ${analysisResult.price}`
            )}
          </Button>
          <p className="text-xs text-green-600 text-center">
            Your payment is 100% secured.
          </p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Payment;
