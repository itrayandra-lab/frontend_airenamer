import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, CheckCircle, XCircle } from 'lucide-react';

// Declare Midtrans Snap global
declare global {
  interface Window {
    snap: {
      pay: (token: string, options?: {
        onSuccess?: (result: any) => void;
        onPending?: (result: any) => void;
        onError?: (result: any) => void;
        onClose?: () => void;
      }) => void;
    };
  }
}

interface PaymentData {
  order_id?: string;
  gross_amount: number;
  customer_details: {
    first_name: string;
    last_name?: string;
    email: string;
    phone: string;
  };
  item_details: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}

interface PaymentResponse {
  success: boolean;
  data?: {
    snap_token: string;
    order_id: string;
    client_key: string;
    is_production: boolean;
  };
  message?: string;
  error?: string;
}

const MidtransPayment: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [snapLoaded, setSnapLoaded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed' | 'pending'>('idle');
  const [error, setError] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');

  // Form data
  const [formData, setFormData] = useState<PaymentData>({
    gross_amount: 100000, // Default amount
    customer_details: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
    },
    item_details: [
      {
        id: 'premium-subscription',
        price: 100000,
        quantity: 1,
        name: 'Premium Subscription - 1 Month'
      }
    ]
  });

  // Load Midtrans Snap script
  useEffect(() => {
    const loadSnapScript = () => {
      if (window.snap) {
        setSnapLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', 'SB-Mid-client-k1iz1OeG8CPd48qn');
      script.onload = () => setSnapLoaded(true);
      script.onerror = () => setError('Failed to load Midtrans Snap');
      document.head.appendChild(script);
    };

    loadSnapScript();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('customer_details.')) {
      const customerField = field.replace('customer_details.', '');
      setFormData(prev => ({
        ...prev,
        customer_details: {
          ...prev.customer_details,
          [customerField]: value
        }
      }));
    } else if (field === 'gross_amount') {
      const amount = parseInt(value) || 0;
      setFormData(prev => ({
        ...prev,
        gross_amount: amount,
        item_details: prev.item_details.map(item => ({
          ...item,
          price: amount
        }))
      }));
    }
  };

  const createPayment = async () => {
    if (!snapLoaded) {
      setError('Midtrans Snap is not loaded yet');
      return;
    }

    setLoading(true);
    setError('');
    setPaymentStatus('processing');

    try {
      // Generate unique order ID
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const generatedOrderId = `ORDER-${timestamp}-${randomStr}`;

      const paymentData = {
        ...formData,
        order_id: generatedOrderId
      };

      // Call Laravel API to create Snap token
      const response = await fetch('http://127.0.0.1:8000/api/payment/create-snap-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      const result: PaymentResponse = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.message || result.error || 'Failed to create payment');
      }

      setOrderId(result.data.order_id);

      // Open Midtrans Snap
      window.snap.pay(result.data.snap_token, {
        onSuccess: (result) => {
          console.log('Payment Success:', result);
          setPaymentStatus('success');
          setLoading(false);
        },
        onPending: (result) => {
          console.log('Payment Pending:', result);
          setPaymentStatus('pending');
          setLoading(false);
        },
        onError: (result) => {
          console.log('Payment Error:', result);
          setPaymentStatus('failed');
          setError('Payment failed. Please try again.');
          setLoading(false);
        },
        onClose: () => {
          console.log('Payment popup closed');
          if (paymentStatus === 'processing') {
            setPaymentStatus('idle');
          }
          setLoading(false);
        }
      });

    } catch (err) {
      console.error('Payment Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setPaymentStatus('failed');
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!orderId) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/payment/status/${orderId}`);
      const result = await response.json();
      
      if (result.success) {
        console.log('Payment Status:', result.data);
        // Update UI based on status
        if (result.data.status === 'success') {
          setPaymentStatus('success');
        } else if (result.data.status === 'pending') {
          setPaymentStatus('pending');
        } else if (['failed', 'cancelled', 'expired'].includes(result.data.status)) {
          setPaymentStatus('failed');
        }
      }
    } catch (err) {
      console.error('Status Check Error:', err);
    }
  };

  const resetPayment = () => {
    setPaymentStatus('idle');
    setError('');
    setOrderId('');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Midtrans Payment Integration
          </CardTitle>
          <CardDescription>
            Test payment integration with Midtrans Snap
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Payment Status */}
          {paymentStatus !== 'idle' && (
            <Alert className={`${
              paymentStatus === 'success' ? 'border-green-200 bg-green-50' :
              paymentStatus === 'failed' ? 'border-red-200 bg-red-50' :
              paymentStatus === 'pending' ? 'border-yellow-200 bg-yellow-50' :
              'border-blue-200 bg-blue-50'
            }`}>
              <div className="flex items-center gap-2">
                {paymentStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                {paymentStatus === 'failed' && <XCircle className="h-4 w-4 text-red-600" />}
                {paymentStatus === 'pending' && <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />}
                {paymentStatus === 'processing' && <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />}
                <AlertDescription>
                  {paymentStatus === 'success' && 'Payment completed successfully!'}
                  {paymentStatus === 'failed' && 'Payment failed. Please try again.'}
                  {paymentStatus === 'pending' && 'Payment is being processed...'}
                  {paymentStatus === 'processing' && 'Opening payment gateway...'}
                </AlertDescription>
              </div>
              {orderId && (
                <div className="mt-2 text-sm text-gray-600">
                  Order ID: {orderId}
                </div>
              )}
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Payment Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.customer_details.first_name}
                onChange={(e) => handleInputChange('customer_details.first_name', e.target.value)}
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.customer_details.last_name || ''}
                onChange={(e) => handleInputChange('customer_details.last_name', e.target.value)}
                placeholder="Enter last name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.customer_details.email}
                onChange={(e) => handleInputChange('customer_details.email', e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.customer_details.phone}
                onChange={(e) => handleInputChange('customer_details.phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="amount">Amount (IDR)</Label>
              <Input
                id="amount"
                type="number"
                value={formData.gross_amount}
                onChange={(e) => handleInputChange('gross_amount', e.target.value)}
                placeholder="Enter amount"
                min="1000"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={createPayment}
              disabled={loading || !snapLoaded || !formData.customer_details.first_name || !formData.customer_details.email}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay Now - IDR {formData.gross_amount.toLocaleString()}
                </>
              )}
            </Button>
            
            {orderId && (
              <Button
                variant="outline"
                onClick={checkPaymentStatus}
                disabled={loading}
              >
                Check Status
              </Button>
            )}
            
            {paymentStatus !== 'idle' && (
              <Button
                variant="outline"
                onClick={resetPayment}
                disabled={loading}
              >
                Reset
              </Button>
            )}
          </div>

          {/* Snap Status */}
          <div className="text-sm text-gray-500 pt-2">
            Midtrans Snap: {snapLoaded ? '✅ Loaded' : '⏳ Loading...'}
          </div>
        </CardContent>
      </Card>

      {/* Payment Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Test Payment Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Credit Card Test:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Card Number: 4811 1111 1111 1114</li>
            <li>Expiry: 01/25</li>
            <li>CVV: 123</li>
          </ul>
          <p className="pt-2"><strong>Other Payment Methods:</strong></p>
          <p>You can test various payment methods like Bank Transfer, E-Wallet, etc. in the Snap popup.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MidtransPayment;