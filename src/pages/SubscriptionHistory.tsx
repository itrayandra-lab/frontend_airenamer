import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar, 
  CreditCard, 
  Download, 
  FileText, 
  Loader2,
  Receipt,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiGet } from '@/config/api';

interface SubscriptionHistoryItem {
  id: number;
  name: string;
  price: number;
  original_price?: number;
  currency: string;
  billing_cycle: string;
  status: string;
  payment_id: string;
  created_at: string;
  activated_at?: string;
  expires_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  is_upgrade: boolean;
  prorated_credit?: number;
}

const SubscriptionHistory: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [subscriptions, setSubscriptions] = useState<SubscriptionHistoryItem[]>([]);

  useEffect(() => {
    loadSubscriptionHistory();
  }, []);

  const loadSubscriptionHistory = async () => {
    try {
      const result = await apiGet('/subscription/history');
      
      if (result.success) {
        setSubscriptions(result.data.subscriptions || []);
      } else {
        setError(result.message || 'Failed to load subscription history');
      }
    } catch (err) {
      console.error('Load subscription history error:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border border-green-500/50"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'expired':
        return <Badge className="bg-gray-500/20 text-gray-400 border border-gray-500/50"><Clock className="w-3 h-3 mr-1" />Expired</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500/20 text-red-400 border border-red-500/50"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400 border border-red-500/50"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border border-gray-500/50">{status}</Badge>;
    }
  };

  const formatPrice = (price: number, currency: string = 'IDR') => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const downloadInvoice = (subscription: SubscriptionHistoryItem) => {
    // Generate simple invoice data
    const invoiceData = {
      invoice_number: `INV-${subscription.payment_id}`,
      date: formatDate(subscription.created_at),
      subscription: subscription,
      total: subscription.price
    };

    // Create a simple HTML invoice
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${invoiceData.invoice_number}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 40px; }
          .invoice-details { margin-bottom: 30px; }
          .table { width: 100%; border-collapse: collapse; }
          .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          .table th { background-color: #f5f5f5; }
          .total { text-align: right; font-weight: bold; font-size: 18px; margin-top: 20px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>RAYMAIZING</h1>
          <h2>Invoice</h2>
        </div>
        
        <div class="invoice-details">
          <p><strong>Invoice Number:</strong> ${invoiceData.invoice_number}</p>
          <p><strong>Date:</strong> ${invoiceData.date}</p>
          <p><strong>Payment ID:</strong> ${subscription.payment_id}</p>
        </div>
        
        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Period</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${subscription.name}</td>
              <td>${subscription.billing_cycle}</td>
              <td>${subscription.status}</td>
              <td>${formatPrice(subscription.price, subscription.currency)}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="total">
          Total: ${formatPrice(subscription.price, subscription.currency)}
        </div>
        
        <div style="margin-top: 40px; text-align: center; color: #666;">
          <p>Thank you for your business!</p>
        </div>
      </body>
      </html>
    `;

    // Open in new window and print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading subscription history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Subscription History</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-500/50 bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Subscription History */}
        {subscriptions.length === 0 ? (
          <Card className="bg-card/50 border-border">
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Subscription History</h3>
              <p className="text-muted-foreground mb-6">You haven't made any subscription purchases yet.</p>
              <Button onClick={() => navigate('/subscribe')}>
                Browse Subscription Plans
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id} className="bg-card/50 border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <CreditCard className="w-5 h-5" />
                        {subscription.name}
                        {subscription.is_upgrade && (
                          <Badge variant="outline" className="ml-2 border-primary/50 text-primary">Upgrade</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Payment ID: {subscription.payment_id}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(subscription.status)}
                      <p className="text-lg font-semibold mt-1 text-foreground">
                        {formatPrice(subscription.price, subscription.currency)}
                      </p>
                      {subscription.original_price && subscription.original_price !== subscription.price && (
                        <p className="text-sm text-muted-foreground line-through">
                          {formatPrice(subscription.original_price, subscription.currency)}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Billing Cycle</label>
                      <p className="text-sm text-foreground capitalize">{subscription.billing_cycle}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Created</label>
                      <p className="text-sm text-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(subscription.created_at)}
                      </p>
                    </div>
                    {subscription.activated_at && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Activated</label>
                        <p className="text-sm text-foreground">{formatDate(subscription.activated_at)}</p>
                      </div>
                    )}
                    {subscription.expires_at && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Expires</label>
                        <p className="text-sm text-foreground">{formatDate(subscription.expires_at)}</p>
                      </div>
                    )}
                  </div>

                  {subscription.cancelled_at && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                      <p className="text-sm text-red-400">
                        <strong>Cancelled:</strong> {formatDate(subscription.cancelled_at)}
                        {subscription.cancellation_reason && (
                          <span className="block mt-1">Reason: {subscription.cancellation_reason}</span>
                        )}
                      </p>
                    </div>
                  )}

                  {subscription.prorated_credit && subscription.prorated_credit > 0 && (
                    <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg">
                      <p className="text-sm text-green-400">
                        <strong>Prorated Credit:</strong> {formatPrice(subscription.prorated_credit, subscription.currency)}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadInvoice(subscription)}
                      disabled={subscription.status === 'failed' || subscription.status === 'pending'}
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      Download Invoice
                    </Button>
                    {subscription.status === 'active' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/subscribe')}
                      >
                        Upgrade Plan
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionHistory;