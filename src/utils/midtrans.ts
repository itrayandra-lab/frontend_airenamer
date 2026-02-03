// Midtrans Integration Utilities

export interface TransactionData {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
  customer_details: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    billing_address?: {
      first_name: string;
      last_name: string;
      address: string;
      city: string;
      postal_code: string;
      country_code: string;
    };
  };
  item_details: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
  credit_card?: {
    secure: boolean;
  };
  custom_expiry?: {
    expiry_duration: number;
    unit: string;
  };
}

export interface MidtransConfig {
  clientKey: string;
  serverKey: string;
  isProduction: boolean;
}

export const getMidtransConfig = (): MidtransConfig => {
  return {
    clientKey: process.env.REACT_APP_MIDTRANS_CLIENT_KEY || '',
    serverKey: process.env.REACT_APP_MIDTRANS_SERVER_KEY || '',
    isProduction: process.env.REACT_APP_MIDTRANS_IS_PRODUCTION === 'true'
  };
};

export const createSnapToken = async (transactionData: TransactionData): Promise<string> => {
  const config = getMidtransConfig();
  const baseUrl = config.isProduction 
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

  try {
    // In a real application, this should be done on the backend
    // This is just for demonstration purposes
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(config.serverKey + ':')}`
      },
      body: JSON.stringify(transactionData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.token;
  } catch (error) {
    console.error('Error creating snap token:', error);
    throw error;
  }
};

export const loadMidtransScript = (clientKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (window.snap) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    const config = getMidtransConfig();
    
    script.src = config.isProduction
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';
    
    script.setAttribute('data-client-key', clientKey);
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Midtrans script'));
    
    document.head.appendChild(script);
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const generateOrderId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `ORDER-${timestamp}-${random}`;
};

// Payment status constants
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'settlement',
  FAILED: 'failure',
  CANCELLED: 'cancel',
  EXPIRED: 'expire'
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

// Subscription duration helpers
export const SUBSCRIPTION_DURATION = {
  MONTHLY: 30,
  ANNUAL: 365
} as const;

export const calculateSubscriptionEndDate = (isAnnual: boolean): Date => {
  const now = new Date();
  const duration = isAnnual ? SUBSCRIPTION_DURATION.ANNUAL : SUBSCRIPTION_DURATION.MONTHLY;
  return new Date(now.getTime() + (duration * 24 * 60 * 60 * 1000));
};

// Package type helpers
export const PACKAGE_TYPES = {
  GRATIS: 'gratis',
  PRO: 'pro',
  BISNIS: 'bisnis'
} as const;

export type PackageType = typeof PACKAGE_TYPES[keyof typeof PACKAGE_TYPES];

export const getPackageFeatures = (packageType: PackageType): string[] => {
  switch (packageType) {
    case PACKAGE_TYPES.GRATIS:
      return [
        'Penamaan AI dasar',
        'Pemrosesan satu folder',
        'Dukungan email',
        'Template dasar'
      ];
    case PACKAGE_TYPES.PRO:
      return [
        'Penamaan AI lanjutan',
        'Pemrosesan batch',
        'Aturan penamaan kustom',
        'Dukungan prioritas',
        'Magic Folders',
        'Template premium'
      ];
    case PACKAGE_TYPES.BISNIS:
      return [
        'Semua fitur Pro',
        'Kolaborasi tim',
        'Akses API',
        'Integrasi kustom',
        'Dukungan khusus',
        'SLA 99.9%'
      ];
    default:
      return [];
  }
};