import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Shield, 
  Smartphone,
  Chrome,
  Github,
  Apple
} from "lucide-react";
import { useState } from "react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    rememberMe: false,
    agreeToTerms: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder untuk authentication logic
    if (isLogin) {
      alert(`Login attempt dengan email: ${formData.email}\nFitur autentikasi akan diimplementasikan!`);
    } else {
      alert(`Registrasi attempt dengan email: ${formData.email}\nFitur registrasi akan diimplementasikan!`);
    }
  };

  const handleSocialLogin = (provider: string) => {
    alert(`${provider} login akan diimplementasikan!`);
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

        {/* Main Form Card */}
        <div className="file-card p-8 space-y-6">
          {/* Social Login */}
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full h-12 gap-3"
              onClick={() => handleSocialLogin('Google')}
            >
              <Chrome className="w-5 h-5" />
              {isLogin ? 'Masuk' : 'Daftar'} dengan Google
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-12 gap-2"
                onClick={() => handleSocialLogin('Apple')}
              >
                <Apple className="w-4 h-4" />
                Apple
              </Button>
              <Button 
                variant="outline" 
                className="h-12 gap-2"
                onClick={() => handleSocialLogin('GitHub')}
              >
                <Github className="w-4 h-4" />
                GitHub
              </Button>
            </div>
          </div>

          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-card px-4 text-sm text-muted-foreground">atau</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields (Register only) */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nama Depan</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required={!isLogin}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nama Belakang</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required={!isLogin}
                  />
                </div>
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
                  required
                />
              </div>
            </div>

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
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-muted-foreground">
                  Minimal 8 karakter dengan kombinasi huruf, angka, dan simbol
                </p>
              )}
            </div>

            {/* Confirm Password (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required={!isLogin}
                  />
                </div>
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
                    />
                    <Label htmlFor="remember" className="text-sm">Ingat saya</Label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={() => alert('Fitur reset password akan diimplementasikan!')}
                  >
                    Lupa password?
                  </button>
                </div>
              ) : (
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                    required={!isLogin}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    Saya setuju dengan{' '}
                    <button type="button" className="text-primary hover:underline">
                      Syarat & Ketentuan
                    </button>{' '}
                    dan{' '}
                    <button type="button" className="text-primary hover:underline">
                      Kebijakan Privasi
                    </button>
                  </Label>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold gradient-primary btn-primary-glow gap-2"
              disabled={!isLogin && !formData.agreeToTerms}
            >
              {isLogin ? 'Masuk' : 'Buat Akun'}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          {/* Switch Mode */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium"
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
            onClick={() => window.history.back()}
            className="gap-2"
          >
            ← Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;