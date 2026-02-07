import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  KeyRound,
  Mail,
  Loader2,
  CheckCircle,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { apiPost } from '@/config/api';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  userEmail = ''
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [step, setStep] = useState<'request' | 'sent'>('request');
  
  const [email, setEmail] = useState(userEmail);

  const handleInputChange = (value: string) => {
    setEmail(value);
    
    // Clear errors when user starts typing
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

  const handleClose = () => {
    setStep('request');
    setEmail(userEmail);
    setError('');
    setSuccess('');
    onClose();
  };

  const handleBackToRequest = () => {
    setStep('request');
    setError('');
    setSuccess('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <KeyRound className="w-5 h-5" />
            Reset Password
          </DialogTitle>
          <DialogDescription>
            {step === 'request' 
              ? 'Masukkan email Anda untuk menerima link reset password.'
              : 'Link reset password telah dikirim ke email Anda.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'request' ? (
          <>
            {/* Status Messages */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
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
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 gap-2"
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
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToRequest}
                  className="flex-1 gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kirim Ulang
                </Button>
                <Button
                  type="button"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Tutup
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordModal;
