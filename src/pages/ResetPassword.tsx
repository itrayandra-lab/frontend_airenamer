import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertTriangle,
  KeyRound
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiPost } from '@/config/api';
import logoImage from "/assets/img/logo_autofile.png";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!token) {
      setError('Token reset password tidak valid atau tidak ditemukan');
    }
  }, [token]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = (): boolean => {
    if (!formData.password.trim()) {
      setError('Password baru wajib diisi');
      return false;
    }
    
    if (formData.password.length < 8) {
      setError('Password baru minimal 8 karakter');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Token reset password tidak valid');
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await apiPost('/auth/reset-password', {
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (result.success) {
        setSuccess('Password berhasil direset! Anda akan diarahkan ke halaman login...');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message || 'Gagal mereset password');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string): { strength: string; color: string; percentage: number } => {
    if (!password) return { strength: '', color: '', percentage: 0 };
    
    // Simplified: hanya berdasarkan panjang password
    const length = password.length;
    
    if (length < 8) return { strength: 'Terlalu Pendek', color: 'bg-red-500', percentage: 0 };
    if (length < 12) return { strength: 'Cukup', color: 'bg-yellow-500', percentage: 60 };
    if (length < 16) return { strength: 'Baik', color: 'bg-blue-500', percentage: 80 };
    return { strength: 'Kuat', color: 'bg-green-500', percentage: 100 };
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
              Masukkan password baru Anda.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Status Messages */}
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password Baru *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Masukkan password baru (min. 8 karakter)"
                    disabled={loading || !token}
                    className="pr-10"
                    autoFocus
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
                {formData.password && (
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
                <Label htmlFor="confirmPassword">Konfirmasi Password Baru *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Masukkan ulang password baru"
                    disabled={loading || !token}
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
                    <span className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
                      {formData.password.length >= 8 ? '✓' : '○'}
                    </span>
                    Minimal 8 karakter
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                      {/[A-Z]/.test(formData.password) ? '✓' : '○'}
                    </span>
                    Minimal 1 huruf besar
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                      {/[a-z]/.test(formData.password) ? '✓' : '○'}
                    </span>
                    Minimal 1 huruf kecil
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                      {/[0-9]/.test(formData.password) ? '✓' : '○'}
                    </span>
                    Minimal 1 angka
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={/[@$!%*?&#]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                      {/[@$!%*?&#]/.test(formData.password) ? '✓' : '○'}
                    </span>
                    Minimal 1 karakter spesial (@$!%*?&#)
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading || !token || success !== ''}
                  className="w-full gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mereset Password...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Reset Password
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center mt-6 text-sm text-gray-600">
          Ingat password Anda?{' '}
          <button 
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Login di sini
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
