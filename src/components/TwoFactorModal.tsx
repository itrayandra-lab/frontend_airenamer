import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Copy, CheckCircle } from 'lucide-react';
import { apiPost } from '@/config/api';

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TwoFactorModal: React.FC<TwoFactorModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSetup = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await apiPost('/2fa/setup');

      if (result.success) {
        setQrCode(result.data.qrCode);
        setSecret(result.data.secret);
        setStep('verify');
      } else {
        setError(result.message || 'Failed to setup 2FA');
      }
    } catch (err) {
      console.error('2FA setup error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await apiPost('/2fa/verify', {
        token: verificationCode
      });

      if (result.success) {
        onSuccess();
        handleClose();
      } else {
        setError(result.message || 'Invalid verification code');
      }
    } catch (err) {
      console.error('2FA verify error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setStep('setup');
    setQrCode('');
    setSecret('');
    setVerificationCode('');
    setError('');
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Aktifkan Autentikasi Dua Faktor
          </DialogTitle>
          <DialogDescription>
            {step === 'setup' 
              ? 'Tambahkan lapisan keamanan ekstra ke akun Anda'
              : 'Scan QR code dengan aplikasi authenticator Anda'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {step === 'setup' ? (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">Autentikasi dua faktor menambahkan lapisan keamanan ekstra dengan memerlukan kode verifikasi saat login.</p>
              <p className="mb-2">Anda akan memerlukan aplikasi authenticator seperti:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Google Authenticator</li>
                <li>Microsoft Authenticator</li>
                <li>Authy</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* QR Code */}
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <img src={qrCode} alt="QR Code" className="w-48 h-48" />
            </div>

            {/* Manual Entry */}
            <div className="space-y-2">
              <Label>Atau masukkan kode manual:</Label>
              <div className="flex gap-2">
                <Input
                  value={secret}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopySecret}
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Verification Code */}
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Kode Verifikasi (6 digit)</Label>
              <Input
                id="verificationCode"
                type="text"
                placeholder="000000"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="text-center text-2xl tracking-widest font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Masukkan kode 6 digit dari aplikasi authenticator Anda
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Batal
          </Button>
          {step === 'setup' ? (
            <Button onClick={handleSetup} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lanjutkan
            </Button>
          ) : (
            <Button onClick={handleVerify} disabled={loading || verificationCode.length !== 6}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verifikasi & Aktifkan
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorModal;
