import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  Loader2,
  ArrowRight,
  RefreshCw,
  Shield,
  Clock
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_ENDPOINTS, apiPost, ApiResponse } from "@/config/api";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [verificationToken, setVerificationToken] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  // Get token from URL params if available
  const tokenFromUrl = searchParams.get('token');
  const emailFromStorage = JSON.parse(localStorage.getItem('user_data') || '{}')?.email;

  useEffect(() => {
    // Auto-verify if token is in URL
    if (tokenFromUrl) {
      setVerificationToken(tokenFromUrl);
      handleVerifyEmail(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const handleVerifyEmail = async (token?: string) => {
    const tokenToUse = token || verificationToken;
    
    if (!tokenToUse) {
      setError('Verification token is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result: ApiResponse = await apiPost(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
        token: tokenToUse
      });

      if (result.success) {
        setSuccess(result.message);
        setIsVerified(true);
        
        // Update user data in localStorage
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        userData.email_verified = true;
        localStorage.setItem('user_data', JSON.stringify(userData));

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setError(result.message || 'Email verification failed');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!emailFromStorage) {
      setError('Email not found. Please login again.');
      return;
    }

    setResendLoading(true);
    setError('');
    setSuccess('');

    try {
      const result: ApiResponse = await apiPost('/auth/resend-verification', {
        email: emailFromStorage
      });

      if (result.success) {
        setSuccess('Verification email sent successfully. Please check your inbox.');
        setResendCooldown(60); // 1 minute cooldown
      } else {
        setError(result.message || 'Failed to resend verification email');
      }
    } catch (err) {
      console.error('Resend error:', err);
      setError('Network error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerifyEmail();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-blue-500 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-green-500 rounded-full blur-xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="font-mono text-2xl font-semibold">
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded">RAY</span>
              <span className="text-foreground ml-2">MAIZING</span>
            </span>
          </div>
          
          {!isVerified ? (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Verifikasi Email</h1>
              <p className="text-muted-foreground">
                {tokenFromUrl 
                  ? 'Memverifikasi email Anda...' 
                  : 'Masukkan kode verifikasi yang telah dikirim ke email Anda'
                }
              </p>
              {emailFromStorage && (
                <p className="text-sm text-primary mt-2 font-medium">
                  {emailFromStorage}
                </p>
              )}
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-2 text-green-700">Email Terverifikasi!</h1>
              <p className="text-muted-foreground">
                Akun Anda telah berhasil diverifikasi. Anda akan diarahkan ke dashboard.
              </p>
            </>
          )}
        </div>

        {/* Status Messages */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {!isVerified && (
          <div className="file-card p-8 space-y-6">
            {/* Manual Token Input (if no token in URL) */}
            {!tokenFromUrl && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token">Kode Verifikasi</Label>
                  <Input
                    id="token"
                    type="text"
                    placeholder="Masukkan kode verifikasi"
                    value={verificationToken}
                    onChange={(e) => setVerificationToken(e.target.value)}
                    disabled={loading}
                    className="text-center tracking-wider"
                  />
                  <p className="text-xs text-muted-foreground">
                    Periksa email Anda dan masukkan kode verifikasi yang dikirim
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-semibold gradient-primary btn-primary-glow gap-2"
                  disabled={loading || !verificationToken}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Memverifikasi...
                    </>
                  ) : (
                    <>
                      Verifikasi Email
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Loading state for auto-verification */}
            {tokenFromUrl && loading && (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Memverifikasi email Anda...</p>
              </div>
            )}

            {/* Resend Verification */}
            {!tokenFromUrl && (
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">atau</span>
                  </div>
                </div>

                <Button 
                  variant="outline"
                  onClick={handleResendVerification}
                  disabled={resendLoading || resendCooldown > 0}
                  className="w-full h-12 gap-2"
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : resendCooldown > 0 ? (
                    <>
                      <Clock className="w-4 h-4" />
                      Kirim Ulang ({resendCooldown}s)
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Kirim Ulang Email Verifikasi
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        {!isVerified && (
          <div className="mt-6 file-card p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-700 mb-1">Petunjuk Verifikasi</p>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Periksa folder inbox email Anda</li>
                  <li>• Jika tidak ada, cek folder spam/junk</li>
                  <li>• Klik link verifikasi atau salin kode yang dikirim</li>
                  <li>• Kode verifikasi berlaku selama 24 jam</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 text-center space-y-2">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="gap-2"
            disabled={loading}
          >
            {isVerified ? 'Lanjut ke Dashboard' : 'Lewati untuk Sekarang'}
          </Button>
          
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="gap-2 text-sm"
              disabled={loading}
            >
              ← Kembali ke Beranda
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;