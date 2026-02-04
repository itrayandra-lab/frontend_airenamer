import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  ArrowLeft, 
  Sparkles,
  Clock,
  Users,
  Zap,
  Star,
  AlertCircle,
  Wallet,
  Building,
  Phone,
  MapPin
} from "lucide-react";
import { useState, useEffect } from "react";

// Midtrans types
declare global {
  interface Window {
    snap: any;
  }
}

const customTiers = [
  { files: 0, price: 0, packageName: "Paket Gratis", packageType: "gratis" },
  { files: 25, price: 0, packageName: "Paket Gratis", packageType: "gratis" },
  { files: 50, price: 0, packageName: "Paket Gratis", packageType: "gratis" },
  { files: 100, price: 75000, packageName: "Paket Pro", packageType: "pro" },
  { files: 250, price: 120000, packageName: "Paket Pro", packageType: "pro" },
  { files: 500, price: 180000, packageName: "Paket Pro", packageType: "pro" },
  { files: 750, price: 240000, packageName: "Paket Pro", packageType: "pro" },
  { files: 1000, price: 300000, packageName: "Paket Pro", packageType: "pro" },
  { files: 1500, price: 450000, packageName: "Paket Bisnis", packageType: "bisnis" },
  { files: 2500, price: 600000, packageName: "Paket Bisnis", packageType: "bisnis" },
  { files: 5000, price: 900000, packageName: "Paket Bisnis", packageType: "bisnis" },
  { files: 10000, price: 1500000, packageName: "Paket Bisnis", packageType: "bisnis" },
  { files: "Unlimited", price: 2000000, packageName: "Paket Bisnis", packageType: "bisnis" },
];

