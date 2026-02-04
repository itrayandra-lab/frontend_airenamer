import React from 'react';
import MidtransPayment from '@/components/MidtransPayment';

const PaymentPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Gateway
          </h1>
          <p className="text-gray-600">
            Secure payment processing with Midtrans
          </p>
        </div>
        
        <MidtransPayment />
      </div>
    </div>
  );
};

export default PaymentPage;