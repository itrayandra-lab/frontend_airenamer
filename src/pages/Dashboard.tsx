import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  CreditCard, 
  FileText, 
  BarChart3,
  Bell,
  CheckCircle,
  AlertTriangle,
  Loader2,
  MapPin,
  Building,
  Phone,
  Mail,
  Calendar,
  Edit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG, API_ENDPOINTS, apiGet, apiPost } from '@/config/api';
import CompleteProfileModal from '@/components/CompleteProfileModal';

interface UserData {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  role: string;
  email_verified: boolean;
  profile_completed: boolean;
  two_factor_enabled: boolean;
  referral_code: string;
  subscription_status: string;
  files_processed_this_month: number;
  monthly_limit: number;
  created_at: string;
  displayName?: string;
  fullName?: string;
  remainingFiles?: number;
}

interface SubscriptionData {
  id: number;
  name: string;
  file_limit: number;
  price: number;
  billing_cycle: string;
  status: string;
  expires_at: string;
  features: any[];
}

interface UsageData {
  filesProcessedThisMonth: number;
  monthlyLimit: number;
  remainingFiles: number;
  lastUsageReset: string;
  subscriptionStatus: string;
  usagePercentage: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [remainingFiles, setRemainingFiles] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    loadUserData();
  }, []);

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

  const handleResendVerification = async () => {
    if (!user?.email) {
      setError('Email not found. Please login again.');
      return;
    }

    setResendLoading(true);
    setError('');

    try {
      const result = await apiPost('/auth/resend-verification', {
        email: user.email
      });

      if (result.success) {
        setError(''); // Clear any existing errors
        setResendCooldown(60); // 1 minute cooldown
        // Show success message temporarily
        const originalError = error;
        setError('Verification email sent successfully. Please check your inbox.');
        setTimeout(() => {
          setError(originalError);
        }, 5000);
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

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Try to load from localStorage first
      const storedUser = localStorage.getItem('user_data');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // Fetch fresh data from API using our API helper
      const userResult = await apiGet('/auth/me');
      
      if (userResult.success && userResult.data) {
        setUser(userResult.data.user);
        
        // Update localStorage
        localStorage.setItem('user_data', JSON.stringify(userResult.data.user));
        
        // Fetch usage data
        const usageResult = await apiGet('/user/usage');
        if (usageResult.success && usageResult.data) {
          setUsage(usageResult.data.usage);
          setRemainingFiles(usageResult.data.usage.remainingFiles || (userResult.data.user?.monthly_limit || 0) - (userResult.data.user?.files_processed_this_month || 0));
        }

        // Fetch subscription data
        const subscriptionResult = await apiGet('/subscription/current');
        if (subscriptionResult.success && subscriptionResult.data) {
          setSubscription(subscriptionResult.data.subscription);
        }
      } else {
        // Token might be expired or invalid
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('subscription_data');
        navigate('/login');
        return;
      }
    } catch (err) {
      console.error('Load user data error:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout API
      await apiPost('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('subscription_data');
      navigate('/login');
    }
  };

  const handleProfileUpdated = (updatedUser: UserData) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to load user data</p>
          <Button onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const getSubscriptionBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getUsagePercentage = () => {
    if (!user) return 0;
    return Math.round((user.files_processed_this_month / user.monthly_limit) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Selamat datang kembali, {user.first_name} {user.last_name}!</h2>
          <p className="text-gray-600 mt-1">Berikut adalah aktivitas akun Anda hari ini.</p>
        </div>
        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Email Verification Alert */}
        {!user.email_verified && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Please verify your email address to access all features.
              <Button 
                variant="link" 
                className="p-0 ml-2 text-yellow-800 underline hover:text-yellow-900"
                onClick={handleResendVerification}
                disabled={resendLoading || resendCooldown > 0}
              >
                {resendLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                    Sending...
                  </>
                ) : resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : (
                  'Resend verification email'
                )}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Profile Completion Alert */}
        {!user.profile_completed && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Complete your profile to get the most out of our services.
              <Button 
                variant="link" 
                className="p-0 ml-2 text-blue-800 underline"
                onClick={() => setShowCompleteProfileModal(true)}
              >
                Complete profile
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Files Processed */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">File Diproses</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.files_processed_this_month || 0}</div>
              <p className="text-xs text-muted-foreground">
                dari {user?.monthly_limit || 0} bulan ini
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getUsagePercentage()}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Remaining Files */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">File Tersisa</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{remainingFiles}</div>
              <p className="text-xs text-muted-foreground">
                file tersisa bulan ini
              </p>
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Langganan</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{subscription?.package_type || 'Tidak Ada'}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubscriptionBadgeColor(subscription?.status || 'inactive')}`}>
                  {subscription?.status === 'active' ? 'Aktif' : 
                   subscription?.status === 'expired' ? 'Kedaluwarsa' : 
                   subscription?.status === 'cancelled' ? 'Dibatalkan' : 'Tidak Aktif'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Security Score */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skor Keamanan</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user.email_verified && user.two_factor_enabled ? '100%' : 
                 user.email_verified ? '75%' : '50%'}
              </div>
              <p className="text-xs text-muted-foreground">
                {user.two_factor_enabled ? 'Sangat Baik' : 'Baik'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informasi Profil
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowCompleteProfileModal(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" defaultValue={["personal"]} className="w-full">
                  {/* Personal Information */}
                  <AccordionItem value="personal">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Informasi Pribadi
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500">Nama Depan</label>
                          <p className="text-sm text-gray-900">{user.first_name || '-'}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">Nama Belakang</label>
                          <p className="text-sm text-gray-900">{user.last_name || '-'}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">Nama Lengkap</label>
                        <p className="text-sm text-gray-900">{user.first_name} {user.last_name}</p>
                      </div>
                      {user.company_name && (
                        <div>
                          <label className="text-xs font-medium text-gray-500">Perusahaan</label>
                          <p className="text-sm text-gray-900 flex items-center gap-2">
                            <Building className="h-3 w-3" />
                            {user.company_name}
                          </p>
                        </div>
                      )}
                      {user.bio && (
                        <div>
                          <label className="text-xs font-medium text-gray-500">Bio</label>
                          <p className="text-sm text-gray-900">{user.bio}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-xs font-medium text-gray-500">Peran</label>
                        <p className="text-sm text-gray-900 capitalize">{user.role}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Contact Information */}
                  <AccordionItem value="contact">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Informasi Kontak
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500">Email</label>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-900">{user.email}</p>
                          {user.email_verified ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          )}
                        </div>
                      </div>
                      {user.phone && (
                        <div>
                          <label className="text-xs font-medium text-gray-500">Telepon</label>
                          <p className="text-sm text-gray-900 flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Billing Information */}
                  {(user.billing_address || user.billing_city || user.billing_postal_code) && (
                    <AccordionItem value="billing">
                      <AccordionTrigger className="text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Informasi Tagihan
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        {user.billing_full_name && (
                          <div>
                            <label className="text-xs font-medium text-gray-500">Nama Tagihan</label>
                            <p className="text-sm text-gray-900">{user.billing_full_name}</p>
                          </div>
                        )}
                        {user.billing_email && (
                          <div>
                            <label className="text-xs font-medium text-gray-500">Email Tagihan</label>
                            <p className="text-sm text-gray-900">{user.billing_email}</p>
                          </div>
                        )}
                        {user.billing_phone && (
                          <div>
                            <label className="text-xs font-medium text-gray-500">Telepon Tagihan</label>
                            <p className="text-sm text-gray-900">{user.billing_phone}</p>
                          </div>
                        )}
                        {user.billing_address && (
                          <div>
                            <label className="text-xs font-medium text-gray-500">Alamat</label>
                            <p className="text-sm text-gray-900">{user.billing_address}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                          {user.billing_city && (
                            <div>
                              <label className="text-xs font-medium text-gray-500">Kota</label>
                              <p className="text-sm text-gray-900">{user.billing_city}</p>
                            </div>
                          )}
                          {user.billing_postal_code && (
                            <div>
                              <label className="text-xs font-medium text-gray-500">Kode Pos</label>
                              <p className="text-sm text-gray-900">{user.billing_postal_code}</p>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Account Information */}
                  <AccordionItem value="account">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Informasi Akun
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500">Kode Referral</label>
                        <p className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                          {user.referral_code}
                        </p>
                      </div>
                      {user.referred_by && (
                        <div>
                          <label className="text-xs font-medium text-gray-500">Direferensikan Oleh</label>
                          <p className="text-sm text-gray-900 font-mono">{user.referred_by}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500">Anggota Sejak</label>
                          <p className="text-sm text-gray-900 flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {new Date(user.created_at).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        {user.last_login_at && (
                          <div>
                            <label className="text-xs font-medium text-gray-500">Login Terakhir</label>
                            <p className="text-sm text-gray-900">
                              {new Date(user.last_login_at).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500">Status Profil</label>
                          <div className="flex items-center gap-2">
                            {user.profile_completed ? (
                              <>
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span className="text-xs text-green-600">Lengkap</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-3 w-3 text-yellow-600" />
                                <span className="text-xs text-yellow-600">Belum Lengkap</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">Status Akun</label>
                          <div className="flex items-center gap-2">
                            {user.is_active ? (
                              <>
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span className="text-xs text-green-600">Aktif</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-3 w-3 text-red-600" />
                                <span className="text-xs text-red-600">Tidak Aktif</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Detail Langganan
                </CardTitle>
                <CardDescription>
                  Kelola informasi langganan dan tagihan Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {subscription ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Paket</label>
                        <p className="text-lg font-semibold capitalize">{subscription.package_type}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <br />
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSubscriptionBadgeColor(subscription.status)}`}>
                          {subscription.status === 'active' ? 'Aktif' : 
                           subscription.status === 'expired' ? 'Kedaluwarsa' : 
                           subscription.status === 'cancelled' ? 'Dibatalkan' : 'Tidak Aktif'}
                        </span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Batas File</label>
                        <p className="text-lg font-semibold">{subscription?.file_limit || user?.monthly_limit || 0} file/bulan</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Harga</label>
                        <p className="text-lg font-semibold">
                          {subscription.price === 0 ? 'Gratis' : `Rp ${Math.floor(subscription.price).toLocaleString('id-ID')}`}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tanggal Mulai</label>
                        <p className="text-sm text-gray-900">
                          {new Date(subscription.start_date).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tanggal Berakhir</label>
                        <p className="text-sm text-gray-900">
                          {new Date(subscription.end_date).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button onClick={() => navigate('/subscribe')}>
                        Upgrade Paket
                      </Button>
                      <Button variant="outline" onClick={() => navigate('/subscription/history')}>
                        Lihat Riwayat
                      </Button>
                      <Button variant="outline" onClick={() => window.print()}>
                        Cetak Invoice
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Tidak ada langganan aktif</p>
                    <Button onClick={() => navigate('/subscribe')}>
                      Pilih Paket
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security Settings */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Pengaturan Keamanan
              </CardTitle>
              <CardDescription>
                Kelola pengaturan keamanan dan privasi akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Verifikasi Email</h4>
                    <p className="text-sm text-gray-500">Verifikasi alamat email Anda</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.email_verified ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-green-600">Terverifikasi</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <Button size="sm" variant="outline">Verifikasi</Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Autentikasi Dua Faktor</h4>
                    <p className="text-sm text-gray-500">Tambahkan lapisan keamanan ekstra</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.two_factor_enabled ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-green-600">Aktif</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <Button size="sm" variant="outline">Aktifkan</Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Complete Profile Modal */}
      {user && (
        <CompleteProfileModal
          isOpen={showCompleteProfileModal}
          onClose={() => setShowCompleteProfileModal(false)}
          user={user}
          onProfileUpdated={handleProfileUpdated}
        />
      )}
    </div>
  );
};

export default Dashboard;