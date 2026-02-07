import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Shield, 
  Smartphone,
  Chrome,
  User,
  Phone,
  Loader2,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_CONFIG, API_ENDPOINTS, apiPost, apiGet, ApiResponse, AuthData } from "@/config/api";
import logoImage from "/assets/img/logo_autofile.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [retryAfter, setRetryAfter] = useState<number>(0);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirmation: "",
    name: "",
    phone: "",
    rememberMe: false,
    referral_code: ""
  });

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        try {
          // Verify token is still valid by calling /auth/me
          const result = await apiGet('/auth/me');
          
          if (result.success && result.data) {
            // Token is valid, redirect to dashboard
            const urlParams = new URLSearchParams(window.location.search);
            const redirectUrl = urlParams.get('redirect');
            
            if (redirectUrl) {
              // Redirect to the specified URL
              window.location.href = decodeURIComponent(redirectUrl);
            } else {
              // Default redirect to dashboard
              navigate('/dashboard');
            }
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            setCheckingAuth(false);
          }
        } catch (error) {
          // Error checking token, clear storage
          console.error('Auth check error:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          setCheckingAuth(false);
        }
      } else {
        setCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  // Countdown timer for rate limiting
  useEffect(() => {
    if (retryAfter > 0) {
      const timer = setInterval(() => {
        setRetryAfter(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [retryAfter]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field-specific errors when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string[]> = {};

    if (!formData.email) {
      errors.email = ['Email is required'];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = ['Please enter a valid email address'];
    }

    if (!formData.password) {
      errors.password = ['Password is required'];
    } else if (!isLogin && formData.password.length < 8) {
      errors.password = ['Password must be at least 8 characters'];
    }

    if (!isLogin) {
      if (!formData.name) {
        errors.name = ['Name is required'];
      } else if (formData.name.length < 2) {
        errors.name = ['Name must be at least 2 characters'];
      } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
        errors.name = ['Name can only contain letters and spaces'];
      }

      if (formData.password !== formData.password_confirmation) {
        errors.password_confirmation = ['Passwords do not match'];
      }

      // Password strength validation - hanya minimal 8 karakter
      // Tidak perlu uppercase, lowercase, number, atau symbol
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (retryAfter > 0 && import.meta.env.MODE !== 'development') {
      setError(`Please wait ${retryAfter} seconds before trying again`);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setFieldErrors({});

    try {
      const endpoint = isLogin ? API_ENDPOINTS.AUTH.LOGIN : API_ENDPOINTS.AUTH.REGISTER;
      const payload = isLogin ? {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        rememberMe: formData.rememberMe
      } : {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        confirmPassword: formData.password_confirmation,
        phone: formData.phone.trim() || null,
        termsAccepted: true,
        privacyAccepted: true,
        referralCode: formData.referral_code.trim() || null,
        marketingOptIn: false
      };

      const result: ApiResponse<AuthData> = await apiPost(endpoint, payload);

      if (result.success && result.data) {
        // Store authentication data
        localStorage.setItem('auth_token', result.data.token);
        localStorage.setItem('user_data', JSON.stringify(result.data.user));

        setSuccess(result.message);

        // Check for redirect URL
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect');

        // Redirect based on user role and verification status
        setTimeout(() => {
          if (result.data?.verificationRequired) {
            navigate('/verify-email');
          } else if (redirectUrl) {
            // Redirect to the specified URL
            window.location.href = decodeURIComponent(redirectUrl);
          } else if (result.data?.user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard');
          }
        }, 1500);

      } else {
        // Handle different types of errors
        if (result.retryAfter && import.meta.env.MODE !== 'development') {
          setRetryAfter(result.retryAfter);
          setError(result.message);
        } else if (result.lockUntil) {
          setError(`Account is locked. ${result.lockUntil ? `Try again after ${new Date(result.lockUntil).toLocaleString()}` : ''}`);
        } else if (result.errors) {
          // Convert Express-validator errors to our format
          const fieldErrors: Record<string, string[]> = {};
          result.errors.forEach(error => {
            if (!fieldErrors[error.param]) {
              fieldErrors[error.param] = [];
            }
            fieldErrors[error.param].push(error.msg);
          });
          setFieldErrors(fieldErrors);
          setError('Please check the form for errors');
        } else {
          setError(result.message || 'Authentication failed');
        }
      }

    } catch (err) {
      console.error('Auth error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Implement OAuth login
    window.location.href = `${API_CONFIG.BACKEND_URL}/api/auth/${provider.toLowerCase()}`;
  };

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: '', color: '' };

    // Simplified: hanya berdasarkan panjang password
    const length = password.length;
    
    if (length < 8) return { strength: 0, label: 'Terlalu Pendek', color: 'bg-red-500' };
    if (length < 12) return { strength: 60, label: 'Cukup', color: 'bg-yellow-500' };
    if (length < 16) return { strength: 80, label: 'Baik', color: 'bg-blue-500' };
    return { strength: 100, label: 'Kuat', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Show loading screen while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center justify-center mb-4">
            <a href="/" className="inline-block hover:opacity-80 transition-opacity">
              <img 
                src={logoImage} 
                alt="Raymaizing Logo" 
                className="h-16 w-auto object-contain"
              />
            </a>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isLogin ? 'Masuk ke Akun Anda' : 'Buat Akun Baru'}
          </h1>
          <p className="text-muted-foreground">
            {isLogin 
              ? 'Akses semua fitur AI Pengatur File dengan akun Anda' 
              : 'Bergabunglah dengan ribuan pengguna yang sudah merasakan kemudahan AI'
            }
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
              {retryAfter > 0 && import.meta.env.MODE !== 'development' && (
                <div className="mt-2 text-sm">
                  Retry in: {Math.floor(retryAfter / 60)}:{(retryAfter % 60).toString().padStart(2, '0')}
                </div>
              )}
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

        {/* Main Form Card */}
        <div className="file-card p-8 space-y-6">
          {/* Social Login */}
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full h-12 gap-3"
              onClick={() => handleSocialLogin('Google')}
              disabled={loading}
            >
              <Chrome className="w-5 h-5" />
              {isLogin ? 'Masuk' : 'Daftar'} dengan Google
            </Button>
          </div>

          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-card px-4 text-sm text-muted-foreground">atau</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={loading}
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-sm text-red-600">{fieldErrors.name[0]}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={loading}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-sm text-red-600">{fieldErrors.email[0]}</p>
              )}
            </div>

            {/* Phone (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon (Opsional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+62 812 3456 7890"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={loading}
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="text-sm text-red-600">{fieldErrors.phone[0]}</p>
                )}
              </div>
            )}

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Password Strength Indicator (Register only) */}
              {!isLogin && formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{passwordStrength.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Minimal 8 karakter
                  </p>
                </div>
              )}
              
              {fieldErrors.password && (
                <p className="text-sm text-red-600">{fieldErrors.password[0]}</p>
              )}
            </div>

            {/* Confirm Password (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password_confirmation"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password_confirmation}
                    onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                    disabled={loading}
                  />
                </div>
                {fieldErrors.password_confirmation && (
                  <p className="text-sm text-red-600">{fieldErrors.password_confirmation[0]}</p>
                )}
              </div>
            )}

            {/* Referral Code (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="referral_code">Kode Referral (Opsional)</Label>
                <Input
                  id="referral_code"
                  type="text"
                  placeholder="Masukkan kode referral"
                  value={formData.referral_code}
                  onChange={(e) => handleInputChange('referral_code', e.target.value.toUpperCase())}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Dapatkan bonus dengan memasukkan kode referral dari teman
                </p>
              </div>
            )}

            {/* Checkboxes */}
            <div className="space-y-3">
              {isLogin ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => handleInputChange('rememberMe', checked as boolean)}
                      disabled={loading}
                    />
                    <Label htmlFor="remember" className="text-sm">Ingat saya</Label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={() => navigate('/forgot-password')}
                    disabled={loading}
                  >
                    Lupa password?
                  </button>
                </div>
              ) : null}
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold gradient-primary btn-primary-glow gap-2"
              disabled={loading || (retryAfter > 0 && import.meta.env.MODE !== 'development')}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isLogin ? 'Masuk...' : 'Membuat Akun...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Masuk' : 'Buat Akun'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          {/* Switch Mode */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                  setFieldErrors({});
                  setFormData({
                    email: "",
                    password: "",
                    password_confirmation: "",
                    name: "",
                    phone: "",
                    rememberMe: false,
                    referral_code: ""
                  });
                }}
                className="text-primary hover:underline font-medium"
                disabled={loading}
              >
                {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
              </button>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 file-card p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-green-700 mb-1">Keamanan Terjamin</p>
              <p className="text-muted-foreground">
                Data Anda dienkripsi dengan standar industri SSL 256-bit. 
                Kami tidak pernah menyimpan atau membagikan informasi pribadi Anda.
              </p>
            </div>
          </div>
        </div>

        {/* 2FA Notice */}
        <div className="mt-4 file-card p-4">
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-700 mb-1">Autentikasi Dua Faktor</p>
              <p className="text-muted-foreground">
                Tingkatkan keamanan akun dengan mengaktifkan 2FA setelah login pertama kali.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="gap-2"
            disabled={loading}
          >
            ← Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;