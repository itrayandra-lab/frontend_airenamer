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
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { apiPost } from '@/config/api';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = (): boolean => {
    if (!formData.current_password.trim()) {
      setError('Password saat ini wajib diisi');
      return false;
    }
    
    if (!formData.new_password.trim()) {
      setError('Password baru wajib diisi');
      return false;
    }
    
    if (formData.new_password.length < 8) {
      setError('Password baru minimal 8 karakter');
      return false;
    }
    
    if (formData.new_password === formData.current_password) {
      setError('Password baru harus berbeda dengan password saat ini');
      return false;
    }
    
    if (formData.new_password !== formData.confirm_password) {
      setError('Konfirmasi password tidak cocok');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await apiPost('/auth/change-password', {
        currentPassword: formData.current_password,
        newPassword: formData.new_password,
        confirmPassword: formData.confirm_password
      });

      if (result.success) {
        setSuccess('Password berhasil diubah!');
        
        // Reset form
        setFormData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        
        // Close modal after short delay
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(result.message || 'Gagal mengubah password');
      }
    } catch (err) {
      console.error('Change password error:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string): { strength: string; color: string; percentage: number } => {
    if (!password) return { strength: '', color: '', percentage: 0 };
    
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 12.5;
    if (/[@$!%*?&#]/.test(password)) strength += 12.5;
    
    if (strength < 40) return { strength: 'Lemah', color: 'bg-red-500', percentage: strength };
    if (strength < 70) return { strength: 'Sedang', color: 'bg-yellow-500', percentage: strength };
    return { strength: 'Kuat', color: 'bg-green-500', percentage: strength };
  };

  const passwordStrength = getPasswordStrength(formData.new_password);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Lock className="w-5 h-5" />
            Ubah Password
          </DialogTitle>
          <DialogDescription>
            Masukkan password saat ini dan password baru Anda.
          </DialogDescription>
        </DialogHeader>

        {/* Status Messages */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="current_password">Password Saat Ini *</Label>
            <div className="relative">
              <Input
                id="current_password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={formData.current_password}
                onChange={(e) => handleInputChange('current_password', e.target.value)}
                placeholder="Masukkan password saat ini"
                disabled={loading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="new_password">Password Baru *</Label>
            <div className="relative">
              <Input
                id="new_password"
                type={showNewPassword ? 'text' : 'password'}
                value={formData.new_password}
                onChange={(e) => handleInputChange('new_password', e.target.value)}
                placeholder="Masukkan password baru (min. 8 karakter)"
                disabled={loading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.new_password && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Kekuatan Password:</span>
                  <span className={`font-medium ${
                    passwordStrength.strength === 'Lemah' ? 'text-red-600' :
                    passwordStrength.strength === 'Sedang' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {passwordStrength.strength}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`${passwordStrength.color} h-1.5 rounded-full transition-all duration-300`}
                    style={{ width: `${passwordStrength.percentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm_password">Konfirmasi Password Baru *</Label>
            <div className="relative">
              <Input
                id="confirm_password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirm_password}
                onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                placeholder="Masukkan ulang password baru"
                disabled={loading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs font-medium text-blue-900 mb-2">Persyaratan Password:</p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li className="flex items-center gap-2">
                <span className={formData.new_password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
                  {formData.new_password.length >= 8 ? '✓' : '○'}
                </span>
                Minimal 8 karakter
              </li>
              <li className="flex items-center gap-2">
                <span className={/[A-Z]/.test(formData.new_password) ? 'text-green-600' : 'text-gray-400'}>
                  {/[A-Z]/.test(formData.new_password) ? '✓' : '○'}
                </span>
                Minimal 1 huruf besar
              </li>
              <li className="flex items-center gap-2">
                <span className={/[a-z]/.test(formData.new_password) ? 'text-green-600' : 'text-gray-400'}>
                  {/[a-z]/.test(formData.new_password) ? '✓' : '○'}
                </span>
                Minimal 1 huruf kecil
              </li>
              <li className="flex items-center gap-2">
                <span className={/[0-9]/.test(formData.new_password) ? 'text-green-600' : 'text-gray-400'}>
                  {/[0-9]/.test(formData.new_password) ? '✓' : '○'}
                </span>
                Minimal 1 angka
              </li>
              <li className="flex items-center gap-2">
                <span className={/[@$!%*?&#]/.test(formData.new_password) ? 'text-green-600' : 'text-gray-400'}>
                  {/[@$!%*?&#]/.test(formData.new_password) ? '✓' : '○'}
                </span>
                Minimal 1 karakter spesial (@$!%*?&#)
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
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
                  Mengubah...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Ubah Password
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