const SubscribePage = () => {
  console.log('SubscribePage component loaded');
  
  const [isAnnual, setIsAnnual] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTier, setSelectedTier] = useState(3); // Default Pro 100 files
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAutoFilled, setUserAutoFilled] = useState(false);
  
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    postalCode: "",
    agreeToTerms: false,
    subscribeNewsletter: true
  });

  // Get tier from URL params and check for logged-in user
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tier = urlParams.get('tier');
    const annual = urlParams.get('annual');
    
    if (tier) {
      const tierIndex = parseInt(tier);
      if (tierIndex >= 0 && tierIndex < customTiers.length) {
        setSelectedTier(tierIndex);
      }
    }
    
    if (annual !== null) {
      setIsAnnual(annual === 'true');
    }

    // Check if user is logged in and auto-fill information
    const userData = localStorage.getItem('user_data');
    const authToken = localStorage.getItem('auth_token');
    
    if (userData && authToken) {
      setIsLoggedIn(true);
      try {
        const user = JSON.parse(userData);
        setCustomerData(prev => ({
          ...prev,
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          email: user.email || '',
          phone: user.phone || '',
          company: user.company_name || '',
          address: user.billing_address || '',
          city: user.billing_city || '',
          postalCode: user.billing_postal_code || ''
        }));
        setUserAutoFilled(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const currentTier = customTiers[selectedTier];
  
  const calculateAnnualPrice = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return 0;
    const yearlyPrice = monthlyPrice * 12;
    const discountedYearlyPrice = Math.round(yearlyPrice * 0.85);
    return Math.round(discountedYearlyPrice / 12);
  };
  
  const displayPrice = isAnnual ? calculateAnnualPrice(currentTier.price) : currentTier.price;
  const totalPrice = isAnnual ? displayPrice * 12 : displayPrice;
  const savings = isAnnual && currentTier.price > 0 ? (currentTier.price * 12) - (displayPrice * 12) : 0;

  const handleInputChange = (field: string, value: string | boolean) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayment = async () => {
    if (!customerData.agreeToTerms) {
      alert('Harap setujui syarat dan ketentuan terlebih dahulu');
      return;
    }

    if (currentTier.price === 0) {
      // Handle free tier - use guest endpoint if not logged in
      try {
        setIsProcessing(true);
        
        const endpoint = isLoggedIn 
          ? `${import.meta.env.VITE_API_BASE_URL}/subscription/create-transaction`
          : `${import.meta.env.VITE_API_BASE_URL}/subscription/guest-transaction`;
        
        const headers = {
          'Content-Type': 'application/json'
        };
        
        if (isLoggedIn) {
          headers['Authorization'] = `Bearer ${localStorage.getItem('auth_token')}`;
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            tier_id: selectedTier,
            billing_cycle: isAnnual ? 'yearly' : 'monthly',
            customer_details: {
              first_name: customerData.firstName,
              last_name: customerData.lastName,
              email: customerData.email,
              phone: customerData.phone,
              company: customerData.company,
              address: customerData.address,
              city: customerData.city,
              postal_code: customerData.postalCode
            }
          })
        });

        const result = await response.json();
        
        if (result.success && result.data.is_free) {
          // If new user was created, store auth token
          if (result.data.auth_token) {
            localStorage.setItem('auth_token', result.data.auth_token);
            localStorage.setItem('user_data', JSON.stringify(result.data.user));
          }
          
          alert('Paket gratis berhasil diaktifkan! Anda akan diarahkan ke dashboard.');
          window.location.href = '/dashboard';
        } else {
          alert('Terjadi kesalahan saat mengaktifkan paket gratis.');
        }
      } catch (error) {
        console.error('Free tier activation error:', error);
        alert('Terjadi kesalahan. Silakan coba lagi.');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    setIsProcessing(true);

    try {
      // Use guest endpoint if not logged in
      const endpoint = isLoggedIn 
        ? `${import.meta.env.VITE_API_BASE_URL}/subscription/create-transaction`
        : `${import.meta.env.VITE_API_BASE_URL}/subscription/guest-transaction`;
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (isLoggedIn) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('auth_token')}`;
      }

      // Create transaction via API
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          tier_id: selectedTier,
          billing_cycle: isAnnual ? 'yearly' : 'monthly',
          customer_details: {
            first_name: customerData.firstName,
            last_name: customerData.lastName,
            email: customerData.email,
            phone: customerData.phone,
            company: customerData.company,
            address: customerData.address,
            city: customerData.city,
            postal_code: customerData.postalCode
          }
        })
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to create transaction');
      }

      // If new user was created, store auth token
      if (result.data.auth_token) {
        localStorage.setItem('auth_token', result.data.auth_token);
        localStorage.setItem('user_data', JSON.stringify(result.data.user));
        setIsLoggedIn(true);
      }

      const { snap_token, order_id } = result.data;
      
      // Load Midtrans Snap if not already loaded
      if (!window.snap) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
          script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Open Midtrans payment popup
      window.snap.pay(snap_token, {
        onSuccess: async function(result: any) {
          console.log('Payment Success:', result);
          
          try {
            // Panggil API untuk update status subscription
            const confirmResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscription/confirm-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
              },
              body: JSON.stringify({
                order_id: order_id,
                transaction_status: 'success',
                payment_data: result
              })
            });

            const confirmResult = await confirmResponse.json();
            
            if (confirmResult.success) {
              console.log('✅ Subscription activated:', confirmResult.data);
              alert('Pembayaran berhasil! Akun Anda telah diaktifkan.');
              // Redirect to success page
              window.location.href = `/payment/success?order_id=${order_id}&status=success`;
            } else {
              console.error('Failed to activate subscription:', confirmResult.message);
              alert('Pembayaran berhasil, tapi gagal mengaktifkan subscription. Silakan hubungi support.');
              window.location.href = `/payment/success?order_id=${order_id}&status=success`;
            }
          } catch (error) {
            console.error('Error confirming payment:', error);
            alert('Pembayaran berhasil, tapi terjadi kesalahan sistem. Silakan hubungi support.');
            window.location.href = `/payment/success?order_id=${order_id}&status=success`;
          }
        },
        onPending: async function(result: any) {
          console.log('Payment Pending:', result);
          
          try {
            // Panggil API untuk update status subscription
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscription/confirm-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
              },
              body: JSON.stringify({
                order_id: order_id,
                transaction_status: 'pending',
                payment_data: result
              })
            });
          } catch (error) {
            console.error('Error updating pending status:', error);
          }
          
          alert('Pembayaran sedang diproses. Kami akan mengirim konfirmasi via email.');
          window.location.href = `/payment/success?order_id=${order_id}&status=pending`;
        },
        onError: async function(result: any) {
          console.log('Payment Error:', result);
          
          try {
            // Panggil API untuk update status subscription
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscription/confirm-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
              },
              body: JSON.stringify({
                order_id: order_id,
                transaction_status: 'failed',
                payment_data: result
              })
            });
          } catch (error) {
            console.error('Error updating failed status:', error);
          }
          
          alert('Terjadi kesalahan dalam pembayaran. Silakan coba lagi.');
        },
        onClose: function() {
          console.log('Payment popup closed');
          // User closed the popup, don't redirect
        }
      });
      
    } catch (error) {
      console.error('Payment Error:', error);
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getPackageIcon = (packageType: string) => {
    switch (packageType) {
      case "gratis": return "🎉";
      case "pro": return "⚡";
      case "bisnis": return "🚀";
      default: return "📦";
    }
  };

  const getPackageColor = (packageType: string) => {
    switch (packageType) {
      case "gratis": return "text-green-600 bg-green-100";
      case "pro": return "text-purple-600 bg-purple-100";
      case "bisnis": return "text-blue-600 bg-blue-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-semibold">
                <span className="bg-primary text-primary-foreground px-1.5 py-0.5 rounded">RAY</span>
                <span className="text-foreground ml-1">MAIZING | autofile</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-green-600" />
            <span>Pembayaran Aman</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Berlangganan <span className="gradient-text">{currentTier.packageName}</span>
            </h1>
            <p className="text-muted-foreground">
              Lengkapi informasi di bawah untuk melanjutkan pembayaran
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Customer Information */}
            <div className="space-y-6">
              {/* User Information Preview (Read-only) */}
              {isLoggedIn && (
                <div className="file-card p-6 bg-blue-50 border-blue-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-700 mb-2">Informasi Akun Anda</p>
                      <p className="text-blue-600 text-sm mb-3">
                        Data berikut akan digunakan untuk pemrosesan pembayaran. Jika perlu mengubah informasi, silakan kunjungi halaman Dashboard setelah pembayaran selesai.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Information Accordion */}
              <div className="file-card p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Informasi Pelanggan
                </h2>
                
                <Accordion type="multiple" defaultValue={[]} className="w-full">
                  {/* Personal Information */}
                  <AccordionItem value="personal">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Informasi Pribadi
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Nama Depan *</Label>
                          <Input
                            id="firstName"
                            value={customerData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            placeholder="John"
                            required
                            readOnly={isLoggedIn}
                            className={isLoggedIn ? "bg-gray-50 cursor-default" : ""}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Nama Belakang *</Label>
                          <Input
                            id="lastName"
                            value={customerData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder="Doe"
                            required
                            readOnly={isLoggedIn}
                            className={isLoggedIn ? "bg-gray-50 cursor-default" : ""}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="john@example.com"
                          required
                          readOnly={isLoggedIn}
                          className={isLoggedIn ? "bg-gray-50 cursor-default" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Nomor Telepon *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            value={customerData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+62 812 3456 7890"
                            className={`pl-10 ${isLoggedIn ? "bg-gray-50 cursor-default" : ""}`}
                            required
                            readOnly={isLoggedIn}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Nama Perusahaan (Opsional)</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="company"
                            value={customerData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            placeholder="PT. Contoh Indonesia"
                            className={`pl-10 ${isLoggedIn ? "bg-gray-50 cursor-default" : ""}`}
                            readOnly={isLoggedIn}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Billing Address */}
                  <AccordionItem value="billing">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Alamat Penagihan
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Alamat Lengkap *</Label>
                        <Input
                          id="address"
                          value={customerData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="Jl. Contoh No. 123"
                          required
                          readOnly={isLoggedIn}
                          className={isLoggedIn ? "bg-gray-50 cursor-default" : ""}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="city">Kota *</Label>
                          <Input
                            id="city"
                            value={customerData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            placeholder="Jakarta"
                            required
                            readOnly={isLoggedIn}
                            className={isLoggedIn ? "bg-gray-50 cursor-default" : ""}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postalCode">Kode Pos *</Label>
                          <Input
                            id="postalCode"
                            value={customerData.postalCode}
                            onChange={(e) => handleInputChange('postalCode', e.target.value)}
                            placeholder="12345"
                            required
                            readOnly={isLoggedIn}
                            className={isLoggedIn ? "bg-gray-50 cursor-default" : ""}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Login Prompt for Non-logged Users Only */}
              {!isLoggedIn && (
                <div className="file-card p-6 bg-blue-50 border-blue-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-700 mb-2">Sudah punya akun?</p>
                      <p className="text-blue-600 text-sm mb-3">
                        Login untuk mengisi informasi secara otomatis dan mempercepat proses pembayaran.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`}
                        className="border-blue-300 text-blue-700 hover:bg-blue-100"
                      >
                        Login Sekarang
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms and Newsletter */}
              <div className="file-card p-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="terms"
                    checked={customerData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                    required
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

                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="newsletter"
                    checked={customerData.subscribeNewsletter}
                    onCheckedChange={(checked) => handleInputChange('subscribeNewsletter', checked as boolean)}
                  />
                  <Label htmlFor="newsletter" className="text-sm leading-relaxed">
                    Saya ingin menerima update produk dan penawaran khusus via email
                  </Label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="space-y-6">
              {/* Package Summary */}
              <div className="file-card p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Ringkasan Pesanan
                </h2>

                <div className="space-y-4">
                  {/* Package Info */}
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl">{getPackageIcon(currentTier.packageType)}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{currentTier.packageName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {typeof currentTier.files === 'number' ? currentTier.files.toLocaleString() : currentTier.files} file per bulan
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getPackageColor(currentTier.packageType)}`}>
                      {currentTier.packageType === 'pro' && '⭐ Populer'}
                      {currentTier.packageType === 'gratis' && 'Gratis'}
                      {currentTier.packageType === 'bisnis' && 'Enterprise'}
                    </div>
                  </div>

                  {/* Billing Cycle */}
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">Siklus Penagihan:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsAnnual(false)}
                        className={`px-3 py-1 rounded text-sm ${!isAnnual ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                      >
                        Bulanan
                      </button>
                      <button
                        onClick={() => setIsAnnual(true)}
                        className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${isAnnual ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                      >
                        Tahunan
                        <span className="text-xs bg-green-500 text-white px-1 py-0.5 rounded">-15%</span>
                      </button>
                    </div>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Harga {isAnnual ? 'Tahunan' : 'Bulanan'}:</span>
                      <span>Rp{(isAnnual ? totalPrice : displayPrice).toLocaleString()}</span>
                    </div>
                    
                    {isAnnual && savings > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Hemat:</span>
                        <span>-Rp{savings.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span>PPN (11%):</span>
                      <span>Rp{Math.round((isAnnual ? totalPrice : displayPrice) * 0.11).toLocaleString()}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-primary">
                      Rp{Math.round((isAnnual ? totalPrice : displayPrice) * 1.11).toLocaleString()}
                    </span>
                  </div>

                  {isAnnual && (
                    <div className="text-xs text-muted-foreground text-center">
                      Ditagih sekaligus untuk 12 bulan
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="file-card p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Metode Pembayaran
                </h3>
                
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Kartu Kredit/Debit (Visa, Mastercard)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Transfer Bank (BCA, Mandiri, BNI, BRI)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>E-Wallet (GoPay, OVO, DANA, ShopeePay)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Minimarket (Alfamart, Indomaret)</span>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="file-card p-4 bg-green-50 border-green-200">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-green-700 mb-1">Pembayaran Aman</p>
                    <p className="text-green-600">
                      Transaksi diproses melalui Midtrans dengan enkripsi SSL 256-bit. 
                      Data kartu kredit tidak disimpan di server kami.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <Button 
                onClick={handlePayment}
                disabled={isProcessing || !customerData.agreeToTerms || currentTier.price === 0 ? false : (!customerData.firstName || !customerData.lastName || !customerData.email || !customerData.phone)}
                className="w-full h-14 text-lg font-semibold gradient-primary btn-primary-glow gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    {currentTier.price === 0 ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Aktifkan Paket Gratis
                      </>
                    ) : (
                      <>
                        <Wallet className="w-5 h-5" />
                        Bayar Sekarang - Rp{Math.round((isAnnual ? totalPrice : displayPrice) * 1.11).toLocaleString()}
                      </>
                    )}
                  </>
                )}
              </Button>

              {/* Money Back Guarantee */}
              <div className="text-center text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Garansi 30 Hari Uang Kembali</span>
                </div>
                <p>Tidak puas? Dapatkan refund 100% dalam 30 hari pertama.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscribePage;