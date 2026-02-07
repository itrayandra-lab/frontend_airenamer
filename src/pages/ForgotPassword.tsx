import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  KeyRound,
  Mail,
  Loader2,
  CheckCircle,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { apiPost } from '@/config/api';
import logoImage from "/assets/img/logo_autofile.png";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [step, setStep] = useState<'request' | 'sent'>('request');
  const [email, setEmail] = useState('');

  const handleInputChange = (value: string) => {
    setEmail(value);
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email wajib diisi');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Format email tidak valid');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await apiPost('/auth/forgot-password', {
        email: email.trim()
      });

      if (result.success) {
        setSuccess('Link reset password telah dikirim ke email Anda!');
        setStep('sent');
      } else {
        setError(result.message || 'Gagal mengirim link reset password');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRequest = () => {
    setStep('request');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-blue-500 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-green-500 rounded-full blur-xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block hover:opacity-80 transition-opacity">
            <img 
              src={logoImage} 
              alt="Raymaizing Logo" 
              className="h-16 w-auto object-contain mx-auto"
            />
          </a>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <KeyRound className="w-6 h-6" />
              Reset Password
            </CardTitle>
            <CardDescription>
              {step === 'request' 
                ? 'Masukkan email Anda untuk menerima link reset password.'
                : 'Link reset password telah dikirim ke email Anda.'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {step === 'request' ? (
              <>
                {/* Status Messages */}
                {error && (
                  <Alert className="mb-4 border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <Label htmlFor="reset_email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="reset_email"
                        type="email"
                        value={email}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder="nama@email.com"
                        disabled={loading}
                        className="pl-10"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <strong>Catatan:</strong> Link reset password akan dikirim ke email Anda. 
                      Link tersebut berlaku selama 1 jam. Jika tidak menerima email, 
                      periksa folder spam Anda.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          Kirim Link Reset
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/login')}
                      disabled={loading}
                      className="w-full gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Kembali ke Login
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="space-y-4">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      {success}
                    </AlertDescription>
                  </Alert>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <p className="text-sm text-blue-900">
                      <strong>Langkah selanjutnya:</strong>
                    </p>
                    <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                      <li>Buka email Anda di <strong>{email}</strong></li>
                      <li>Cari email dari RAYMAIZING dengan subjek "Reset Password"</li>
                      <li>Klik link yang ada di email tersebut</li>
                      <li>Masukkan password baru Anda</li>
                    </ol>
                    <p className="text-xs text-blue-700 mt-3">
                      Tidak menerima email? Periksa folder spam atau tunggu beberapa menit.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBackToRequest}
                      className="w-full gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Kirim Ulang
                    </Button>
                    <Button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="w-full"
                    >
                      Kembali ke Login
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center mt-6 text-sm text-gray-600">
          Ingat password Anda?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Login di sini
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
