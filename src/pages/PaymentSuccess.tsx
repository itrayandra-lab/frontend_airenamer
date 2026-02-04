import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  ArrowRight, 
  Loader2,
  CreditCard,
  Receipt
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface TransactionStatus {
  subscription_id: number;
  order_id: string;
  transaction_status: string;
  payment_type?: string;
  transaction_time?: string;
  subscription_status: string;
  amount?: string;
}

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<TransactionStatus | null>(null);
  const [error, setError] = useState<string>('');
  const [activating, setActivating] = useState(false);

  const orderId = searchParams.get('order_id');
  const urlStatus = searchParams.get('status');

  useEffect(() => {
    if (!orderId) {
      setError('Order ID tidak ditemukan');
      setLoading(false);
      return;
    }

    checkTransactionStatus();
  }, [orderId]);

  const checkTransactionStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscription/status/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setStatus(result.data);
      } else {
        setError(result.message || 'Gagal mengecek status transaksi');
      }
    } catch (err) {
      console.error('Error checking transaction status:', err);
      setError('Terjadi kesalahan saat mengecek status transaksi');
    } finally {
      setLoading(false);
    }
  };

  const manualActivate = async () => {
    if (!orderId) return;
    
    setActivating(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscription/activate-test/${orderId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh status
        await checkTransactionStatus();
        alert('Subscription berhasil diaktifkan!');
      } else {
        alert(`Gagal mengaktifkan: ${result.message}`);
      }
    } catch (err) {
      console.error('Manual activation error:', err);
      alert('Terjadi kesalahan saat mengaktifkan subscription');
    } finally {
      setActivating(false);
    }
  };

  const getStatusInfo = () => {
    const urlStatus = searchParams.get('status');
    
    // Jika dari URL parameter ada status success, langsung tampilkan success
    if (urlStatus === 'success' || status?.subscription_status === 'active') {
      return {
        icon: <CheckCircle className="w-16 h-16 text-green-500" />,
        title: 'Pembayaran Berhasil!',
        message: 'Terima kasih! Pembayaran Anda telah berhasil dan langganan telah diaktifkan.',
        color: 'green',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    }

    if (urlStatus === 'pending' || status?.transaction_status === 'pending') {
      return {
        icon: <Clock className="w-16 h-16 text-yellow-500" />,
        title: 'Pembayaran Sedang Diproses',
        message: 'Transaksi Anda sedang diproses. Kami akan mengirim konfirmasi via email setelah pembayaran berhasil.',
        color: 'yellow',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      };
    }

    if (status?.transaction_status === 'settlement' || status?.transaction_status === 'capture') {
      return {
        icon: <CheckCircle className="w-16 h-16 text-green-500" />,
        title: 'Pembayaran Berhasil!',
        message: 'Terima kasih! Pembayaran Anda telah berhasil dan langganan telah diaktifkan.',
        color: 'green',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    }

    if (status?.transaction_status === 'deny' || status?.transaction_status === 'cancel' || status?.transaction_status === 'expire' || status?.subscription_status === 'failed') {
      return {
        icon: <XCircle className="w-16 h-16 text-red-500" />,
        title: 'Pembayaran Gagal',
        message: 'Pembayaran tidak dapat diproses. Silakan coba lagi atau hubungi customer service.',
        color: 'red',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }

    return {
      icon: <Clock className="w-16 h-16 text-blue-500" />,
      title: 'Mengecek Status...',
      message: 'Sedang mengecek status pembayaran Anda.',
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Mengecek status pembayaran...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
            <CardTitle className="text-red-700">Terjadi Kesalahan</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate('/subscribe')} className="flex-1">
                Coba Lagi
              </Button>
              <Button onClick={() => navigate('/dashboard')} className="flex-1">
                Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Main Status Card */}
        <Card className={`${statusInfo.bgColor} ${statusInfo.borderColor}`}>
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              {statusInfo.icon}
            </div>
            <CardTitle className={`text-2xl text-${statusInfo.color}-700`}>
              {statusInfo.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className={`text-${statusInfo.color}-600`}>
              {statusInfo.message}
            </p>
            
            {status && (
              <div className="mt-6 p-4 bg-white/50 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Receipt className="w-4 h-4" />
                  Detail Transaksi
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Order ID:</span>
                    <p className="font-mono">{status.order_id}</p>
                  </div>
                  {status.amount && (
                    <div>
                      <span className="text-muted-foreground">Jumlah:</span>
                      <p className="font-semibold">Rp{parseInt(status.amount).toLocaleString()}</p>
                    </div>
                  )}
                  {status.payment_type && (
                    <div>
                      <span className="text-muted-foreground">Metode:</span>
                      <p className="capitalize">{status.payment_type}</p>
                    </div>
                  )}
                  {status.transaction_time && (
                    <div>
                      <span className="text-muted-foreground">Waktu:</span>
                      <p>{new Date(status.transaction_time).toLocaleString('id-ID')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {status?.subscription_status === 'active' ? (
            <>
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="flex-1 h-12 gap-2"
              >
                Buka Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/subscribe')} 
                className="flex-1 h-12"
              >
                Lihat Paket Lain
              </Button>
            </>
          ) : status?.subscription_status === 'failed' ? (
            <>
              <Button 
                onClick={() => navigate('/subscribe')} 
                className="flex-1 h-12 gap-2"
              >
                Coba Lagi
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')} 
                className="flex-1 h-12"
              >
                Dashboard
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={checkTransactionStatus} 
                variant="outline" 
                className="flex-1 h-12 gap-2"
                disabled={loading}
              >
                <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh Status
              </Button>
              {import.meta.env.MODE === 'development' && status?.subscription_status === 'pending' && (
                <Button 
                  onClick={manualActivate} 
                  variant="secondary" 
                  className="flex-1 h-12 gap-2"
                  disabled={activating}
                >
                  {activating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Aktivasi Manual (Test)
                </Button>
              )}
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="flex-1 h-12 gap-2"
              >
                Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {/* Help Section */}
        <Alert>
          <CreditCard className="h-4 w-4" />
          <AlertDescription>
            Jika Anda memiliki pertanyaan tentang pembayaran ini, silakan hubungi customer service kami dengan menyertakan Order ID: <strong>{orderId}</strong>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default PaymentSuccess;