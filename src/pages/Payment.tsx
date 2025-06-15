
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PaymentHeader from '@/components/payment/PaymentHeader';
import BottomNav from '@/components/layout/BottomNav';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';

// Add mock data for development when the page is accessed directly.
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

    // Use data from location state, or mock data if it's not available.
    const { scheduleDetails, analysisResult } = location.state || mockData;

    const handlePayment = async () => {
        if (!user) {
            toast.error("You must be logged in to make a payment.");
            return;
        }
        if (paymentPhone.length < 9) {
            toast.error("Please enter a valid 9-digit phone number.");
            return;
        }

        setIsSubmitting(true);

        // Here would be the actual payment gateway integration.
        // For now, we'll simulate a successful payment.
        console.log("Simulating payment with phone:", `+237${paymentPhone}`);
        await new Promise(res => setTimeout(res, 2000));

        const { error } = await supabase.from('pickups').insert({
          user_id: user.id,
          name: scheduleDetails.name,
          phone: scheduleDetails.phone,
          address: scheduleDetails.address,
          notes: scheduleDetails.notes,
          volume: analysisResult.volume,
          price: analysisResult.price,
          status: 'pending'
        });
    
        setIsSubmitting(false);
    
        if (error) {
          console.error('Error saving pickup:', error);
          toast.error(`Failed to schedule pickup: ${error.message}`);
        } else {
          toast.success("Payment successful and pickup scheduled!", {
            description: "We've received your request and will notify you once an agent is assigned.",
            duration: 5000,
          });
          navigate('/history');
        }
    }

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
                        <p className="text-sm text-muted-foreground">Pay with mobile money</p>
                    </div>
                    
                    <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                        <div className="flex items-center">
                            <div className="flex items-center gap-2 border border-r-0 border-input bg-background rounded-l-md px-3 h-10">
                                <span role="img" aria-label="Cameroon Flag">🇨🇲</span>
                                <span className="text-base text-muted-foreground">+237</span>
                            </div>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="677345455"
                                className="rounded-l-none border-l-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                value={paymentPhone}
                                onChange={(e) => setPaymentPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <Button onClick={handlePayment} disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700">
                        {isSubmitting ? <LoaderCircle className="animate-spin" /> : `Pay ${analysisResult.price}`}
                    </Button>
                    <p className="text-xs text-green-600 text-center">Your payment is 100% secured.</p>
                </div>
            </main>
            <BottomNav />
        </div>
    );
};

export default Payment;
