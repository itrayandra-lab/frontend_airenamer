import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CreditCard, 
  Shield, 
  CheckCircle2, 
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

  // Get tier from URL params using window.location
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

  const initializeMidtrans = () => {
    try {
      // Load Midtrans Snap script
      const script = document.createElement('script');
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'; // Use sandbox for development
      script.setAttribute('data-client-key', 'SB-Mid-client-SANDBOX_CLIENT_KEY'); // Hardcoded for now
      document.head.appendChild(script);
      console.log('Midtrans script loaded');
    } catch (error) {
      console.error('Error loading Midtrans script:', error);
    }
  };

  useEffect(() => {
    initializeMidtrans();
  }, []);

  const handlePayment = async () => {
    if (!customerData.agreeToTerms) {
      alert('Harap setujui syarat dan ketentuan terlebih dahulu');
      return;
    }

    if (currentTier.price === 0) {
      // Handle free tier
      alert('Paket gratis berhasil diaktifkan! Anda akan diarahkan ke dashboard.');
      return;
    }

    setIsProcessing(true);

    try {
      // Create transaction data
      const transactionData = {
        transaction_details: {
          order_id: `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          gross_amount: totalPrice
        },
        customer_details: {
          first_name: customerData.firstName,
          last_name: customerData.lastName,
          email: customerData.email,
          phone: customerData.phone,
          billing_address: {
            first_name: customerData.firstName,
            last_name: customerData.lastName,
            address: customerData.address,
            city: customerData.city,
            postal_code: customerData.postalCode,
            country_code: "IDN"
          }
        },
        item_details: [{
          id: `${currentTier.packageType}-${currentTier.files}`,
          price: totalPrice,
          quantity: 1,
          name: `${currentTier.packageName} - ${typeof currentTier.files === 'number' ? currentTier.files.toLocaleString() : currentTier.files} file${isAnnual ? ' (Tahunan)' : ' (Bulanan)'}`
        }],
        credit_card: {
          secure: true
        },
        custom_expiry: {
          expiry_duration: isAnnual ? 365 : 30,
          unit: "day"
        }
      };

      // In production, you would send this to your backend
      // For now, we'll simulate the Midtrans response
      console.log('Transaction Data:', transactionData);
      
      // Simulate backend response with snap token
      const snapToken = 'SIMULATED_SNAP_TOKEN_' + Date.now();
      
      // Open Midtrans payment popup
      if (window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: function(result: any) {
            console.log('Payment Success:', result);
            alert('Pembayaran berhasil! Akun Anda akan segera diaktifkan.');
            // Redirect to dashboard or success page
          },
          onPending: function(result: any) {
            console.log('Payment Pending:', result);
            alert('Pembayaran sedang diproses. Kami akan mengirim konfirmasi via email.');
          },
          onError: function(result: any) {
            console.log('Payment Error:', result);
            alert('Terjadi kesalahan dalam pembayaran. Silakan coba lagi.');
          },
          onClose: function() {
            console.log('Payment popup closed');
          }
        });
      } else {
        // Fallback if Midtrans not loaded
        alert('Sistem pembayaran sedang dimuat. Silakan coba lagi dalam beberapa saat.');
      }
      
    } catch (error) {
      console.error('Payment Error:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
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
              <div className="file-card p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Informasi Pelanggan
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nama Depan *</Label>
                      <Input
                        id="firstName"
                        value={customerData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="John"
                        required
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
                        className="pl-10"
                        required
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
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="file-card p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Alamat Penagihan
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat Lengkap *</Label>
                    <Input
                      id="address"
                      value={customerData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Jl. Contoh No. 123"
                      required
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
                      />
                    </div>
                  </div>
                </div>
              </div>

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
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Kartu Kredit/Debit (Visa, Mastercard)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Transfer Bank (BCA, Mandiri, BNI, BRI)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>E-Wallet (GoPay, OVO, DANA, ShopeePay)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
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
                        <CheckCircle2 className="w-5 h-5" />
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